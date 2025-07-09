import axios from 'axios';
import { createWalletClient, http, publicActions } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { base } from 'viem/chains';
import { withPaymentInterceptor } from 'x402-axios';

let x402Client: any = null;

function createX402Client() {
  // Only create on server-side where env vars are available
  if (typeof window !== 'undefined') {
    throw new Error('x402Client can only be created on server-side');
  }

  // Validate and format private key
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('PRIVATE_KEY environment variable is required');
  }

  // For build time, allow dummy key
  if (privateKey === '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef') {
    console.warn('🔧 Using dummy private key - x402 payments will not work');
    return axios.create({
      baseURL: 'https://api.neynar.com/v2',
      timeout: 30000,
    });
  }

  // Ensure private key is in correct format (0x prefixed)
  const formattedPrivateKey = privateKey.startsWith('0x') 
    ? privateKey as `0x${string}`
    : `0x${privateKey}` as `0x${string}`;

  try {
    // Create account from private key
    const account = privateKeyToAccount(formattedPrivateKey);
    
    // Log wallet information immediately
    console.log('💰 x402 Wallet Setup:');
    console.log(`  📍 Address: ${account.address}`);
    console.log(`  🌐 Network: ${base.name} (Chain ID: ${base.id})`);
    console.log(`  🔗 RPC: ${base.rpcUrls.default.http[0]}`);
    console.log(`  🔑 Private Key: ${formattedPrivateKey.substring(0, 6)}...${formattedPrivateKey.substring(formattedPrivateKey.length - 4)}`);
    
    // Create wallet client for x402 payments on Base network
    const walletClient = createWalletClient({
      chain: base,
      transport: http(),
      account,
    }).extend(publicActions);

    // Create axios instance with x402 payment interceptor
    const client = withPaymentInterceptor(axios.create({
      baseURL: 'https://api.neynar.com/v2',
      timeout: 30000,
      // Add request/response interceptors for better logging
    }), walletClient as any);

    // Add request interceptor to log API calls
    client.interceptors.request.use(
      (config) => {
        console.log(`🔥 x402 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        console.log(`  � Params:`, config.params);
        return config;
      },
      (error) => {
        console.error('❌ x402 Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor to log responses and errors
    client.interceptors.response.use(
      (response) => {
        console.log(`✅ x402 API Response: ${response.status} ${response.statusText}`);
        console.log(`  � Data length: ${JSON.stringify(response.data).length} chars`);
        return response;
      },
      (error) => {
        console.error('❌ x402 API Error:');
        console.error(`  📍 Wallet Address: ${account.address}`);
        console.error(`  🌐 Network: ${base.name} (Chain ID: ${base.id})`);
        console.error(`  🔗 Endpoint: ${error.config?.url || 'unknown'}`);
        console.error(`  📝 Status: ${error.response?.status || 'no response'}`);
        console.error(`  💥 Message: ${error.message}`);
        
        if (error.response?.status === 402) {
          console.log('💳 Payment required - x402 flow should trigger');
        }
        
        return Promise.reject(error);
      }
    );

    console.log('✅ x402 client initialized successfully with enhanced logging');
    return client;

  } catch (error) {
    console.error('❌ Failed to create x402 client:');
    console.error(`  🔑 Private Key: ${formattedPrivateKey.substring(0, 6)}...${formattedPrivateKey.substring(formattedPrivateKey.length - 4)}`);
    console.error(`  🌐 Network: ${base.name} (Chain ID: ${base.id})`);
    console.error(`  🔗 RPC: ${base.rpcUrls.default.http[0]}`);
    console.error(`  💥 Error: ${error}`);
    throw error;
  }
}

function getX402Client() {
  if (!x402Client) {
    x402Client = createX402Client();
  }
  return x402Client;
}

export default getX402Client;
