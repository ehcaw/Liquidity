import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import React, { useState, useEffect } from "react";
import "./style.css";

export type TransactionType = "Withdraw" | "Deposit";

type Account =  {
  account_number: string
  account_type: string
  balance: number
  created_at: string
  id: number
  name: string
  pin_code: string | null
  status: string
  user_id: number
}

interface ITransactionFormProps {
  onSubmit: (type: TransactionType, amount: number) => void;
  accountNumber: string;
}



const TransactionForm: React.FC<ITransactionFormProps> = ({
  onSubmit,
  accountNumber,
}) => {
  const [transactionType, setTransactionType] =
    useState<TransactionType | null>(null);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [account, setAccount] = useState<Account | null>(null);
  const bank_url = import.meta.env.VITE_BANK_DOMAIN;


  useEffect(() => {
    const getData = async () => {
         const res = await fetch(`http://${bank_url}:3000/api/proxy/account/${accountNumber}`);
        const data = await res.json();
        console.log(data);
        setAccount(data.data);
   }

  getData();
}, [])

  const validateForm = () => {
    if (!transactionType) {
      setError("Please select a transaction type");
      return false;
    }

    if (!amount.trim()) {
      setError("Please enter an amount");
      return false;
    }

    const numAmount = Number.parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid amount greater than zero");
      return false;
    }

    if (transactionType == "Withdraw") {
      if (!account) {
        setError("Account information not loaded");
        return false;
      }
      
      if (numAmount > account.balance) {
        setError("Insufficient funds");
        return false;
      }
    }

    setError("");
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (validateForm() && transactionType) {
      onSubmit(transactionType, Number.parseFloat(amount));
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="transaction-form">
      <div className="header">
        <p>Account#: {accountNumber}</p>
        <p>Account Name: {account?.name}</p>
        <p>Account Balance: {account?.balance}</p>
      </div>

      <div className="form-group radio-group">
        <div
          className={`radio-group-item ${transactionType === "Withdraw" && "radio-group-item-selected"}`}
        >
          <input
            type="radio"
            id="withdraw"
            value="withdraw"
            className="sr-only"
            onChange={() => setTransactionType("Withdraw")}
            checked={transactionType === "Withdraw"}
          />
          <label htmlFor="withdraw">
            <ArrowUpCircle className="h-8 w-8 text-red-500 mb-2" />
            <p>Withdraw</p>
          </label>
        </div>
        <div
          className={`radio-group-item ${transactionType === "Deposit" && "radio-group-item-selected"}`}
        >
          <input
            type="radio"
            id="deposit"
            value="deposit"
            className="sr-only"
            onChange={() => setTransactionType("Deposit")}
            checked={transactionType === "Deposit"}
          />
          <label htmlFor="deposit">
            <ArrowDownCircle className="h-8 w-8 text-green-500 mb-2" />
            <p>Deposit</p>
          </label>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="pl-8"
          min="0.01"
          step="0.01"
        />
      </div>

      {error && <p className="error-message">{error}</p>}

      <button type="submit" className="transaction-button">
        {isLoading ? "Processing..." : "Process Transaction"}
      </button>
    </form>
  );
};

export default TransactionForm;

