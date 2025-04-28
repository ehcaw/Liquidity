import { CheckCircle2, XCircle } from "lucide-react";
import React from "react";
import "./style.css";

interface ICompletionScreenProps {
  isSuccess: boolean;
  transaction: {
    type: string;
    amount: number;
  };
  accountNumber: string;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const Completion: React.FC<ICompletionScreenProps> = ({
  isSuccess,
  transaction,
  accountNumber,
}) => {
  return (
    <div className="completion-container">
      {isSuccess ? (
        <>
          <CheckCircle2 className="h-16 w-16 text-green-500" />
          <h3 className="completion-title">Transaction Successful</h3>
          <div>
            <p>Account: {accountNumber}</p>
            <p>
              Transaction Type:
              <span className="capitalize"> {transaction.type}</span>
            </p>
            <p>Amount: {formatCurrency(transaction.amount)}</p>
            <p className="text-sm text-gray-500 mt-4">
              Your transaction has been processed successfully.
            </p>
          </div>
        </>
      ) : (
        <>
          <XCircle className="h-16 w-16 text-red-500" />
          <h3 className="completion-title">Transaction Failed</h3>
          <p>
            There was an error processing your transaction. Please try again.
          </p>
        </>
      )}
    </div>
  );
};

export default Completion;

