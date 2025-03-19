"use client";

import { Database } from "@/types/db";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatAccountNumber, formatDate } from "@/utils/format";

type Account = Database["public"]["Tables"]["accounts"]["Row"];

interface IAccountsDetailsProps {
  account: Account;
}

function getStatusVariant(status: string): "default" | "outline" | "secondary" | "destructive" {
  switch (status) {
    case "Active":
      return "default"
    case "Pending":
      return "secondary"
    case "Frozen":
      return "destructive"
    default:
      return "outline"
  }
}

const AccountsHeader: React.FC<IAccountsDetailsProps> = ({ account }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{account.name}</h1>
            <p className="text-sm text-muted-foreground">{account.account_type}</p>
            <Badge variant={getStatusVariant(account.status)} className="mt-2">
              {account.status}
            </Badge>
          </div>
          <div className="text-right">
            <p className="text-lg">Created: {formatDate(account.created_at)}</p>
            <p className="text-muted-foreground">
              Account Number: <span className="font-mono">{formatAccountNumber(account.account_number)}</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountsHeader;
