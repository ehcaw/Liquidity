import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const supabase = createClient();
  
  const filters = await req.json();

  const { data, error } = await supabase.rpc('admin_search_accounts', {
    min_balance: filters.minBalance,
    max_balance: filters.maxBalance,
    zip_codes: filters.zipCodes,
    date_from: filters.dateRange?.from,
    date_to: filters.dateRange?.to,
    min_tx_amount: filters.minTransactionAmount,
    statuses: filters.statuses,
    limit_rows: filters.limit || 100,
    offset_rows: filters.offset || 0
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}