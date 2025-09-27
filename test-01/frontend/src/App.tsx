import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useClientId } from "./services/hooks";

import Home from "./pages/Home";
import OnboardingPage from "./pages/OnboardingPage";
import DashboardPage from "./pages/DashboardPage";

import "./App.css";

function App() {
  const { clientId, login, logout, isAuthenticated } = useClientId();

  return (
    <>
      <Routes>
        {/* Redirects to onboarding if not authenticated, else to dashboard */}
        <Route
          path="/"
          element={
            <Navigate
              to={isAuthenticated ? "/dashboard" : "/onboarding"}
              replace
            />
          }
        />

        {/* 
          Redirects based on authentication status 
          - If not authenticated, show OnboardingPage
          - If authenticated, show DashboardPage
        */}
        <Route
          path="/onboarding"
          element={
            !isAuthenticated ? (
              <OnboardingPage onLogin={login} />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <DashboardPage clientId={clientId} onLogout={logout} />
            ) : (
              <Navigate to="/onboarding" replace />
            )
          }
        />

        {/* Ruta demo existente (opcional) */}
        <Route path="/home" element={<Home />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
