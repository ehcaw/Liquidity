"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowRightLeft } from "lucide-react";
import { AccountComboBox } from "@/components/account-combobox";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { TransferFormSchema } from "@/utils/zod/form";
import { Database } from "@/types/db";
import useFetch from "@/hooks/useFetch";
import { useRouter } from "next/navigation";

type FormValues = z.infer<typeof TransferFormSchema>;
type Account = Database["public"]["Tables"]["accounts"]["Row"];
type Transaction = Database["public"]["Tables"]["transactions"]["Row"];

export interface ITransferFormProps {
  accounts: Account[];
}

export default function TransferForm({ accounts }: ITransferFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { fetchData } = useFetch();
  const router = useRouter();
  const [error, setError] = useState<string>(
    accounts.length === 0
      ? "You don't have any accounts to transfer from."
      : "",
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(TransferFormSchema),
    defaultValues: {
      fromAccount: "",
      toAccount: "",
      amount: 0,
    },
  });

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);

    fetchData<Transaction>("/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        src_account_number: values.fromAccount,
        dest_account_number: values.toAccount,
        amount: values.amount,
        transaction_type: "Transfer",
      }),
    })
      .then(() => {
        router.push(`/dashboard`);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5" />
            New Transfer
          </CardTitle>
          <CardDescription>
            Transfer money between your accounts
          </CardDescription>
          {error && <p className="text-red-500">{error}</p>}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fromAccount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From Account</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select account" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {accounts.map((account) => (
                            <SelectItem
                              key={account.id}
                              value={account.account_number}
                            >
                              {account.name} - ${account.balance}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                control={form.control}
                name="toAccount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To Account</FormLabel>
                    <FormControl>
                      <AccountComboBox
                        accounts={accounts}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Enter Account"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                />
              </div>

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          $
                        </span>
                        <Input
                          {...field}
                          type="number"
                          step="0.01"
                          min="0.01"
                          placeholder="0.00"
                          className="pl-7"
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Enter the amount you want to transfer
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmTransfer"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Confirm Transfer</FormLabel>
                      <FormDescription>
                        I authorize this transfer and confirm the details are
                        correct.
                      </FormDescription>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Transfer"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
