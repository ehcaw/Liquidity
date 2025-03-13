"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function TransfersPage() {
  const [fromAccount, setFromAccount] = useState("checking");
  const [toAccount, setToAccount] = useState("checking");
  const [amount, setAmount] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConfirmed) {
      alert("Please confirm the transfer before submitting.");
      return;
    }

    console.log("Transfer Details:", { fromAccount, toAccount, amount });
    alert("Transfer scheduled successfully!");
    setFromAccount("checking");
    setToAccount("checking");
    setAmount("");
    setIsConfirmed(false);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Transfers</h1>
        <p className="text-muted-foreground">
          Schedule payments or create transfers between accounts
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="fromAccount">From Account</label>
          <select
            id="fromAccount"
            className="p-2 border rounded"
            value={fromAccount}
            onChange={(e) => setFromAccount(e.target.value)}
          >
            <option value="checking">Checking Account</option>
            <option value="savings">Savings Account</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="toAccount">To Account</label>
          <select
            id="toAccount"
            className="p-2 border rounded"
            value={toAccount}
            onChange={(e) => setToAccount(e.target.value)}
          >
            <option value="checking">Checking Account</option>
            <option value="savings">Savings Account</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="amount">Amount $</label>
          <input
            type="number"
            id="amount"
            className="p-2 border rounded"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="confirmTransfer"
            checked={isConfirmed}
            onChange={(e) => setIsConfirmed(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="confirmTransfer" className="text-sm text-gray-700">
            I authorize this transfer and confirm the details are correct.
          </label>
        </div>

        <Button type="submit" disabled={!isConfirmed}>
          Schedule Transfer
        </Button>
      </form>
    </div>
  );
}