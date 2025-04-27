import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import "./LoginPage.css";
import { Shield } from "lucide-react";
import { login } from "../services/auth";
import { getAccounts } from "../services/actions";

interface LoginPageProps {
  onLoginSuccess: (authToken: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }
    const credentials = await login({ username, password });
    if (credentials) {
      onLoginSuccess(credentials.token);
      const accounts = await getAccounts(credentials.token);
      navigate("/dashboard", {
        state: {
          user: credentials,
          accounts: accounts,
        },
      });
    } else {
      setError("Invalid credentials.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <Shield color="white" />
          <h1 className="login-title">Liquidity ATM Proxy Login</h1>
        </div>
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoComplete="current-password"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <Button type="submit" className="login-button">
            Login
          </Button>
        </form>
        <p className="login-hint">
          Hint: Use your login and password from Liquidity
        </p>
      </div>
    </div>
  );
};
