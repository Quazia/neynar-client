"use client";import { useNeynarContext } from "@neynar/react";import { X402FeedList } from "@/components/X402ForYouFeed";import { WalletBalance } from "@/components/WalletBalance";import { UserChannels } from "@/components/UserChannels";import { UserLookup } from "@/components/UserLookup";export default function Home() {  const { user } = useNeynarContext();  return (    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">      <div className="container mx-auto px-4 py-8">        {/* Hero Section */}        <div className="mb-12 text-center">          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">            <span>⚡</span>            <span>Powered by x402 Micropayments</span>          </div>          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">            Neynar x402 Feed Client          </h1>          <p className="text-xl text-gray-400 max-w-2xl mx-auto">            Explore Farcaster with seamless API integration and x402 micropayments on the Base Network          </p>        </div>        {/* Feature Showcase Header */}        <div className="mb-8">          <h2 className="text-3xl font-bold mb-4 text-center">🌟 Featured Capabilities</h2>          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-4 text-center">              <div className="text-2xl mb-2">🔍</div>              <h3 className="font-semibold mb-1">User Discovery</h3>              <p className="text-sm text-blue-100">Search any Farcaster user instantly</p>            </div>            <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-4 text-center">              <div className="text-2xl mb-2">📺</div>              <h3 className="font-semibold mb-1">Channel Explorer</h3>              <p className="text-sm text-purple-100">Browse user channels with rich stats</p>            </div>            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-4 text-center">              <div className="text-2xl mb-2">⚡</div>              <h3 className="font-semibold mb-1">x402 Payments</h3>              <p className="text-sm text-green-100">Micropayments on Base Network</p>            </div>          </div>        </div>
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left Column - User Tools & Wallet */}
          <div className="xl:col-span-1 space-y-6">
            <WalletBalance />
            <UserLookup />
            {user && (
              <UserChannels 
                fid={user.fid} 
                title="My Channels"
                showStats={true}
                maxChannels={6}
              />
            )}
          </div>

          {/* Middle Column - Main Feed */}
          <div className="xl:col-span-2">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">For You Feed</h2>
                <div className="flex items-center gap-2">
                  <span className="bg-green-600 text-green-100 px-3 py-1 rounded-full text-sm font-medium">
                    🔥 Live via x402
                  </span>
                  <span className="bg-blue-600 text-blue-100 px-3 py-1 rounded-full text-sm font-medium">
                    Base Network
                  </span>
                </div>
              </div>
              
              <X402FeedList
                fid={user?.fid || 14206}
                limit={25}
              />
              
              {!user && (
                <div className="mt-4 bg-gradient-to-r from-blue-900 to-blue-800 border border-blue-700 rounded-lg p-4">
                  <p className="text-blue-100 text-sm flex items-center gap-2">
                    ℹ️ Showing feed for FID 14206 • Sign in with Neynar for your personalized feed
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Demo Channels */}
          <div className="xl:col-span-1">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-xl">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                ✨ Featured Users
              </h3>
              <div className="space-y-4">
                <UserChannels 
                  fid={2}  // Dan Romero
                  title="Dan Romero"
                  showStats={true}
                  maxChannels={3}
                />
                <UserChannels 
                  fid={3}  // Dwr
                  title="Dwr"
                  showStats={true}
                  maxChannels={3}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Demo Section */}
        <div className="mt-12">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700 shadow-xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">🚀 Try it Live!</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Experience the power of x402 micropayments. Search for any Farcaster user or explore channel memberships - all powered by seamless blockchain transactions.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <span>🔍</span>
                  Instant User Discovery
                </h3>
                <p className="text-gray-400 text-sm">
                  Try searching for popular Farcaster users. Each lookup triggers an x402 micropayment to the Neynar API, demonstrating real-time blockchain transactions.
                </p>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm text-gray-300">Popular searches:</span>
                    {['dwr', 'vitalik.eth', 'jessepollak', 'sethfork'].map((user) => (
                      <span key={user} className="bg-blue-600 text-blue-100 px-2 py-1 rounded-full text-xs">
                        {user}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <span>📺</span>
                  Channel Exploration
                </h3>
                <p className="text-gray-400 text-sm">
                  Discover which channels users have joined. Each API call uses x402 micropayments to fetch live data from the Farcaster network.
                </p>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-sm text-gray-300">
                    📊 Real-time stats: follower counts, channel descriptions, and membership details
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Demo Section for Mobile/Tablet */}
        {!user && (
          <div className="mt-8 xl:hidden">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-xl">
              <h2 className="text-2xl font-bold mb-6 text-center">🎯 Explore More Channels</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <UserChannels 
                  fid={5650}  // Jesse Pollak (Base)
                  title="Jesse Pollak (Base)"
                  showStats={true}
                  maxChannels={4}
                />
                <UserChannels 
                  fid={1}  // Farcaster
                  title="Farcaster Official"
                  showStats={true}
                  maxChannels={4}
                />
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-700 text-center">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>💎 Built with Next.js</span>
              <span>•</span>
              <span>💳 x402 Micropayments</span>
              <span>•</span>
              <span>🌐 Base Network</span>
              <span>•</span>
              <span>📡 Neynar API</span>
            </div>
          </div>
          <p className="text-gray-500 text-xs">
            Experience the future of decentralized social with seamless micropayments
          </p>
        </footer>
      </div>
    </main>
  );
}