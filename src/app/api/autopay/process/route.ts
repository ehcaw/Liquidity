import { createClient } from "@/utils/supabase/server";
import { ClientError, ServerError } from "@/utils/exceptions";
import { NextRequest } from "next/server";
import { transfer } from "@/services/banking/account";
import { Database } from "@/types/db";

type PaymentScheduleWithAccount = Database["public"]["Tables"]["payment_schedule"]["Row"] & {
  accounts: {
    account_number: string;
  };
};

// Define the ProcessingResult type to match what's expected in the component
export interface ProcessingResult {
  processed: number;
  successful: number;
  failed: number;
  results: Array<{
    scheduleId: number;
    status: string;
    amount?: number;
    error?: string;
  }>;
}

// This would be called by a scheduled job/cron
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const today = new Date();
    // Convert JavaScript day (0 = Sunday) to your enum values
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = days[today.getDay()];
    
    // Format today's date as YYYY-MM-DD
    const todayFormatted = today.toISOString().split('T')[0];
    
    // Get all active weekly schedules for today's day of week
    const { data: schedules, error: fetchError } = await supabase
      .from('payment_schedule')
      .select(`
        id, 
        amount, 
        start_date, 
        end_date, 
        day_of_week,
        account_id,
        description,
        accounts:account_id(account_number)
      `)
      .eq('frequency', 'Weekly')
      .eq('day_of_week', dayOfWeek)
      .eq('status', 'Active')
      .lte('start_date', todayFormatted)
      .gte('end_date', todayFormatted);
      
    if (fetchError) {
      throw new ServerError(fetchError.message);
    }
    
    // Process each scheduled payment
    const results: ProcessingResult['results'] = [];
    for (const schedule of (schedules as PaymentScheduleWithAccount[] || [])) {
      try {
        // Get source account number - ensure we have account_number
        if (!schedule.accounts || !schedule.accounts.account_number) {
          results.push({
            scheduleId: schedule.id,
            status: 'failed',
            error: 'Source account not found'
          });
          continue;
        }
        
        const sourceAccountNumber = schedule.accounts.account_number;
        
        // Here we'd normally get the destination account from a separate table
        // For this example, we'll assume it's stored in the description for simplicity
        let destinationAccountNumber = null;
        
        if (schedule.description && schedule.description.includes('Account:')) {
          const match = schedule.description.match(/Account:\s*(\d+)/);
          if (match && match[1]) {
            destinationAccountNumber = match[1];
          }
        }
        
        if (!destinationAccountNumber) {
          results.push({
            scheduleId: schedule.id,
            status: 'failed',
            error: 'No destination account found in description'
          });
          continue;
        }
        
        // Process the transfer
        await transfer(
          sourceAccountNumber, 
          destinationAccountNumber, 
          schedule.amount,
          true // Create transaction records
        );
        
        results.push({
          scheduleId: schedule.id,
          status: 'success',
          amount: schedule.amount
        });
      } catch (error) {
        results.push({
          scheduleId: schedule.id,
          status: 'failed',
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
    
    // Calculate summary statistics
    const successful = results.filter(r => r.status === 'success').length;
    const processed = results.length;
    const failed = processed - successful;
    
    return Response.json({ 
      data: {
        processed,
        successful,
        failed,
        results
      } 
    });
  } catch (error) {
    if (error instanceof ClientError) {
      return Response.json({ error: error.message }, { status: error.status });
    } else if (error instanceof ServerError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    return Response.json({ error: String(error) }, { status: 500 });
  }
}