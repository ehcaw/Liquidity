"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Database } from "@/types/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { formatCurrency, formatDate } from "@/utils/format";

type Account = Database["public"]["Tables"]["accounts"]["Row"];

interface IAccountsTableProps {
  accounts: Account[];
}

export default function AccountsTable({ accounts }: IAccountsTableProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle>Your Accounts</CardTitle>
            <CardDescription>Manage your bank accounts</CardDescription>
          </div>
          <Link href="/account/create">
            <Button>Create Account</Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Account Number</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            {accounts.length === 0 ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={6}>
                    <div className="flex items-center justify-center h-24 text-center">
                      <p className="text-sm text-gray-500">No accounts found</p>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {accounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/account/${account.account_number}`}
                        className="hover:underline text-primary"
                      >
                        {account.name}
                      </Link>
                    </TableCell>
                    <TableCell className="capitalize">
                      {account.account_type}
                    </TableCell>
                    <TableCell>{account.account_number}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(account.balance)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{account.status}</Badge>
                    </TableCell>
                    <TableCell>{formatDate(account.created_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
