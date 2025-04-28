import React, { useState } from "react";
import "./style.css";

interface IAccountVerificationProps {
  onSubmit: (accountNumber: string, pin: string) => void;
  errorMessage: string;
}

const AccountVerification: React.FC<IAccountVerificationProps> = ({
  onSubmit,
  errorMessage,
}) => {
  const [accountNumber, setAccountNumber] = useState("");
  const [pin, setPin] = useState("");
  const [formErrors, setFormErrors] = useState({ accountNumber: "", pin: "" });
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    let isValid = true;
    const errors = { accountNumber: "", pin: "" };

    if (!accountNumber.trim()) {
      errors.accountNumber = "Account number is required";
      isValid = false;
    } else if (!/^\d{12}$/.test(accountNumber)) {
      errors.accountNumber = "Account number must be 12 digits";
      isValid = false;
    }

    if (!pin.trim()) {
      errors.pin = "PIN is required";
      isValid = false;
    } else if (!/^\d{4}$/.test(pin)) {
      errors.pin = "PIN must be 4 digits";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (validateForm()) {
      onSubmit(accountNumber, pin);
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="verification-form">
      <div className="form-group">
        <label htmlFor="accountNumber">Account Number</label>
        <input
          id="accountNumber"
          type="text"
          placeholder="Enter your account number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
        />
        {formErrors.accountNumber && (
          <p className="error-message">{formErrors.accountNumber}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="pin">PIN</label>
        <input
          id="pin"
          type="text"
          placeholder="Enter your 4-digit PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          maxLength={4}
        />
        {formErrors.pin && <p className="error-message">{formErrors.pin}</p>}
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <button type="submit" className="verification-button">
        {isLoading ? "Verifying..." : "Verify Account"}
      </button>
    </form>
  );
};

export default AccountVerification;

