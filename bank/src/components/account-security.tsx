"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Database } from "@/types/db";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "./ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import useFetch from "@/hooks/useFetch";
import { toast } from "sonner";

type Account = Database["public"]["Tables"]["accounts"]["Row"];

interface IAccountsDetailsProps {
  account: Account;
}
interface IPinCodeFormProps {
  account_number: string;
  setPin: React.Dispatch<React.SetStateAction<string | null>>;
}

const AccountSecurity: React.FC<IAccountsDetailsProps> = ({ account }) => {
  const [showPin, setShowPin] = useState(false);
  const [pin, setPin] = useState<string | null>(account.pin_code);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Security</CardTitle>
        <CardDescription>Protect your account with a pin code.</CardDescription>
      </CardHeader>
      <CardContent>
        {pin ? (
          <div className="flex items-center gap-2">
            {showPin ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPin(false)}
                >
                  <Eye />
                </Button>
                <p>{pin}</p>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPin(true)}
                >
                  <EyeOff />
                </Button>
                <p>****</p>
              </>
            )}
          </div>
        ) : (
          <div>
            <p>No pin code set</p>
            <PinCodeForm
              account_number={account.account_number}
              setPin={setPin}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const PinCodeForm: React.FC<IPinCodeFormProps> = ({
  account_number,
  setPin,
}) => {
  const [open, setOpen] = useState(false);
  const [formPin, setFormPin] = useState("");
  const { fetchData } = useFetch();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await fetchData(`/api/account/${account_number}/pin-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pin_code: formPin }),
      });
      setPin(formPin);
      setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error("Error setting pin code");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>Set Pin Code</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Pin Code</DialogTitle>
          <DialogDescription>
            You cannot change your pin code once it has been set.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-2">
          <InputOTP maxLength={4} onChange={(pin) => setFormPin(pin)}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
            </InputOTPGroup>
          </InputOTP>
          <Button type="submit" disabled={formPin.length < 4}>
            Set
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AccountSecurity;
