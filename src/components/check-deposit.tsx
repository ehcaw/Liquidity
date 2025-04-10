"use client";

import type React from "react";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, Upload } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Database } from "@/types/db";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent,
} from "./ui/select";
import { toast } from "sonner";
import { processCheckDepositAction } from "@/app/actions/banking";

type Account = Database["public"]["Tables"]["accounts"]["Row"];

export default function CheckDeposit({ accounts }: { accounts: Account[] }) {
  const router = useRouter();
  const [checkImage, setCheckImage] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmTerms, setConfirmTerms] = useState(false);
  const [account, setAccount] = useState("");

  const supabase = createClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target?.result) {
          setCheckImage(event.target.result as string);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!checkImage || !amount || !confirmTerms) {
      return;
    }
    setIsSubmitting(true);
    const userId = (await supabase.auth.getUser()).data.user?.id;
    const formData = new FormData();
    formData.append("file", checkImage);
    formData.append("userId", userId || "");
    const response = await fetch("/api/upload_file", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    console.log(data.uploadLink);
    const checkScanResponse = await fetch("/api/scan_check", {
      method: "POST",
      body: JSON.stringify({ url: data.uploadLink }),
    });
    if (!checkScanResponse.ok) {
      toast("Your check could not be uploaded.");
      setIsSubmitting(false);
      return;
    }
    const {
      check_or_not,
      name,
      amount: am,
      date,
      check_id,
    } = (await checkScanResponse.json()).data;
    if (!check_or_not) {
      toast("Please upload a valid check.");
      setIsSubmitting(false);
      return;
    }
    if (am != amount) {
      toast("Amount mismatch. Please check the amount.");
    }
    const validTransaction = await processCheckDepositAction(
      check_id,
      name,
      Number(amount),
      date,
      account,
    );
    if (!validTransaction.success) {
      toast(`Your check could not be deposited. ${validTransaction.error}`);
      setIsSubmitting(false);
      return;
    }
    if (validTransaction) {
      toast("Your check was successfully deposited.");
      setIsSubmitting(false);
      return;
    }
  };

  return (
    <div className="w-full flex justify-center">
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Deposit Check</CardTitle>
          <CardDescription>
            Upload a photo of your check to make a deposit to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 flex justify-center"
          >
            {!checkImage ? (
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-12">
                <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                <div className="flex flex-col items-center text-center mb-4">
                  <h3 className="font-medium">Upload check image</h3>
                  <p className="text-sm text-muted-foreground">
                    JPG, PNG or PDF up to 10MB
                  </p>
                </div>
                <Label
                  htmlFor="check-upload"
                  className="cursor-pointer inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
                >
                  Select File
                </Label>
                <Input
                  id="check-upload"
                  type="file"
                  accept="image/jpeg,image/png,application/pdf"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border rounded-lg overflow-hidden">
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="relative aspect-[4/2] cursor-pointer">
                        <Image
                          src={checkImage || "/placeholder.svg"}
                          alt="Check preview"
                          fill
                          className="object-contain"
                        />
                        <div className="absolute inset-0 bg-black/5 hover:bg-black/10 flex items-center justify-center">
                          <span className="bg-black/60 text-white text-xs px-2 py-1 rounded">
                            Click to enlarge
                          </span>
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Check Preview</DialogTitle>
                        <DialogDescription>
                          Verify that the check image is clear and legible
                        </DialogDescription>
                      </DialogHeader>
                      <div className="relative aspect-[4/2] w-full">
                        <Image
                          src={checkImage || "/placeholder.svg"}
                          alt="Check preview"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="flex justify-between items-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCheckImage(null)}
                  >
                    Replace Image
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="account">Account Number</Label>
                  <Select
                    value={account}
                    onValueChange={(value) => setAccount(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((acc) => (
                        <SelectItem key={acc.id} value={acc.account_number}>
                          {acc.name +
                            "  (..." +
                            acc.account_number.slice(
                              acc.account_number.length - 4,
                            ) +
                            ")"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Check Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    min="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-4 border-t pt-4">
                  <h3 className="font-medium">Confirmation</h3>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={confirmTerms}
                      onCheckedChange={(checked) =>
                        setConfirmTerms(checked as boolean)
                      }
                      required
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor="terms"
                        className="text-sm font-normal leading-snug"
                      >
                        I confirm that I am authorized to deposit this check and
                        the information provided is accurate. The check has been
                        properly endorsed.
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!checkImage || !amount || !confirmTerms || isSubmitting}
            onClick={handleSubmit}
            className="flex items-center gap-2"
          >
            {isSubmitting ? "Processing..." : "Deposit Check"}
            {!isSubmitting && <Check className="h-4 w-4" />}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
