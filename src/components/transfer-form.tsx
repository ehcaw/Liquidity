"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ArrowRightLeft, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

const formSchema = z
  .object({
    fromAccount: z.string({
      required_error: "Please select an account to transfer from",
    }),
    toAccount: z.string({
      required_error: "Please select an account to transfer to",
    }),
    amount: z.string().refine(
      (val) => {
        const num = Number.parseFloat(val)
        return !isNaN(num) && num > 0
      },
      {
        message: "Amount must be greater than 0",
      },
    ),
    confirmTransfer: z.literal(true, {
      errorMap: () => ({
        message: "You must confirm the transfer details",
      }),
    }),
  })
  .refine((data) => data.fromAccount !== data.toAccount, {
    message: "From and To accounts must be different",
    path: ["toAccount"],
  })

type FormValues = z.infer<typeof formSchema>

export default function TransferForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromAccount: "",
      toAccount: "",
      amount: "",
    },
  })

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true)


  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5" />
            New Transfer
          </CardTitle>
          <CardDescription>Transfer money between your accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fromAccount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From Account</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select account" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="checking">Checking Account</SelectItem>
                          <SelectItem value="savings">Savings Account</SelectItem>
                          <SelectItem value="investment">Investment Account</SelectItem>
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select account" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="checking">Checking Account</SelectItem>
                          <SelectItem value="savings">Savings Account</SelectItem>
                          <SelectItem value="investment">Investment Account</SelectItem>
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
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input {...field} type="number" step="0.01" min="0.01" placeholder="0.00" className="pl-7" />
                      </div>
                    </FormControl>
                    <FormDescription>Enter the amount you want to transfer</FormDescription>
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
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Confirm Transfer</FormLabel>
                      <FormDescription>I authorize this transfer and confirm the details are correct.</FormDescription>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Schedule Transfer"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  )
}

