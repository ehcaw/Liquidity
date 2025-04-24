"use client";

import { useState } from "react";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/utils/format";
import { Calendar, Trash2 } from "lucide-react";
import { Database } from "@/types/db";
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
} from "@/components/ui/alert-dialog";
import useFetch from "@/hooks/useFetch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Account = Database["public"]["Tables"]["accounts"]["Row"];
type PaymentSchedule = Database["public"]["Tables"]["payment_schedule"]["Row"] & {
  accounts: Pick<Account, "account_number" | "name" | "account_type">;
};

interface AutopaymentListProps {
  schedules: PaymentSchedule[];
}

export default function AutopaymentList({ schedules }: AutopaymentListProps) {
  const [filteredSchedules, setFilteredSchedules] = useState<PaymentSchedule[]>(schedules);
  const { fetchData } = useFetch();
  const router = useRouter();

  const handleDeleteSchedule = async (id: number) => {
    try {
      await fetchData(`/api/autopay?id=${id}`, {
        method: "DELETE",
      });
      
      // Update the local state to remove the deleted schedule
      setFilteredSchedules((prev) => prev.filter(schedule => schedule.id !== id));
      toast.success("Auto-payment cancelled successfully");
    } catch (error) {
      toast.error("Failed to cancel auto-payment");
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Your Auto-Payments
        </CardTitle>
        <CardDescription>
          Your scheduled weekly payments
        </CardDescription>
      </CardHeader>
      <CardContent>
        {filteredSchedules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Calendar className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No auto-payments scheduled</h3>
            <p className="text-muted-foreground mt-2">
              You haven't set up any weekly auto-payments yet.
            </p>
            <Button 
              className="mt-4"
              onClick={() => router.push("/dashboard/autopay/create")}
            >
              Schedule a payment
            </Button>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source Account</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Day</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchedules.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell className="font-medium">
                      {schedule.accounts.name}
                    </TableCell>
                    <TableCell>{formatCurrency(schedule.amount)}</TableCell>
                    <TableCell>{schedule.day_of_week}</TableCell>
                    <TableCell>{formatDate(schedule.start_date)}</TableCell>
                    <TableCell>{formatDate(schedule.end_date)}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={schedule.status === 'Active' ? 'default' : 'secondary'}
                      >
                        {schedule.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Cancel Auto-Payment</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to cancel this auto-payment? 
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Keep It</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground"
                              onClick={() => handleDeleteSchedule(schedule.id)}
                            >
                              Cancel Payment
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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