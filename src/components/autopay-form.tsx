"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Calendar } from "lucide-react";

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
import { Database } from "@/types/db";
import useFetch from "@/hooks/useFetch";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Account = Database["public"]["Tables"]["accounts"]["Row"];

// Schema for the form fields
const AutopayFormSchema = z.object({
  sourceAccount: z.string({
    required_error: "Please select a source account",
  }),
  destinationAccount: z.string({
    required_error: "Please enter a destination account",
  }),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  dayOfWeek: z.enum([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ], {
    required_error: "Please select a day of the week",
  }),
  startDate: z.string(),
  endDate: z.string(),
  description: z.string().min(1, "Description is required"),
  confirmSetup: z.literal(true, {
    errorMap: () => ({ message: "You must confirm the auto-payment details" }),
  }),
});

type AutopayFormValues = z.infer<typeof AutopayFormSchema>;

export interface AutopayFormProps {
  accounts: Account[];
}

export default function AutopayForm({ accounts }: AutopayFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { fetchData } = useFetch();
  const router = useRouter();
  const [error, setError] = useState<string>(
    accounts.length === 0
      ? "You don't have any accounts to set up auto-payments from."
      : ""
  );

  // Get today's date and format it as YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];

  // Default end date is one year from today
  const defaultEndDate = new Date();
  defaultEndDate.setFullYear(defaultEndDate.getFullYear() + 1);
  const oneYearFromNow = defaultEndDate.toISOString().split("T")[0];

  const form = useForm<AutopayFormValues>({
    resolver: zodResolver(AutopayFormSchema),
    defaultValues: {
      sourceAccount: "",
      destinationAccount: "",
      amount: 0,
      dayOfWeek: "Monday",
      startDate: today,
      endDate: oneYearFromNow,
      description: "",
    },
  });

  const handleSubmit = async (values: AutopayFormValues) => {
    setIsSubmitting(true);

    try {
      await fetchData("/api/autopay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source_account_number: values.sourceAccount,
          destination_account_number: values.destinationAccount,
          amount: values.amount,
          day_of_week: values.dayOfWeek,
          start_date: values.startDate,
          end_date: values.endDate,
          description: values.description,
        }),
      });

      toast.success("Auto-payment scheduled successfully");
      router.push("/dashboard/autopay");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      toast.error(`Failed to set up auto-payment: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Schedule Weekly Auto-Payment
        </CardTitle>
        <CardDescription>
          Set up a recurring weekly payment from your account
        </CardDescription>
        {error && <p className="text-red-500">{error}</p>}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="sourceAccount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From Account</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select source account" />
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
                name="destinationAccount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To Account</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter destination account number"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The account number to send funds to
                    </FormDescription>
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
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="0.00"
                        className="pl-7"
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                        value={field.value}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Enter the amount for each payment
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dayOfWeek"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Day</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select day of week" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Monday">Monday</SelectItem>
                      <SelectItem value="Tuesday">Tuesday</SelectItem>
                      <SelectItem value="Wednesday">Wednesday</SelectItem>
                      <SelectItem value="Thursday">Thursday</SelectItem>
                      <SelectItem value="Friday">Friday</SelectItem>
                      <SelectItem value="Saturday">Saturday</SelectItem>
                      <SelectItem value="Sunday">Sunday</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The day of the week when the payment will be processed
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} min={today} />
                    </FormControl>
                    <FormDescription>
                      When to start the auto-payments
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        min={form.watch("startDate")}
                      />
                    </FormControl>
                    <FormDescription>
                      When to stop the auto-payments
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Weekly payment for..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A description for this recurring payment
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmSetup"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Confirm Auto-Payment Setup</FormLabel>
                    <FormDescription>
                      I authorize this recurring payment and understand that
                      funds will be automatically transferred according to this
                      schedule.
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Setting up..." : "Schedule Auto-Payment"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}