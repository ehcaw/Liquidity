"use client";

import { useState, useEffect } from "react";
import { SearchIcon } from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Database } from "@/types/db";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";

type Transaction = Database["public"]["Tables"]["transactions"]["Row"];
type SortOrder = "newest" | "oldest";
type TimeFrame = "all" | "day" | "week" | "month" | "year";

interface ITransactionsTableProps {
  transactions: Transaction[];
}

export default function TransactionsTable({
  transactions,
}: ITransactionsTableProps) {
  const [filteredTransactions, setFilteredTransactions] =
    useState<Transaction[]>(transactions);
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let filtered = [...transactions];

    if (searchQuery) {
      filtered = filtered.filter((transaction) =>
        transaction.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
      );
    }

    const now = new Date();
    if (timeFrame !== "all") {
      filtered = filtered.filter((transaction) => {
        const transactionDate = new Date(transaction.created_at);
        const diffTime = now.valueOf() - transactionDate.valueOf();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        switch (timeFrame) {
          case "day":
            return diffDays < 1;
          case "week":
            return diffDays < 7;
          case "month":
            return diffDays < 30;
          case "year":
            return diffDays < 365;
          default:
            return true;
        }
      });
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at)
      const dateB = new Date(b.created_at)
      return sortOrder === "newest" ? dateB.valueOf() - dateA.valueOf() : dateA.valueOf() - dateB.valueOf();
    });

    setFilteredTransactions(filtered);
  }, [transactions, sortOrder, timeFrame, searchQuery]);

  const resetFilters = () => {
    setTimeFrame("all");
    setSortOrder("newest");
    setSearchQuery("");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-[300px]">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              disabled={
                timeFrame === "all" &&
                sortOrder === "newest" &&
                !searchQuery
              }
            >
              Reset
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Select
              value={sortOrder}
              onValueChange={(value) => setSortOrder(value as SortOrder)}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="oldest">Oldest first</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={timeFrame}
              onValueChange={(value) => {
                setTimeFrame(value as TimeFrame);
              }}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Time frame" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All time</SelectItem>
                <SelectItem value="day">Last 24 hours</SelectItem>
                <SelectItem value="week">Last week</SelectItem>
                <SelectItem value="month">Last month</SelectItem>
                <SelectItem value="year">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Link href="/transfers">
              <Button>Move Money</Button>
            </Link>
            <Link href="/dashboard/check-deposit">
              <Button>Deposit Check</Button>
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No transactions found matching your filters
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {formatDate(transaction.created_at)}
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>{transaction.transaction_type}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(transaction.status)}>
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className={`text-right ${getAmountColor(transaction.amount)}`}
                    >
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(transaction.balance)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function getStatusVariant(
  status: string,
): "default" | "outline" | "secondary" | "destructive" {
  switch (status) {
    case "Completed":
      return "default";
    case "Pending":
      return "secondary";
    case "Failed":
      return "destructive";
    default:
      return "outline";
  }
}

function getAmountColor(amount: number): string {
  return amount > 0 ? "text-green-600" : "text-red-600";
}
