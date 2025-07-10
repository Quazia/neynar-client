import axios from 'axios';
import { createWalletClient, http, publicActions } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { base } from 'viem/chains';
import { withPaymentInterceptor } from 'x402-axios';

// Enhanced logging functions for x402 flow
function logX402Request(config: any, walletAddress: string) {
  console.log('\n🚀 === x402 API REQUEST START ===');
  console.log('📤 Outgoing API Request:');
  console.log(`  🌐 Method: ${config.method?.toUpperCase()}`);
  console.log(`  🔗 URL: ${config.baseURL}${config.url}`);
  console.log(`  📋 Params: ${JSON.stringify(config.params, null, 2)}`);
  console.log(`  🔑 Wallet: ${walletAddress}`);
  console.log(`  🌍 Network: ${base.name} (${base.id})`);
  console.log(`  ⏰ Timestamp: ${new Date().toISOString()}`);
  
  // Log headers that might be relevant to x402
  if (config.headers) {
    const relevantHeaders = Object.keys(config.headers).filter(key => 
      key.toLowerCase().includes('authorization') || 
      key.toLowerCase().includes('payment') ||
      key.toLowerCase().includes('x402')
    );
    
    if (relevantHeaders.length > 0) {
      console.log('  📋 x402 Headers:');
      relevantHeaders.forEach(key => {
        console.log(`    ${key}: ${config.headers[key]}`);
      });
    }
  }
  
  console.log('═══════════════════════════════\n');
}

function logX402Success(response: any) {
  console.log('\n✅ === x402 API RESPONSE SUCCESS ===');
  console.log('📥 Successful API Response:');
  console.log(`  📈 Status: ${response.status} ${response.statusText}`);
  console.log(`  🔗 URL: ${response.config?.url}`);
  console.log(`  📊 Data Size: ${JSON.stringify(response.data).length} characters`);
  console.log(`  ⏰ Response Time: ${new Date().toISOString()}`);
  
  // Log response headers that might indicate payment status
  if (response.headers) {
    const paymentHeaders = Object.keys(response.headers).filter(key => 
      key.toLowerCase().includes('payment') ||
      key.toLowerCase().includes('x402') ||
      key.toLowerCase().includes('balance')
    );
    
    if (paymentHeaders.length > 0) {
      console.log('  💳 Payment Headers:');
      paymentHeaders.forEach(key => {
        console.log(`    ${key}: ${response.headers[key]}`);
      });
    }
  }
  
  console.log('  🎯 API call completed successfully - no payment required');
  console.log('═══════════════════════════════\n');
}

function logX402PaymentRequired(error: any, walletAddress: string) {
  console.log('\n💳 === x402 PAYMENT REQUIRED DETECTED ===');
  console.log('🔔 402 Payment Required Response:');
  console.log(`  🌐 Endpoint: ${error.config?.url}`);
  console.log(`  📍 Wallet: ${walletAddress}`);
  console.log(`  🌍 Network: ${base.name} (Chain ID: ${base.id})`);
  console.log(`  ⏰ Payment Challenge Time: ${new Date().toISOString()}`);
  
  // Log all payment-related headers
  if (error.response?.headers) {
    console.log('  💰 Payment Challenge Headers:');
    Object.keys(error.response.headers).forEach(key => {
      const lowerKey = key.toLowerCase();
      if (lowerKey.includes('payment') || lowerKey.includes('x402') || lowerKey.includes('www-authenticate')) {
        console.log(`    ${key}: ${error.response.headers[key]}`);
      }
    });
  }
  
  // Log payment challenge data if available
  if (error.response?.data) {
    console.log('  📄 Payment Challenge Data:');
    console.log(`    ${JSON.stringify(error.response.data, null, 2)}`);
  }
  
  console.log('  🔄 x402 interceptor will now handle payment flow...');
  console.log('  📝 Step 1: Detecting 402 Payment Required - COMPLETE');
  console.log('  📝 Step 2: Parsing payment challenge - IN PROGRESS');
  console.log('  📝 Step 3: Creating signature - PENDING');
  console.log('  📝 Step 4: Submitting payment proof - PENDING');
  console.log('  📝 Step 5: Retrying original request - PENDING');
  console.log('═══════════════════════════════\n');
}

function logX402Error(error: any, walletAddress: string) {
  const status = error.response?.status;
  console.log('\n❌ === x402 API ERROR ===');
  console.log('💥 API Request Failed:');
  console.log(`  📍 Wallet: ${walletAddress}`);
  console.log(`  🌍 Network: ${base.name} (Chain ID: ${base.id})`);
  console.log(`  🔗 Endpoint: ${error.config?.url || 'unknown'}`);
  console.log(`  📈 Status: ${status || 'no response'}`);
  console.log(`  📝 Message: ${error.message}`);
  console.log(`  ⏰ Error Time: ${new Date().toISOString()}`);
  
  if (error.response?.data) {
    console.log(`  📄 Error Details: ${JSON.stringify(error.response.data, null, 2)}`);
  }
  console.log('═══════════════════════════════\n');
}

// x402 signature process logging
function logX402SignatureProcess(message: any, walletAddress: string) {
  console.log('\n✍️ === x402 SIGNATURE PROCESS ===');
  console.log('🔐 Creating Payment Signature:');
  console.log(`  📝 Message Structure: ${JSON.stringify(message, null, 2)}`);
  console.log(`  🔑 Signing Wallet: ${walletAddress}`);
  console.log(`  🌍 Network: ${base.name} (Chain ID: ${base.id})`);
  console.log(`  📝 Step 2: Parsing payment challenge - COMPLETE`);
  console.log(`  📝 Step 3: Creating signature - IN PROGRESS`);
  console.log(`  ⏰ Signing Time: ${new Date().toISOString()}`);
  console.log('═══════════════════════════════\n');
}

function logX402SignatureComplete(signature: string, message: any) {
  console.log('\n📝 === x402 SIGNATURE COMPLETE ===');
  console.log('✅ Payment Signature Created:');
  console.log(`  🔏 Signature: ${signature}`);
  console.log(`  📏 Signature Length: ${signature.length} characters`);
  console.log(`  📄 Signed Message: ${JSON.stringify(message, null, 2)}`);
  console.log(`  📝 Step 3: Creating signature - COMPLETE`);
  console.log(`  📝 Step 4: Submitting payment proof - IN PROGRESS`);
  console.log(`  ⏰ Completion Time: ${new Date().toISOString()}`);
  console.log('═══════════════════════════════\n');
}

function logX402PaymentSubmission(paymentData: any) {
  console.log('\n📤 === x402 PAYMENT SUBMISSION ===');
  console.log('🚀 Submitting Payment Proof to Server:');
  console.log(`  💳 Payment Proof: ${JSON.stringify(paymentData, null, 2)}`);
  console.log(`  📝 Step 4: Submitting payment proof - IN PROGRESS`);
  console.log(`  ⏰ Submission Time: ${new Date().toISOString()}`);
  console.log('═══════════════════════════════\n');
}

function logX402PaymentVerification(response: any) {
  console.log('\n🔍 === x402 PAYMENT VERIFICATION ===');
  console.log('🔐 Server Verifying Payment on Blockchain:');
  console.log(`  📊 Verification Response: ${JSON.stringify(response, null, 2)}`);
  console.log(`  📝 Step 4: Submitting payment proof - COMPLETE`);
  console.log(`  📝 Step 5: Retrying original request - IN PROGRESS`);
  console.log(`  ⏰ Verification Time: ${new Date().toISOString()}`);
  console.log('═══════════════════════════════\n');
}

function logX402PaymentSuccess(originalResponse: any) {
  console.log('\n🎉 === x402 PAYMENT SUCCESS ===');
  console.log('✅ Payment Verified - API Access Granted:');
  console.log(`  🌐 Original Endpoint: ${originalResponse.config?.url}`);
  console.log(`  📈 Final Status: ${originalResponse.status}`);
  console.log(`  📊 Response Size: ${JSON.stringify(originalResponse.data).length} characters`);
  console.log(`  📝 Step 5: Retrying original request - COMPLETE`);
  console.log(`  🎯 FULL x402 FLOW COMPLETED SUCCESSFULLY!`);
  console.log(`  ⏰ Success Time: ${new Date().toISOString()}`);
  console.log('═══════════════════════════════\n');
}

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

    // Enhance wallet client with x402 signature logging
    const originalSignMessage = walletClient.signMessage;
    walletClient.signMessage = async (args: any) => {
      logX402SignatureProcess(args, account.address);
      
      try {
        const signature = await originalSignMessage(args);
        logX402SignatureComplete(signature, args);
        return signature;
      } catch (error) {
        console.log('\n❌ === x402 SIGNATURE ERROR ===');
        console.error('💥 Signature Creation Failed:');
        console.error(`  🔴 Error: ${error}`);
        console.error(`  📝 Message: ${JSON.stringify(args, null, 2)}`);
        console.error(`  ⏰ Error Time: ${new Date().toISOString()}`);
        console.log('═══════════════════════════════\n');
        throw error;
      }
    };

    // Create axios instance with x402 payment interceptor
    const client = withPaymentInterceptor(axios.create({
      baseURL: 'https://api.neynar.com/v2',
      timeout: 30000,
    }), walletClient as any);

    // Add request interceptor with enhanced x402 logging
    client.interceptors.request.use(
      (config) => {
        logX402Request(config, account.address);
        return config;
      },
      (error) => {
        console.log('\n❌ === x402 REQUEST SETUP ERROR ===');
        console.error('💥 Request Configuration Failed:');
        console.error(`  🔴 Error: ${error.message}`);
        console.error(`  ⏰ Time: ${new Date().toISOString()}`);
        console.log('═══════════════════════════════\n');
        return Promise.reject(error);
      }
    );

    // Add response interceptor with enhanced x402 flow logging
    client.interceptors.response.use(
      (response) => {
        logX402Success(response);
        return response;
      },
      (error) => {
        const status = error.response?.status;
        
        if (status === 402) {
          logX402PaymentRequired(error, account.address);
        } else {
          logX402Error(error, account.address);
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
