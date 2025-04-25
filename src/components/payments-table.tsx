"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { Database } from "@/types/db";
import useFetch from "@/hooks/useFetch";
import { formatCurrency, formatDate } from "@/utils/format";
import { Calendar, Clock, Play, Pause, Trash2 } from "lucide-react";
import Link from "next/link";

type PaymentSchedule = Database["public"]["Tables"]["payment_schedule"]["Row"];

export interface IPaymentsTableProps {
  payments: PaymentSchedule[];
}

export default function PaymentsTable({ payments }: IPaymentsTableProps) {
  const [schedules, setSchedules] = useState<PaymentSchedule[]>(payments);
  const { fetchData } = useFetch();

  // const toggleScheduleStatus = async (id: number, currentStatus: string) => {
  //   try {
  //     const newStatus = currentStatus === "Active" ? "Paused" : "Active";
  //     await fetchData(`/api/payment-schedule/${id}`, {
  //       method: "PATCH",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ status: newStatus }),
  //     });
  //
  //     // Refresh schedules after update
  //     loadSchedules();
  //   } catch (error) {
  //     console.error("Error updating schedule status:", error);
  //   }
  // };

  // const deleteSchedule = async (id: number) => {
  //   if (!confirm("Are you sure you want to delete this automatic payment?")) {
  //     return;
  //   }
  //
  //   try {
  //     await fetchData(`/api/payment-schedule/${id}`, {
  //       method: "DELETE",
  //     });
  //
  //     // Refresh schedules after deletion
  //     // loadSchedules();
  //   } catch (error) {
  //     console.error("Error deleting schedule:", error);
  //   }
  // };

  const getFrequencyDisplay = (schedule: PaymentSchedule) => {
    switch (schedule.frequency) {
      case "Daily":
        return "Every day";
      case "Weekly":
        return `Every ${schedule.day_of_week}`;
      case "Monthly":
        return `Monthly on day ${schedule.day_of_month}`;
      case "Annually":
        return `Annually on ${formatDate(schedule.day_of_year || "")}`;
      case "Once":
        return `Once on ${formatDate(schedule.start_date)}`;
      default:
        return schedule.frequency;
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Automatic Payments
          </h1>
          <p className="text-muted-foreground">
            Manage your scheduled recurring transfers
          </p>
        </div>
        <Link href="/payments/schedule">
          <Button>Create New Automatic Payment</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Automatic Payments</CardTitle>
          <CardDescription>
            View and manage your scheduled transfers
          </CardDescription>
        </CardHeader>
        <CardContent>
          {schedules.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>You don't have any automatic payments set up yet.</p>
              <p className="mt-2">
                <Link href="/payments/schedule">
                  <Button variant="outline">
                    Create your first automatic payment
                  </Button>
                </Link>
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Amount</TableHead>
                    <TableHead>Account ID</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Date Range</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schedules.map((schedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell className="font-medium">
                        {formatCurrency(schedule.amount)}
                      </TableCell>
                      <TableCell>{schedule.account_id}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          {getFrequencyDisplay(schedule)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>
                            {formatDate(schedule.start_date)} to{" "}
                            {formatDate(schedule.end_date)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            schedule.status === "Active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {schedule.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            // onClick={() =>
                            //   toggleScheduleStatus(schedule.id, schedule.status)
                            // }
                            title={
                              schedule.status === "Active" ? "Pause" : "Resume"
                            }
                          >
                            {schedule.status === "Active" ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            // onClick={() => deleteSchedule(schedule.id)}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
