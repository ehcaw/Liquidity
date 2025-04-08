// app/api/test/connection/route.ts
import { testSupabaseConnection } from '@/utils/supabase/test-connection';
import { NextResponse } from 'next/server';

export async function GET() {
  const result = await testSupabaseConnection();
  
  if (!result.success) {
    return NextResponse.json(
      { error: result.error },
      { status: 500 }
    );
  }
  
  return NextResponse.json({
    status: "healthy",
    sampleData: result.data
  });
}