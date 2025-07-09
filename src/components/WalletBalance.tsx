"use client";

import { useEffect, useState } from 'react';

interface WalletInfo {
  address: string;
  balance: number;
  balanceWei: string;
  network: string;
  chainId: number;
}

export function WalletBalance() {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/wallet/balance');
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setWalletInfo(data);
      } catch (err) {
        console.error('Failed to fetch wallet balance:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch balance');
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 mb-4">
        <div className="text-white text-sm">
          💰 Loading wallet balance...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900 rounded-lg p-4 mb-4">
        <div className="text-red-200 text-sm">
          ❌ Error loading balance: {error}
        </div>
      </div>
    );
  }

  if (!walletInfo) {
    return null;
  }

  const isLowBalance = walletInfo.balance < 0.001;

  return (
    <div className={`rounded-lg p-4 mb-4 ${isLowBalance ? 'bg-yellow-900' : 'bg-gray-800'}`}>
      <div className="text-white">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold">💰 Base Network Wallet</span>
          <span className={`text-sm px-2 py-1 rounded ${isLowBalance ? 'bg-yellow-700' : 'bg-green-700'}`}>
            {walletInfo.network}
          </span>
        </div>
        
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-300">Address:</span>
            <span className="font-mono text-xs">
              {walletInfo.address.substring(0, 6)}...{walletInfo.address.substring(walletInfo.address.length - 4)}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-300">Balance:</span>
            <span className={`font-semibold ${isLowBalance ? 'text-yellow-200' : 'text-green-200'}`}>
              {walletInfo.balance.toFixed(6)} ETH
            </span>
          </div>
          
          {isLowBalance && (
            <div className="mt-2 p-2 bg-yellow-800 rounded text-yellow-100 text-xs">
              ⚠️ Low balance! x402 payments may fail. Please add funds to continue.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
