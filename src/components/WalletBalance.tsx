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
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-white font-medium">Loading wallet balance...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-red-900 to-red-800 rounded-xl p-6 border border-red-700 shadow-lg">
        <h3 className="text-red-100 font-medium mb-2 flex items-center gap-2">
          ❌ Wallet Error
        </h3>
        <p className="text-red-200 text-sm">{error}</p>
      </div>
    );
  }

  if (!walletInfo) {
    return null;
  }

  const isLowBalance = walletInfo.balance < 0.001;

  return (
    <div className={`rounded-xl p-6 border shadow-lg ${isLowBalance ? 'bg-gradient-to-r from-yellow-900 to-orange-900 border-yellow-700' : 'bg-gradient-to-r from-gray-800 to-gray-750 border-gray-700'}`}>
      <div className="text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <span className="text-xl">💰</span>
            Base Network Wallet
          </h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${isLowBalance ? 'bg-yellow-700 text-yellow-100' : 'bg-green-700 text-green-100'}`}>
            {walletInfo.network}
          </span>
        </div>
        
        <div className="space-y-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300 text-sm">Wallet Address</span>
            </div>
            <span className="font-mono text-sm bg-gray-600 px-3 py-1 rounded">
              {walletInfo.address.substring(0, 8)}...{walletInfo.address.substring(walletInfo.address.length - 6)}
            </span>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">ETH Balance</span>
              <span className={`text-xl font-bold ${isLowBalance ? 'text-yellow-200' : 'text-green-200'}`}>
                {walletInfo.balance.toFixed(6)} ETH
              </span>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Chain ID: {walletInfo.chainId}
            </div>
          </div>
          
          {isLowBalance && (
            <div className="bg-gradient-to-r from-yellow-800 to-orange-800 rounded-lg p-4 border border-yellow-600">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">⚠️</span>
                <span className="font-medium text-yellow-100">Low Balance Warning</span>
              </div>
              <p className="text-yellow-200 text-sm">
                x402 payments may fail with current balance. Please add funds to continue using the app.
              </p>
            </div>
          )}
          
          <div className="pt-3 border-t border-gray-600">
            <p className="text-xs text-gray-400 flex items-center justify-center gap-2">
              <span className="text-blue-400">⚡</span>
              Ready for x402 micropayments
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
