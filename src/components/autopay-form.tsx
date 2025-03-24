"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import useFetch from "@/hooks/useFetch";
import { Database } from "@/types/db";
import { format } from "date-fns";

// Define the form schema with Zod
const AutoPayFormSchema = z.object({
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  from_account: z.string({
    required_error: "Please select the source account",
  }),
  to_account: z.string({
    required_error: "Please select the destination account",
  }),
  start_date: z.string({
    required_error: "Start date is required",
  }),
  end_date: z.string({
    required_error: "End date is required",
  }),
  frequency: z.enum(["Daily", "Weekly", "Monthly", "Annually", "Once"], {
    required_error: "Please select a frequency",
  }),
  day_of_week: z.string().optional(),
  day_of_month: z.string().optional(),
  terms_accepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
}).refine((data) => new Date(data.start_date) <= new Date(data.end_date), {
  message: "End date must be after start date",
  path: ["end_date"],
}).refine((data) => data.from_account !== data.to_account, {
  message: "Source and destination accounts must be different",
  path: ["to_account"],
}).refine((data) => {
  if (data.frequency === "Weekly" && !data.day_of_week) {
    return false;
  }
  return true;
}, {
  message: "Day of week is required for weekly frequency",
  path: ["day_of_week"],
}).refine((data) => {
  if (data.frequency === "Monthly" && !data.day_of_month) {
    return false;
  }
  return true;
}, {
  message: "Day of month is required for monthly frequency",
  path: ["day_of_month"],
});

type Account = Database["public"]["Tables"]["accounts"]["Row"];

export default function AutoPayForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const router = useRouter();
  const { fetchData } = useFetch();
  
  // Initialize form with Zod schema
  const form = useForm<z.infer<typeof AutoPayFormSchema>>({
    resolver: zodResolver(AutoPayFormSchema),
    defaultValues: {
      amount: "",
      from_account: "",
      to_account: "",
      start_date: format(new Date(), "yyyy-MM-dd"),
      end_date: format(new Date(new Date().setFullYear(new Date().getFullYear() + 1)), "yyyy-MM-dd"),
      frequency: "Monthly",
      day_of_month: "1",
      terms_accepted: false,
    },
  });
  
  // Watch for frequency changes to show/hide conditional fields
  const frequency = form.watch("frequency");
  
  // Fetch user accounts on component mount
  useEffect(() => {
    fetchData<Account[]>("/api/account")
      .then((data) => {
        if (data) {
          setAccounts(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching accounts:", error);
      });
  }, []);
  
  // Handle form submission
  async function onSubmit(values: z.infer<typeof AutoPayFormSchema>) {
    setIsSubmitting(true);
    
    try {
      await fetchData("/api/payment-schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          amount: parseFloat(values.amount),
          day_of_month: values.day_of_month ? parseInt(values.day_of_month) : null,
        }),
      });
      
      // Redirect to dashboard on success
      router.push("/dashboard");
    } catch (error) {
      console.error("Error creating payment schedule:", error);
      // Here you could add error handling, such as displaying an error message
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Set Up Automatic Payments</h1>
        <p className="text-muted-foreground">
          Schedule recurring transfers between your accounts
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="from_account"
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
                          key={account.account_number}
                          value={account.account_number}
                        >
                          {account.name} ({account.account_number})
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
              name="to_account"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To Account</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select destination account" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem
                          key={account.account_number}
                          value={account.account_number}
                        >
                          {account.name} ({account.account_number})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                <FormLabel>Amount ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    min="0.01"
                    step="0.01"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Enter the amount to transfer on each scheduled date
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequency</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Daily">Daily</SelectItem>
                      <SelectItem value="Weekly">Weekly</SelectItem>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                      <SelectItem value="Annually">Annually</SelectItem>
                      <SelectItem value="Once">Once</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {frequency === "Weekly" && (
              <FormField
                control={form.control}
                name="day_of_week"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Day of Week</FormLabel>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {frequency === "Monthly" && (
              <FormField
                control={form.control}
                name="day_of_month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Day of Month</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select day of month" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                          <SelectItem key={day} value={day.toString()}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="end_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="terms_accepted"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Terms and Conditions</FormLabel>
                  <FormDescription>
                    I authorize these recurring transfers and understand they will continue until the end date or until I cancel them.
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Setting up..." : "Set Up Automatic Payments"}
          </Button>
        </form>
      </Form>
    </div>
  );
}