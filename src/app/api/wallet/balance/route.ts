import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';
import { NextResponse } from 'next/server';

export const GET = async () => {
  try {
    // Get the wallet address from the private key
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      return NextResponse.json(
        { error: 'Private key not configured' },
        { status: 500 }
      );
    }

    // Import privateKeyToAccount here to avoid client-side exposure
    const { privateKeyToAccount } = await import('viem/accounts');
    
    const formattedPrivateKey = privateKey.startsWith('0x') 
      ? privateKey as `0x${string}`
      : `0x${privateKey}` as `0x${string}`;

    const account = privateKeyToAccount(formattedPrivateKey);
    
    // Create a public client to read the balance on Base network
    const publicClient = createPublicClient({
      chain: base,
      transport: http(),
    });

    // Get the balance
    const balance = await publicClient.getBalance({ 
      address: account.address 
    });

    const balanceInEth = Number(balance) / 1e18;

    return NextResponse.json({
      address: account.address,
      balance: balanceInEth,
      balanceWei: balance.toString(),
      network: base.name,
      chainId: base.id,
    });

  } catch (error) {
    console.error('Failed to fetch wallet balance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch balance' },
      { status: 500 }
    );
  }
};
