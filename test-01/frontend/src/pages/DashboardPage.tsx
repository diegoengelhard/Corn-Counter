import React, { useState, useEffect, useCallback } from "react";
import { getClientInfo, buyCorn } from "../services/api";
import StatCard from "../components/StatCard";
import BuyButton from "../components/BuyButton";
import CountdownTimer from "../components/CountdownTimer";

interface DashboardPageProps {
  clientId: string;
  onLogout?: () => void;
}

function DashboardPage({ clientId, onLogout }: DashboardPageProps) {
  const [userCorn, setUserCorn] = useState<number>(0);
  const [totalCorn, setTotalCorn] = useState<number>(0);
  const [cooldown, setCooldown] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const COOLDOWN_KEY = `nextAllowedAt:${clientId}`;

  useEffect(() => {

    const restorePersisted = () => {
      const raw = localStorage.getItem(COOLDOWN_KEY);
      if (!raw) return;
      const stored = Number(raw);
      if (!stored) {
        localStorage.removeItem(COOLDOWN_KEY);
        return;
      }
      const nowSec = Math.floor(Date.now() / 1000);
      const remaining = stored - nowSec;
      if (remaining > 0) setCooldown(remaining);
      else localStorage.removeItem(COOLDOWN_KEY);
    };

    const fetchData = async () => {
      try {
        const data = await getClientInfo(clientId);
        setUserCorn(data.count);
        setTotalCorn(data.totalSold);
        if (data.retryAfterSeconds > 0) {
          setCooldown(data.retryAfterSeconds);
          localStorage.setItem(COOLDOWN_KEY, String(data.nextAllowedAt));
        } else {
          localStorage.removeItem(COOLDOWN_KEY);
        }
      } catch {
        setError("Error loading client info.");
      }
    };

    restorePersisted();
    fetchData();
  }, [clientId]);

  // Effect to handle cooldown timer.
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      // Cleanup interval on unmount or when cooldown reaches 0
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  const handleBuyCorn = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await buyCorn(clientId);

      if (response.ok) {
        // Successful purchase
        setUserCorn(response.count);
        setTotalCorn(response.totalSold);
        // Calculate cooldown until next allowed purchase
        const nowSeconds = Math.floor(Date.now() / 1000);
        const cooldownSeconds = response.nextAllowedAt - nowSeconds;
        setCooldown(cooldownSeconds > 0 ? cooldownSeconds : 0);
      } else {
        // Rate limited
        setUserCorn(response.count);
        setTotalCorn(response.totalSold);
        setCooldown(response.retryAfterSeconds);
        setError(`Too fast! Try again later.`);
      }

      // Store nextAllowedAt in localStorage
      localStorage.setItem(COOLDOWN_KEY, String(response.nextAllowedAt));
    } catch (err) {
      setError("Error processing purchase.");
    } finally {
      setIsLoading(false);
    }
  }, [clientId]);

  return (
    <div className="container mx-auto p-4 md:p-8 flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-amber-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Hello, <span className="font-bold">{clientId}</span>!
            </p>
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              className="text-sm bg-red-100 hover:bg-red-200 text-red-700 font-semibold px-3 py-2 rounded-lg transition-colors"
            >
              Stop Harvesting
            </button>
          )}
        </div>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <StatCard label="Your Harvests" value={userCorn} />
          <StatCard label="Global Crops " value={totalCorn} />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
          {cooldown > 0 ? (
            <CountdownTimer seconds={cooldown} />
          ) : (
            <BuyButton
              onClick={handleBuyCorn}
              disabled={isLoading}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
