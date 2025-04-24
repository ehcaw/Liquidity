import { createClient } from "@/utils/supabase/server";
import { ClientError, ServerError } from "@/utils/exceptions";
import { getAuthUser } from "@/services/auth/auth";
import { getUserAccount } from "@/services/banking/account";
import { NextRequest } from "next/server";
import { z } from "zod";

// Schema for creating a new auto-payment
const AutopaymentSchema = z.object({
  source_account_number: z.string(),
  destination_account_number: z.string(),
  amount: z.number().positive(),
  day_of_week: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD format
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD format
  description: z.string()
});

// GET handler for retrieving all auto-payments
export async function GET() {
  try {
    const authUser = await getAuthUser();
    const supabase = await createClient();
    
    // Get all accounts belonging to the user
    const { data: accounts, error: accountsError } = await supabase
      .from('accounts')
      .select('id')
      .eq('user_id', authUser.id);
      
    if (accountsError) {
      throw new ServerError(accountsError.message);
    }
    
    const accountIds = accounts.map(acc => acc.id);
    
    // Get all payment schedules for these accounts
    const { data: schedules, error: schedulesError } = await supabase
      .from('payment_schedule')
      .select(`
        id, 
        created_at, 
        amount, 
        start_date, 
        end_date, 
        status, 
        frequency, 
        day_of_week, 
        accounts(account_number, name, account_type)
      `)
      .in('account_id', accountIds)
      .eq('frequency', 'Weekly');
      
    if (schedulesError) {
      throw new ServerError(schedulesError.message);
    }
    
    return Response.json({ data: schedules });
  } catch (error) {
    if (error instanceof ClientError) {
      return Response.json({ error: error.message }, { status: error.status });
    } else if (error instanceof ServerError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    return Response.json({ error: String(error) }, { status: 500 });
  }
}

// POST handler for creating a new auto-payment
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate request body
    const validatedData = AutopaymentSchema.parse(body);
    
    // Verify user and accounts
    const authUser = await getAuthUser();
    const sourceAccount = await getUserAccount(validatedData.source_account_number);
    
    // Optional: Verify destination account exists
    // const destAccount = await getUserAccount(validatedData.destination_account_number);
    
    const supabase = await createClient();
    
    // Create the payment schedule
    const { data, error } = await supabase
      .from('payment_schedule')
      .insert({
        amount: validatedData.amount,
        start_date: validatedData.start_date,
        end_date: validatedData.end_date,
        frequency: 'Weekly',
        day_of_week: validatedData.day_of_week,
        status: 'Active',
        account_id: sourceAccount.id,
        description: validatedData.description
      })
      .select();
      
    if (error) {
      throw new ServerError(error.message);
    }
    
    return Response.json({ data: data[0] }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.errors }, { status: 400 });
    } else if (error instanceof ClientError) {
      return Response.json({ error: error.message }, { status: error.status });
    } else if (error instanceof ServerError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    return Response.json({ error: String(error) }, { status: 500 });
  }
}

// DELETE endpoint to cancel an autopayment
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      throw new ClientError('Payment schedule ID is required', 400);
    }
    
    const authUser = await getAuthUser();
    const supabase = await createClient();
    
    // Get the payment schedule with its associated account
    const { data: schedule, error: fetchError } = await supabase
      .from('payment_schedule')
      .select('id, account_id, accounts!inner(user_id)')
      .eq('id', id)
      .single();
      
    if (fetchError) {
      throw new ServerError(fetchError.message);
    }
    
    // Verify that the schedule belongs to the authenticated user
    if (!schedule || schedule.accounts.user_id !== authUser.id) {
      throw new ClientError('Payment schedule not found or unauthorized', 404);
    }
    
    // Delete the payment schedule
    const { error: deleteError } = await supabase
      .from('payment_schedule')
      .delete()
      .eq('id', id);
      
    if (deleteError) {
      throw new ServerError(deleteError.message);
    }
    
    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof ClientError) {
      return Response.json({ error: error.message }, { status: error.status });
    } else if (error instanceof ServerError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    return Response.json({ error: String(error) }, { status: 500 });
  }
}