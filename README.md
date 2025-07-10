# Neynar x402 Feed Client

This is a [Next.js](https://nextjs.org/) project that demonstrates integrating with Neynar's Farcaster API using x402 micropayments on the Base network. The app displays personalized "For You" feeds and wallet balance information.

## Features

- 🔥 **x402 Integration**: Uses x402-axios for micropayments to Neynar API
- 🌐 **Base Network**: All wallet operations on Base (Chain ID: 8453)
- 📱 **Farcaster Feed**: Displays personalized "For You" feed for any FID
- 💰 **Wallet Balance**: Shows ETH balance on Base network with visual status indicators
- � **User Discovery**: Advanced user lookup with suggested popular users and instant results
- 📺 **Channel Explorer**: Rich channel display with follower stats, descriptions, and visual enhancements
- 🎨 **Modern UI**: Beautiful gradient design with responsive layout and interactive elements
- �🔒 **Server-side Security**: Private keys never exposed to client
- ⚡ **Real-time Demo**: Interactive showcase of x402 payment flows

## Prerequisites

- Node.js 18+ or Bun
- A wallet with ETH on Base network for x402 payments
- Private key for the wallet (stored securely in environment variables)

## Getting Started

1. **Clone and install dependencies:**
```bash
npm install
# or
bun install
```

2. **Set up environment variables:**
```bash
cp .env .env.local
```
Edit `.env.local` and add your actual private key:
```
PRIVATE_KEY=0x_your_actual_private_key_here
NEXT_PUBLIC_NEYNAR_CLIENT_ID=your_client_id_here
```

3. **Run the development server:**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. **Open the application:**
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Architecture

### x402 Payment Flow
- Server-side x402 client handles micropayments automatically
- API calls to Neynar trigger 402 → sign → retry → success flow
- All payments happen on Base network using your wallet

### API Routes
- `/api/feed/for-you` - Fetches personalized Farcaster feed via x402
- `/api/wallet/balance` - Shows wallet balance on Base network with status indicators
- `/api/channels` - Channel-related operations with user channel discovery
- `/api/users/lookup` - User search and profile discovery via x402

### Components
- `X402ForYouFeed` - Displays the "For You" feed with x402 integration
- `WalletBalance` - Enhanced wallet display with balance warnings and visual status
- `UserLookup` - Advanced user search with suggested users and integrated channel display
- `UserChannels` - Rich channel explorer with stats, images, and interactive elements
- Server-side x402 client with comprehensive logging

## Default Behavior
- Hero section showcases x402 capabilities with feature highlights
- Interactive user lookup with suggested popular users (dwr, vitalik.eth, jessepollak, etc.)
- Enhanced channel explorer with rich visual elements and statistics
- If no user is logged in, shows "For You" feed for FID 14206
- Displays wallet balance with visual status indicators and low balance warnings
- Featured user channels showcase (Dan Romero, Dwr, Jesse Pollak, Farcaster Official)
- Comprehensive x402 payment flow logging for debugging
- Responsive design that works on desktop, tablet, and mobile

## Adding New x402 APIs

To add new Neynar API endpoints with x402 integration:

### 1. Add to API Service Layer
Create or extend service classes in `src/lib/api/`:

```typescript
// src/lib/api/your-service.ts
import x402Client from '../x402Client';
import { YourResponseType } from './types';

export class YourService {
  static async yourMethod(param: string): Promise<YourResponseType> {
    try {
      console.log('🔥 Making x402 request to your endpoint');
      
      const client = await x402Client();
      const response = await client.get(`/your/neynar/endpoint`, {
        params: { your_param: param }
      });

      console.log('✅ Response received:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch your data:', error);
      throw error;
    }
  }
}
```

### 2. Create API Route
Add server-side API route in `src/app/api/`:

```typescript
// src/app/api/your-endpoint/route.ts
import { YourService } from "@/lib/api/your-service";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const param = searchParams.get('param');
    
    if (!param) {
      return NextResponse.json({ error: 'Missing param' }, { status: 400 });
    }

    const data = await YourService.yourMethod(param);
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
```

### 3. Use in Components
Call from React components:

```typescript
// In your component
const [data, setData] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    const response = await fetch('/api/your-endpoint?param=value');
    const result = await response.json();
    setData(result);
  };
  fetchData();
}, []);
```

### x402 Flow Details
- The x402 client automatically handles payment flows
- On first API call: `GET → 402 Payment Required → Sign Transaction → Retry → Success`
- Subsequent calls within payment window work normally
- All payments happen on Base network using your configured wallet
- Comprehensive logging shows wallet address, network, endpoint, and payment status

## Security
⚠️ **Important**: Never commit your actual private key to git. The `.env` file contains a dummy key for safety.

