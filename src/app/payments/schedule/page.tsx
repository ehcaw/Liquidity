import AutoPayForm from '@/components/autopay-form'
import { Database } from '@/types/db';
import { fetchData } from '@/utils/fetch';
import React from 'react'

type Account = Database["public"]["Tables"]["accounts"]["Row"];
export default async function AutoPay() {
  const accounts = await fetchData<Account[]>("/api/account?status=active");
  return (
    <AutoPayForm accounts={accounts} />
  )
}
