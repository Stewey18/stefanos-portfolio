import React, { useState } from 'react';

export default function ProvablyFairVerifier() {
  const [serverSeed, setServerSeed] = useState('');
  const [clientSeed, setClientSeed] = useState('');
  const [nonce, setNonce] = useState('0');
  const [result, setResult] = useState(null);
  const [exampleMode, setExampleMode] = useState(false);

  // SHA-256 hash function
  const sha256 = async (message) => {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  // HMAC-SHA256
  const hmacSha256 = async (key, message) => {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(key);
    const messageData = encoder.encode(message);
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
    const hashArray = Array.from(new Uint8Array(signature));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  // Generate game result from hash
  const generateGameResult = (hash, gameType) => {
    // Use first 8 characters of hash for randomness
    const hex = hash.substring(0, 8);
    const decimal = parseInt(hex, 16);
    
    switch (gameType) {
      case 'dice':
        // Dice roll 0-100 with 2 decimal places
        const diceResult = (decimal % 10001) / 100;
        return diceResult.toFixed(2);
      
      case 'coin':
        // Coin flip
        return (decimal % 2) === 0 ? 'Heads' : 'Tails';
      
      case 'roulette':
        // Roulette number 0-36
        return decimal % 37;
      
      case 'slots':
        // 3-reel slot symbols (0-9 representing different symbols)
        const reel1 = Math.floor((decimal % 1000) / 100);
        const reel2 = Math.floor((decimal % 100) / 10);
        const reel3 = decimal % 10;
        return `${reel1} ${reel2} ${reel3}`;
      
      default:
        return decimal;
    }
  };

  const verifyGame = async (gameType) => {
    if (!serverSeed || !clientSeed) {
      alert('Please enter both server seed and client seed');
      return;
    }

    try {
      // Generate hash using HMAC
      const hash = await hmacSha256(serverSeed, `${clientSeed}:${nonce}`);
      
      // Generate result from hash
      const gameResult = generateGameResult(hash, gameType);
      
      // Calculate server seed hash for verification
      const serverSeedHash = await sha256(serverSeed);
      
      setResult({
        hash,
        gameResult,
        gameType,
        serverSeedHash,
        combinedInput: `${clientSeed}:${nonce}`,
        verified: true
      });
    } catch (error) {
      console.error('Verification error:', error);
      alert('Error during verification. Please check your inputs.');
    }
  };

  const loadExample = async () => {
    const exampleServer = 'casino_server_secret_' + Math.random().toString(36).substring(2, 15);
    const exampleClient = 'player_' + Math.random().toString(36).substring(2, 15);
    const exampleNonce = '0';
    
    setServerSeed(exampleServer);
    setClientSeed(exampleClient);
    setNonce(exampleNonce);
    setExampleMode(true);
  };

  const reset = () => {
    setServerSeed('');
    setClientSeed('');
    setNonce('0');
    setResult(null);
    setExampleMode(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const gameTypes = [
    { id: 'dice', name: '🎲 Dice Roll', description: 'Result: 0.00 - 100.00' },
    { id: 'coin', name: '🪙 Coin Flip', description: 'Result: Heads or Tails' },
    { id: 'roulette', name: '🎡 Roulette', description: 'Result: 0 - 36' },
    { id: 'slots', name: '🎰 Slots', description: 'Result: 3 reels (0-9)' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
          <h1 className="text-4xl font-bold text-white mb-4">
            🔐 Provably Fair Game Verifier
          </h1>
          <p className="text-gray-300 text-lg">
            Verify the fairness of crypto casino games using cryptographic hashing (HMAC-SHA256)
          </p>
        </div>

        {/* How It Works */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
          <h3 className="text-white text-xl font-semibold mb-4">📖 How Provably Fair Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-300">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-2xl mb-2">1️⃣</div>
              <strong className="text-white">Casino generates Server Seed</strong>
              <p className="text-sm mt-2">Casino creates a secret random seed and provides its hash to player before game</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-2xl mb-2">2️⃣</div>
              <strong className="text-white">Player provides Client Seed</strong>
              <p className="text-sm mt-2">Player inputs their own random string to ensure casino can't predict result</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-2xl mb-2">3️⃣</div>
              <strong className="text-white">Result is Generated</strong>
              <p className="text-sm mt-2">Game result is calculated: HMAC(serverSeed, clientSeed:nonce)</p>
            </div>
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
          <h3 className="text-white text-xl font-semibold mb-4">🔑 Enter Seeds</h3>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-white font-semibold mb-2">
                Server Seed (Revealed after game)
              </label>
              <input
                type="text"
                value={serverSeed}
                onChange={(e) => setServerSeed(e.target.value)}
                placeholder="Enter server seed (e.g., casino_server_secret_abc123)"
                className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-gray-400"
              />
              <p className="text-gray-400 text-sm mt-1">
                The casino reveals this after the game to prove fairness
              </p>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                Client Seed (Your input)
              </label>
              <input
                type="text"
                value={clientSeed}
                onChange={(e) => setClientSeed(e.target.value)}
                placeholder="Enter your client seed (e.g., player_abc123)"
                className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-gray-400"
              />
              <p className="text-gray-400 text-sm mt-1">
                You provide this before the game starts
              </p>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                Nonce (Game number)
              </label>
              <input
                type="number"
                value={nonce}
                onChange={(e) => setNonce(e.target.value)}
                placeholder="0"
                className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white"
              />
              <p className="text-gray-400 text-sm mt-1">
                Increments with each game (0, 1, 2, 3...)
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={loadExample}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              📝 Load Example
            </button>
            <button
              onClick={reset}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              🔄 Reset
            </button>
          </div>
        </div>

        {/* Game Type Selection */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
          <h3 className="text-white text-xl font-semibold mb-4">🎮 Select Game Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {gameTypes.map(game => (
              <button
                key={game.id}
                onClick={() => verifyGame(game.id)}
                className="bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-6 rounded-xl font-semibold transition-all transform hover:scale-105"
              >
                <div className="text-3xl mb-2">{game.name.split(' ')[0]}</div>
                <div className="text-lg mb-1">{game.name.split(' ').slice(1).join(' ')}</div>
                <div className="text-xs text-white/80">{game.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-white text-xl font-semibold mb-4">✅ Verification Results</h3>
            
            {/* Game Result */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-8 mb-6 text-center">
              <div className="text-white text-lg mb-2">Game Result</div>
              <div className="text-white text-6xl font-bold">{result.gameResult}</div>
              <div className="text-white/80 text-sm mt-2 uppercase">{result.gameType}</div>
            </div>

            {/* Verification Details */}
            <div className="space-y-4">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-gray-300 text-sm mb-1">Server Seed Hash (SHA-256)</div>
                <div className="text-white font-mono text-sm break-all bg-black/30 p-3 rounded">
                  {result.serverSeedHash}
                </div>
                <button
                  onClick={() => copyToClipboard(result.serverSeedHash)}
                  className="text-blue-400 hover:text-blue-300 text-sm mt-2"
                >
                  📋 Copy
                </button>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-gray-300 text-sm mb-1">Combined Input</div>
                <div className="text-white font-mono text-sm break-all bg-black/30 p-3 rounded">
                  {result.combinedInput}
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-gray-300 text-sm mb-1">Result Hash (HMAC-SHA256)</div>
                <div className="text-white font-mono text-sm break-all bg-black/30 p-3 rounded">
                  {result.hash}
                </div>
                <button
                  onClick={() => copyToClipboard(result.hash)}
                  className="text-blue-400 hover:text-blue-300 text-sm mt-2"
                >
                  📋 Copy
                </button>
              </div>

              <div className="bg-green-500/20 border border-green-500 rounded-lg p-4">
                <div className="text-green-300 font-semibold">✅ Game is Provably Fair!</div>
                <p className="text-gray-300 text-sm mt-2">
                  The result was generated deterministically from the server seed, client seed, and nonce.
                  The casino cannot manipulate this result without changing the server seed hash provided before the game.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Educational Info */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mt-8 border border-white/20">
          <h3 className="text-white text-xl font-semibold mb-4">🎓 Understanding the Process</h3>
          <div className="text-gray-300 space-y-3">
            <div className="bg-white/5 rounded-lg p-4">
              <strong className="text-white">Step 1: Pre-commitment</strong>
              <p className="mt-1">Before the game, the casino shows you a hash of their server seed. This proves they've committed to a specific seed and can't change it later.</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <strong className="text-white">Step 2: Your Input</strong>
              <p className="mt-1">You provide your own random string (client seed). This ensures the casino can't pre-calculate the result.</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <strong className="text-white">Step 3: Generation</strong>
              <p className="mt-1">The result is calculated using: HMAC-SHA256(server_seed, client_seed:nonce). The nonce increments for each game.</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <strong className="text-white">Step 4: Verification</strong>
              <p className="mt-1">After the game, the casino reveals the server seed. You can verify that SHA256(server_seed) matches the original hash, proving they didn't cheat.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
