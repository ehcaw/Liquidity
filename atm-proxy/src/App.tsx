import React, { useState } from "react";
import "./App.css";

// Bank data with logos and names
const banks = [
  {
    id: "chase",
    name: "Chase",
    logo: "🏛️",
    color: "#117ACA",
  },
  {
    id: "wells-fargo",
    name: "Wells Fargo",
    logo: "🏦",
    color: "#D71E28",
  },
  {
    id: "bank-of-america",
    name: "Bank of America",
    logo: "💰",
    color: "#012169",
  },
  {
    id: "liquidity",
    name: "Liquidity",
    logo: "🛡️",
    color: "#3B82F6",
    primary: true,
  },
];

function App() {
  const [selectedBank, setSelectedBank] = useState<string | null>(null);

  const handleBankSelect = (bankId: string) => {
    setSelectedBank(bankId);
    console.log(`Selected ATM: ${bankId}`);
  };

  const resetSelection = () => {
    setSelectedBank(null);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <span className="logo-icon">🛡️</span>
              <span className="logo-text">Liquidity ATM Proxy</span>
            </div>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          {selectedBank ? (
            <div className="content-section">
              <button onClick={resetSelection} className="back-button">
                ← Back to ATM Selection
              </button>

              <div className="section-header">
                <h1 className="section-title">
                  {banks.find((bank) => bank.id === selectedBank)?.name} ATM
                </h1>
                <p className="section-description">
                  You're now connected to the{" "}
                  {banks.find((bank) => bank.id === selectedBank)?.name} ATM
                  network
                </p>
              </div>

              <div className="atm-interface">
                <div className="atm-screen">
                  <div
                    className="atm-header"
                    style={{
                      backgroundColor: banks.find(
                        (bank) => bank.id === selectedBank,
                      )?.color,
                    }}
                  >
                    <span className="atm-logo">
                      {banks.find((bank) => bank.id === selectedBank)?.logo}
                    </span>
                    <span className="atm-name">
                      {banks.find((bank) => bank.id === selectedBank)?.name}
                    </span>
                  </div>
                  <div className="atm-content">
                    <p>
                      Welcome to{" "}
                      {banks.find((bank) => bank.id === selectedBank)?.name}
                    </p>
                    <p className="atm-instruction">
                      Please insert your card to begin
                    </p>

                    <div className="atm-actions">
                      <button className="atm-button">Check Balance</button>
                      <button className="atm-button">Withdraw Cash</button>
                      <button className="atm-button">Deposit</button>
                      <button className="atm-button">Transfer Funds</button>
                    </div>
                  </div>
                </div>

                <div className="atm-keypad">
                  <div className="keypad-grid">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "⌫"].map(
                      (key, index) => (
                        <button key={index} className="keypad-button">
                          {key}
                        </button>
                      ),
                    )}
                  </div>
                  <div className="function-buttons">
                    <button className="function-button cancel">Cancel</button>
                    <button className="function-button clear">Clear</button>
                    <button className="function-button enter">Enter</button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="content-section">
              <div className="section-header">
                <h1 className="section-title">Select an ATM Network</h1>
                <p className="section-description">
                  Choose a banking partner to access their ATM services
                </p>
              </div>

              <div className="bank-grid">
                {banks.map((bank) => (
                  <div
                    key={bank.id}
                    className={`bank-card ${bank.primary ? "primary" : ""}`}
                    onClick={() => handleBankSelect(bank.id)}
                  >
                    <div
                      className="bank-logo"
                      style={{ backgroundColor: bank.color }}
                    >
                      <span>{bank.logo}</span>
                    </div>
                    <div className="bank-details">
                      <h2 className="bank-name">{bank.name}</h2>
                      <p className="bank-description">
                        Access {bank.name} ATM Network
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="info-section">
                <h2 className="info-title">About Liquidity ATM Proxy</h2>
                <p className="info-text">
                  Our ATM proxy service allows you to securely access multiple
                  banking networks through a single interface, with reduced fees
                  and enhanced security features.
                </p>
                <div className="feature-list">
                  <div className="feature-item">
                    <span className="feature-icon">✓</span>
                    <span>Fee-free withdrawals</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">✓</span>
                    <span>Enhanced security</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">✓</span>
                    <span>Multiple bank access</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>© 2023 Liquidity Banking. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
