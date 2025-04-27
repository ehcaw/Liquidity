import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { LoginPage } from "./components/LoginPage";
import { DashboardPage } from "./components/DashboardPage";
import "./App.css";
import { JSX } from "react";

const ProtectedRoute: React.FC<{
  isAuthenticated: boolean;
  children: JSX.Element;
}> = ({ isAuthenticated, children }) => {
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const loggedIn = sessionStorage.getItem("isLoggedIn") === "true";
    setIsAuthenticated(loggedIn);
  }, []);

  const handleLogin = (authToken: string) => {
    setIsAuthenticated(true);
    localStorage.setItem("auth_token", authToken);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("isLoggedIn");
    console.log("User logged out");
  };

  return (
    <Router>
      <div className="app-container">
        {" "}
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <LoginPage
                  onLoginSuccess={(authToken) => handleLogin(authToken)}
                />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <DashboardPage onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          {/* Redirect root path */}
          <Route
            path="/"
            element={
              <Navigate
                to={isAuthenticated ? "/dashboard" : "/login"}
                replace
              />
            }
          />
          {/* Optional: Catch-all for unmatched routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
