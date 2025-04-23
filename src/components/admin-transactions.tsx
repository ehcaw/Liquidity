
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Database } from "@/types/db";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, ArrowUpDown } from "lucide-react";
import { format } from "date-fns";

type Transaction = Database["public"]["Tables"]["transactions"]["Row"];

interface TransactionsTableProps {
    data: Transaction[];
  }
  

export function TransactionsTable({ data }: TransactionsTableProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [transactionType, setTransactionType] = useState("all");
    const [transactionStatus, setTransactionStatus] = useState("all");
  
    const filteredTransactions = data.filter((transaction) => {
      const matchesSearch =
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.id.toString().includes(searchTerm) ||
        transaction.account_id.toString().includes(searchTerm);
  
      const matchesType = 
        transactionType === "all" || 
        transaction.transaction_type.toLowerCase() === transactionType.toLowerCase();
  
      const matchesStatus =
        transactionStatus === "all" || 
        transaction.status.toLowerCase() === transactionStatus.toLowerCase();
  
      return matchesSearch && matchesType && matchesStatus;
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Transactions</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>View and manage all transactions across accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 md:space-x-4 mb-4">
            <div className="flex items-center space-x-4">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
              <Select value={transactionType} onValueChange={setTransactionType}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Transaction Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="deposit">Deposit</SelectItem>
                  <SelectItem value="withdrawal">Withdrawal</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                  <SelectItem value="payment">Payment</SelectItem>
                </SelectContent>
              </Select>
              <Select value={transactionStatus} onValueChange={setTransactionStatus}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="complete">Complete</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      Amount
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      No transactions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">TXN-{transaction.id.toString().padStart(6, '0')}</TableCell>
                      <TableCell>A-{transaction.account_id.toString().padStart(4, '0')}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {transaction.description}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getTypeVariant(transaction.transaction_type)}>
                          {transaction.transaction_type}
                        </Badge>
                      </TableCell>
                      <TableCell className={`font-medium ${
                        transaction.transaction_type === 'Deposit' 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {transaction.transaction_type === 'Deposit' ? '+' : '-'}$
                        {Math.abs(transaction.amount).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell>
                        ${transaction.balance.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(transaction.created_at), 'MMM dd, yyyy HH:mm')}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper functions for badge variants
function getStatusVariant(status: string) {
  switch (status) {
    case 'Complete':
      return 'default';
    case 'Pending':
      return 'secondary';
    case 'Failed':
      return 'destructive';
    default:
      return 'outline';
  }
}

function getTypeVariant(type: string) {
  switch (type) {
    case 'Deposit':
      return 'default';
    case 'Withdrawal':
      return 'destructive';
    case 'Transfer':
      return 'secondary';
    case 'Payment':
      return 'outline';
    default:
      return 'outline';
  }
}