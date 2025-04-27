import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import "./DashboardPage.css";
import {
  withdrawFunds,
  checkBalance,
  transferFunds,
  depositFunds,
} from "../services/actions";
import { LucideShield } from "lucide-react";

interface DashboardPageProps {
  onLogout: () => void;
}

interface Account {
  id: number;
  name: string;
  balance: number;
  account_number: string;
  account_type: string;
  status: string;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onLogout }) => {
  const location = useLocation();
  const userCredentials = location.state?.user;
  const accountsData = location.state?.accounts?.data || [];

  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    accountsData[0]?.id?.toString() || null,
  );
  const [outputMessage, setOutputMessage] = useState<string>(
    accountsData.length > 0
      ? "Select an account and perform an action."
      : "No accounts available.",
  );

  // UI state for actions
  const [currentAction, setCurrentAction] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [transferToAccountId, setTransferToAccountId] = useState<string | null>(
    null,
  );

  const navigate = useNavigate();

  useEffect(() => {
    // If no accounts or not authenticated, redirect to login
    if (!userCredentials || accountsData.length === 0) {
      setOutputMessage("No accounts available or session expired.");
    }
  }, [userCredentials, accountsData]);

  const getSelectedAccount = () => {
    return accountsData.find(
      (acc: Account) => acc.id.toString() === selectedAccountId,
    );
  };

  const handleStartAction = (action: string) => {
    setCurrentAction(action);
    setAmount("");
    setTransferToAccountId(
      accountsData[0]?.id.toString() === selectedAccountId
        ? accountsData[1]?.id.toString()
        : accountsData[0]?.id.toString(),
    );

    const account = getSelectedAccount();
    if (!account) {
      setOutputMessage("Please select an account first.");
      return;
    }

    switch (action) {
      case "balance":
        setOutputMessage(
          `Balance for ${account.name}: $${account.balance.toFixed(2)}`,
        );
        setCurrentAction(null); // No form needed
        break;
      case "withdraw":
        setOutputMessage(`Enter amount to withdraw from ${account.name}:`);
        break;
      case "deposit":
        setOutputMessage(`Enter amount to deposit into ${account.name}:`);
        break;
      case "transfer":
        setOutputMessage(
          `Transfer funds from ${account.name} to another account:`,
        );
        break;
      default:
        setOutputMessage("Unknown action.");
    }
  };

  const handleCancel = () => {
    setCurrentAction(null);
    setAmount("");
    setTransferToAccountId(null);
    setOutputMessage("Action canceled.");
  };

  const handleSubmit = async () => {
    const account = getSelectedAccount();
    if (!account) {
      setOutputMessage("Account not found.");
      return;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      setOutputMessage("Please enter a valid amount.");
      return;
    }

    switch (currentAction) {
      case "withdraw":
        if (amountValue > account.balance) {
          setOutputMessage(
            `Insufficient funds. Your balance is $${account.balance.toFixed(2)}.`,
          );
        } else {
          // Show loading state
          setOutputMessage("Processing withdrawal...");

          try {
            await withdrawFunds(
              getSelectedAccount().account_number,
              amountValue,
              userCredentials.token,
            );

            // Success message
            setOutputMessage(
              `Successfully withdrew $${amountValue.toFixed(2)} from ${account.name}.`,
            );

            // Update the account balance in the local state
            const updatedAccounts = accountsData.map((acc: Account) => {
              if (acc.id.toString() === selectedAccountId) {
                return {
                  ...acc,
                  balance: acc.balance - amountValue,
                };
              }
              return acc;
            });
          } catch (error: any) {
            setOutputMessage(`Withdrawal failed: ${error.message}`);
          } finally {
            // Reset all form state
            setCurrentAction(null);
            setAmount("");
            setTransferToAccountId(null);
          }
        }
        break;

      case "deposit":
        setOutputMessage(
          `Successfully deposited $${amountValue.toFixed(2)} into ${account.name}.`,
        );
        await depositFunds(selectedAccountId || "", amountValue);
        break;

      case "transfer":
        if (amountValue > account.balance) {
          setOutputMessage(
            `Insufficient funds for transfer. Your balance is $${account.balance.toFixed(2)}.`,
          );
          return;
        }

        const toAccount = accountsData.find(
          (acc: Account) => acc.id.toString() === transferToAccountId,
        );
        if (!toAccount) {
          setOutputMessage("Destination account not found.");
          return;
        }

        setOutputMessage(
          `Successfully transferred $${amountValue.toFixed(2)} from ${account.name} to ${toAccount.name}.`,
        );
        await transferFunds(selectedAccountId || "", toAccount, amountValue);
        break;

      default:
        setOutputMessage("Unknown action.");
    }

    // Reset form after submission
    setCurrentAction(null);
    setAmount("");
    setTransferToAccountId(null);
  };

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  const renderActionForm = () => {
    switch (currentAction) {
      case "withdraw":
      case "deposit":
        return (
          <div className="action-form">
            <div className="form-group">
              <label htmlFor="amount">Amount ($):</label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0.01"
                step="0.01"
                placeholder="Enter amount"
              />
            </div>
            <div className="form-actions">
              <Button onClick={handleSubmit} disabled={!amount}>
                Submit
              </Button>
              <Button onClick={handleCancel} variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        );

      case "transfer":
        return (
          <div className="action-form">
            <div className="form-group">
              <label htmlFor="toAccount">To Account:</label>
              <select
                id="toAccount"
                value={transferToAccountId || ""}
                onChange={(e) => setTransferToAccountId(e.target.value)}
                className="account-select"
              >
                <option value="">Select destination account</option>
                {accountsData.map(
                  (acc: Account) =>
                    acc.id.toString() !== selectedAccountId && (
                      <option key={acc.id} value={acc.id.toString()}>
                        {acc.name} - {acc.account_number}
                      </option>
                    ),
                )}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="transferAmount">Amount ($):</label>
              <input
                type="number"
                id="transferAmount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0.01"
                step="0.01"
                placeholder="Enter amount"
              />
            </div>
            <div className="form-actions">
              <Button
                onClick={handleSubmit}
                disabled={
                  !amount ||
                  !transferToAccountId ||
                  selectedAccountId === transferToAccountId
                }
              >
                Transfer
              </Button>
              <Button onClick={handleCancel} variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">
              <LucideShield />
            </span>
            <span className="logo-text">Liquidity ATM Proxy</span>
          </div>
          <Button onClick={handleLogout} className="logout-button">
            Logout
          </Button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="account-section">
          <h2>Select Account</h2>
          <select
            value={selectedAccountId ?? ""}
            onChange={(e) => setSelectedAccountId(e.target.value)}
            disabled={accountsData.length === 0 || currentAction !== null}
            className="account-select"
          >
            {accountsData.length === 0 ? (
              <option>No accounts available</option>
            ) : (
              accountsData.map((acc: Account) => (
                <option key={acc.id} value={acc.id.toString()}>
                  {acc.name} - {acc.account_number} (Balance: $
                  {acc.balance.toFixed(2)})
                </option>
              ))
            )}
          </select>
        </div>

        <div className="actions-section">
          <h2>Perform Action</h2>
          {currentAction === null ? (
            <div className="action-buttons">
              <Button
                onClick={() => handleStartAction("balance")}
                disabled={!selectedAccountId}
              >
                Check Balance
              </Button>
              <Button
                onClick={() => handleStartAction("withdraw")}
                disabled={!selectedAccountId}
              >
                Withdraw Cash
              </Button>
              <Button
                onClick={() => handleStartAction("deposit")}
                disabled={!selectedAccountId}
              >
                Deposit
              </Button>
              <Button
                onClick={() => handleStartAction("transfer")}
                disabled={!selectedAccountId || accountsData.length < 2}
              >
                Transfer Funds
              </Button>
            </div>
          ) : (
            renderActionForm()
          )}
        </div>

        <div className="output-section">
          <h2>Output</h2>
          <div className="output-box">
            <p>{outputMessage}</p>
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>© 2023 Liquidity Banking. All rights reserved.</p>
      </footer>
    </div>
  );
};
