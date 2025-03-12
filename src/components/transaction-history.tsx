"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TransactionHistoryProps {
  accountId: string;
}

// Sample data - in a real app, this would come from your API
const transactions = [
  {
    id: "tx1",
    createdAt: "2023-06-15T14:32:00Z",
    amount: -120.5,
    resultingBalance: 8245.32,
    status: "complete",
    type: "payment",
    description: "Electric Bill Payment",
  },
  {
    id: "tx2",
    createdAt: "2023-06-14T09:15:00Z",
    amount: 1500.0,
    resultingBalance: 8365.82,
    status: "complete",
    type: "deposit",
    description: "Payroll Deposit",
  },
  {
    id: "tx3",
    createdAt: "2023-06-13T18:45:00Z",
    amount: -45.99,
    resultingBalance: 6865.82,
    status: "complete",
    type: "payment",
    description: "Online Purchase",
  },
  {
    id: "tx4",
    createdAt: "2023-06-12T12:30:00Z",
    amount: -200.0,
    resultingBalance: 6911.81,
    status: "complete",
    type: "transfer",
    description: "Transfer to Savings",
  },
  {
    id: "tx5",
    createdAt: "2023-06-11T16:20:00Z",
    amount: -85.75,
    resultingBalance: 7111.81,
    status: "complete",
    type: "withdraw",
    description: "ATM Withdrawal",
  },
  {
    id: "tx6",
    createdAt: "2023-06-10T10:05:00Z",
    amount: -100.0,
    resultingBalance: 7197.56,
    status: "pending",
    type: "payment",
    description: "Pending Payment",
  },
  {
    id: "tx7",
    createdAt: "2023-06-09T14:50:00Z",
    amount: -65.32,
    resultingBalance: 7297.56,
    status: "failed",
    type: "payment",
    description: "Failed Payment",
  },
];

export function TransactionHistory({ accountId }: TransactionHistoryProps) {
  const [timeFilter, setTimeFilter] = useState("30days");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "complete":
        return <Badge className="bg-emerald-500">Complete</Badge>;
      case "pending":
        return (
          <Badge variant="outline" className="text-amber-500 border-amber-500">
            Pending
          </Badge>
        );
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "withdraw":
        return <span className="capitalize">Withdrawal</span>;
      default:
        return <span className="capitalize">{type}</span>;
    }
  };

  const getAmountColor = (amount: number) => {
    return amount < 0 ? "text-red-500" : "text-emerald-500";
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Showing transaction history for account #{accountId}
        </div>
        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="90days">Last 90 days</SelectItem>
            <SelectItem value="year">Last year</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & Time</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                <TableCell
                  className={`text-right ${getAmountColor(transaction.amount)}`}
                >
                  {formatCurrency(transaction.amount)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(transaction.resultingBalance)}
                </TableCell>
                <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                <TableCell>{getTypeLabel(transaction.type)}</TableCell>
                <TableCell>{transaction.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
