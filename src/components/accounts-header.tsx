"use client";

import { Database } from "@/types/db";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatAccountNumber, formatDate } from "@/utils/format";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import useFetch from "@/hooks/useFetch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Account = Database["public"]["Tables"]["accounts"]["Row"];

interface IAccountsDetailsProps {
  account: Account;
}

function getStatusVariant(
  status: string,
): "default" | "outline" | "secondary" | "destructive" {
  switch (status) {
    case "Active":
      return "default";
    case "Pending":
      return "secondary";
    case "Frozen":
      return "destructive";
    default:
      return "outline";
  }
}

const AccountsHeader: React.FC<IAccountsDetailsProps> = ({
  account: accountProp,
}) => {
  const [account] = useState<Account>(accountProp);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex space-x-4">
              <h1 className="text-2xl font-bold">{account.name}</h1>
              {account.status === "Active" ? (
                <CloseAccountButton account={account} />
              ) : (
                <ActivateAccountButton
                  account={account}
                />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {account.account_type}
            </p>
            <Badge variant={getStatusVariant(account.status)} className="mt-2">
              {account.status}
            </Badge>
          </div>
          <div className="text-right">
            <p className="text-lg">Created: {formatDate(account.created_at)}</p>
            <p className="text-muted-foreground">
              Account Number:{" "}
              <span className="font-mono">
                {formatAccountNumber(account.account_number)}
              </span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const CloseAccountButton = ({
  account,
}: {
  account: Account;
}) => {
  const { fetchData } = useFetch();
  const router = useRouter();

  const handleCloseAccount = () => {
    fetchData(`/api/account/${account.account_number}/close`, {
      method: "POST",
    })
      .then(() => {
        router.replace("/dashboard");
        toast.success("Account closed successfully");
      })
      .catch(() => {
        toast.error("Error closing account");
      });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" className={"bg-red-500"}>
          Close Account
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to close this account?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Your account can be activated again, but you will not be able to
            make any transactions while the account is closed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500"
            onClick={handleCloseAccount}
          >
            Close Account
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const ActivateAccountButton = ({
  account,
}: {
  account: Account;
}) => {
  const { fetchData } = useFetch();
  const router = useRouter();

  const handleActivateAccount = () => {
    fetchData(`/api/account/${account.account_number}/activate`, {
      method: "POST",
    })
      .then(() => {
        router.replace("/dashboard");
        toast.success("Account activated successfully");
      })
      .catch(() => {
        toast.error("Error activating account");
      });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" className={"bg-green-500"}>
          Activate Account
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to activate this account?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-green-500"
            onClick={handleActivateAccount}
          >
            Activate Account
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AccountsHeader;
