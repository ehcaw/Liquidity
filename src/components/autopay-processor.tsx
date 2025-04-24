"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Check, Loader2 } from "lucide-react";
import useFetch from "@/hooks/useFetch";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProcessingResult {
  processed: number;
  successful: number;
  failed: number;
  results: Array<{
    scheduleId: number;
    status: string;
    amount?: number;
    error?: string;
  }>;
}

export default function AutopayProcessor() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const { fetchData } = useFetch();

  const processAutopayments = async () => {
    setIsProcessing(true);
    try {
      const data = await fetchData<ProcessingResult>("/api/autopay/process", {
        method: "POST",
      });
      
      setResult(data);
      
      if (data.successful > 0) {
        toast.success(`Successfully processed ${data.successful} auto-payments`);
      } else if (data.processed === 0) {
        toast.info("No auto-payments scheduled for today");
      } else {
        toast.warning(`Failed to process ${data.failed} auto-payments`);
      }
    } catch (error) {
      toast.error("Error processing auto-payments");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Calendar className="h-4 w-4" />
          Process Today's Auto-Payments
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Process Auto-Payments</DialogTitle>
          <DialogDescription>
            This will process all scheduled auto-payments for today. In a production environment, 
            this would happen automatically via a scheduled job.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {result ? (
            <Card>
              <CardHeader>
                <CardTitle>Processing Results</CardTitle>
                <CardDescription>
                  Processed {result.processed} auto-payments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Successful:</span>
                    <span className="font-medium text-green-600">{result.successful}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Failed:</span>
                    <span className="font-medium text-red-600">{result.failed}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => setResult(null)}
                >
                  Close
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="flex justify-center">
              <Button 
                onClick={processAutopayments} 
                disabled={isProcessing}
                className="gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Run Now
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}