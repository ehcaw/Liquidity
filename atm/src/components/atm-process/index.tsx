import { Shield } from "lucide-react";
import { useState } from "react";
import AccountVerification from "../account-verification";
import TransactionForm, { TransactionType } from "../transaction-form";
import Completion from "../completion";
import "./style.css";

enum AtmStep {
  ACCOUNT_VERIFICATION = 0,
  TRANSACTION = 1,
  COMPLETION = 2,
}

const bank_url = import.meta.env.VITE_BANK_DOMAIN;

const Atm = () => {
  const [currentStep, setCurrentStep] = useState<AtmStep>(
    AtmStep.ACCOUNT_VERIFICATION,
  );
  const [accountInfo, setAccountInfo] = useState({
    accountNumber: "",
    pin: "",
  });
  const [transaction, setTransaction] = useState({ type: "", amount: 0 });
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const verifyAccount = async (accountNumber: string, pin: string) => {
    const res = await fetch(
      `http://${bank_url}:3000/api/account/${accountNumber}/pin-code/${pin}/verify`,
      {
        method: "GET",
      },
    );
    if (res.ok) {
      const data = await res.json();
      if (data.data) {
        setAccountInfo({ accountNumber, pin });
        setCurrentStep(AtmStep.TRANSACTION);
        setErrorMessage("");
      } else {
        setErrorMessage("Invalid account number or PIN. Please try again.");
      }
    } else {
      setErrorMessage("Invalid account number or PIN. Please try again.");
    }
  };

  // Process the transaction
  const processTransaction = async (type: TransactionType, amount: number) => {
    // Simulate transaction processing
    const res = await fetch(`http://${bank_url}:3000/api/proxy`, {
      method: "POST",
      body: JSON.stringify({
        account_number: accountInfo.accountNumber,
        amount: amount,
        transaction_type: type,
      }),
    });

    if (res.ok) {
      // For demo purposes, we'll consider all transactions successful
      // In a real app, you would validate against account balance, etc.
      setIsSuccess(true);
      setCurrentStep(AtmStep.COMPLETION);
      setTransaction({ type: type, amount: amount });
    } else {
      setIsSuccess(false);
      setCurrentStep(AtmStep.COMPLETION);
      setTransaction({ type: "", amount: 0 });
    }
  };

  // Reset the entire process
  const resetProcess = () => {
    setCurrentStep(AtmStep.ACCOUNT_VERIFICATION);
    setAccountInfo({ accountNumber: "", pin: "" });
    setTransaction({ type: "", amount: 0 });
    setIsSuccess(false);
    setErrorMessage("");
  };

  // Render the appropriate step
  const renderStep = () => {
    switch (currentStep) {
      case AtmStep.ACCOUNT_VERIFICATION:
        return (
          <AccountVerification
            onSubmit={verifyAccount}
            errorMessage={errorMessage}
          />
        );
      case AtmStep.TRANSACTION:
        return (
          <TransactionForm
            onSubmit={processTransaction}
            accountNumber={accountInfo.accountNumber as TransactionType}
          />
        );
      case AtmStep.COMPLETION:
        return (
          <Completion
            isSuccess={isSuccess}
            transaction={transaction}
            accountNumber={accountInfo.accountNumber}
          />
        );
    }
  };
  return (
    <div className="atm-page">
      <div className="atm-container">
        <div className="atm-header">
          <Shield color="white" />
          <h1 className="atm-title">Liquidity ATM</h1>
          <p className="atm-description">
            {currentStep === AtmStep.ACCOUNT_VERIFICATION &&
              "Please enter your account details"}
            {currentStep === AtmStep.TRANSACTION &&
              "Select transaction type and amount"}
            {currentStep === AtmStep.COMPLETION &&
              (isSuccess ? "Transaction Complete" : "Transaction Failed")}
          </p>
        </div>
        <div className="atm-body">{renderStep()}</div>
        <div className="atm-footer">
          {currentStep !== AtmStep.COMPLETION && (
            <button className="btn cancel-btn" onClick={resetProcess}>
              Cancel
            </button>
          )}
          {currentStep === AtmStep.COMPLETION && (
            <div className="w-full">
              <button className="btn" onClick={resetProcess}>
                New Transaction
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Atm;
