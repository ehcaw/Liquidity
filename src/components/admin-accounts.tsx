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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database } from "@/types/db";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Download, ArrowUpDown } from "lucide-react";
import { format } from "date-fns";

type Account = Database["public"]["Tables"]["accounts"]["Row"];

interface AccountsTableProps {
  data: Account[];
}

export function AccountsTable({ data = [] }: AccountsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [accountType, setAccountType] = useState("all");
  const [accountStatus, setAccountStatus] = useState("all");

  const filteredAccounts = data.filter((account) => {
    const accountName = account.name || '';
    const accountNumber = account.account_number || '';
    const accountId = account.id?.toString() || '';
    
    const searchTermLower = searchTerm.toLowerCase();
    
    const matchesSearch =
      accountName.toLowerCase().includes(searchTermLower) ||
      accountNumber.includes(searchTerm) ||
      accountId.includes(searchTerm);

    const matchesType = 
      accountType === "all" || 
      (account.account_type || '').toLowerCase() === accountType.toLowerCase();

    const matchesStatus =
      accountStatus === "all" || 
      (account.status || '').toLowerCase() === accountStatus.toLowerCase();

    return matchesSearch && matchesType && matchesStatus;
  });

  // Helper function to safely format balance
  const formatBalance = (balance?: number) => {
    return (balance || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Accounts</h1>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" /> Export
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Management</CardTitle>
          <CardDescription>View and manage all bank accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 md:space-x-4 mb-4">
            <div className="flex items-center space-x-4">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search accounts..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
              <Select value={accountType} onValueChange={setAccountType}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Account Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="checking">Checking</SelectItem>
                  <SelectItem value="savings">Savings</SelectItem>
                </SelectContent>
              </Select>
              <Select value={accountStatus} onValueChange={setAccountStatus}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="frozen">Frozen</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdrawn">Overdrawn</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Account Number</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      Balance
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAccounts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No accounts found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAccounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell className="font-medium">ACC-{(account.id || '').toString().padStart(6, '0')}</TableCell>
                      <TableCell>{account.account_number || 'N/A'}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {account.name || 'Unnamed Account'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getTypeVariant(account.account_type)}>
                          {account.account_type || 'Unknown'}
                        </Badge>
                      </TableCell>
                      <TableCell className={`font-medium ${
                        (account.balance || 0) < 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        ${formatBalance(account.balance)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(account.status)}>
                          {account.status || 'Unknown'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {account.created_at ? format(new Date(account.created_at), 'MMM dd, yyyy') : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
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
function getStatusVariant(status?: string) {
  switch (status) {
    case 'Active':
      return 'default';
    case 'Pending':
      return 'secondary';
    case 'Frozen':
      return 'secondary';
    case 'Closed':
      return 'destructive';
    case 'Overdrawn':
      return 'destructive';
    default:
      return 'outline';
  }
}

function getTypeVariant(type?: string) {
  switch (type) {
    case 'Checking':
      return 'default';
    case 'Savings':
      return 'secondary';
    default:
      return 'outline';
  }
}