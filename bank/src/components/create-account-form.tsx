"use client";

import React, { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowRight, CheckCircle2, CreditCard, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import TermsAndConditions from "@/components/terms-and-conditions";
import { Input } from "@/components/ui/input";
import { CreateAccountFormSchema } from "@/utils/zod/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useRouter } from "next/navigation";
import useFetch from "@/hooks/useFetch";
import { Database } from "@/types/db";

type FormValues = z.infer<typeof CreateAccountFormSchema>;
type Account = Database["public"]["Tables"]["accounts"]["Row"];

const CreateAccountForm = () => {
  const router = useRouter();
  const { fetchData } = useFetch();
  const [createAccount] = useState<FormValues>({
    account_name: "",
    account_type: "Checking",
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(CreateAccountFormSchema),
    defaultValues: createAccount,
  });

  const onSubmit = async (data: FormValues) => {
    await fetchData<Account>("/api/account", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(() => {
          router.push("/dashboard");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold">Create Account</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-3xl"
        >
          <FormField
            control={form.control}
            name="account_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Name</FormLabel>
                <FormControl>
                  <Input
                    required
                    maxLength={50}
                    placeholder="Primary Checking, Vacation Savings, etc."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Choose a name that helps you identify this account (50
                  characters max)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="account_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Type</FormLabel>
                <FormControl>
                  <RadioGroup
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    required
                  >
                    <FormItem>
                      <FormControl>
                        <RadioGroupItem
                          value="Checking"
                          className="peer sr-only"
                        />
                      </FormControl>
                      <FormLabel className="flex flex-col h-full p-6 border-2 rounded-lg cursor-pointer hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5">
                        <div className="flex items-center mb-4">
                          <CreditCard className="h-6 w-6 mr-2" />
                          <span className="font-semibold text-lg">
                            Checking Account
                          </span>
                          {field.value === "Checking" && (
                            <CheckCircle2 className="h-5 w-5 ml-auto text-primary" />
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p className="mb-2">
                            A checking account is designed for everyday
                            transactions:
                          </p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>
                              Easy access to your money for daily expenses
                            </li>
                            <li>
                              Debit card for purchases and ATM withdrawals
                            </li>
                            <li>Online bill payments and transfers</li>
                            <li>Unlimited transactions with minimal fees</li>
                          </ul>
                        </div>
                      </FormLabel>
                    </FormItem>

                    <FormItem>
                      <FormControl>
                        <RadioGroupItem
                          value="Savings"
                          className="peer sr-only"
                        />
                      </FormControl>
                      <FormLabel className="flex flex-col h-full p-6 border-2 rounded-lg cursor-pointer hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5">
                        <div className="flex items-center mb-4">
                          <Wallet className="h-6 w-6 mr-2" />
                          <span className="font-semibold text-lg">
                            Savings Account
                          </span>
                          {field.value === "Savings" && (
                            <CheckCircle2 className="h-5 w-5 ml-auto text-primary" />
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p className="mb-2">
                            A savings account helps you build your financial
                            future:
                          </p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Higher interest rates to grow your money</li>
                            <li>Limited transactions to encourage saving</li>
                            <li>
                              Separate from daily spending for better budgeting
                            </li>
                            <li>
                              Perfect for emergency funds and future goals
                            </li>
                          </ul>
                        </div>
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox id="terms" required />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the terms and conditions
                </label>
                <p className="text-xs text-muted-foreground flex items-center">
                  By creating an account, you agree to our
                  <TermsAndConditions>
                    Terms of Service and Privacy Policy
                  </TermsAndConditions>
                </p>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full md:w-auto">
            Create Account <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateAccountForm;
