import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function CasinoOddsCalculator() {
  const [selectedGame, setSelectedGame] = useState('roulette');
  const [customBet, setCustomBet] = useState(100);
  const [customOdds, setCustomOdds] = useState({ payout: 35, probability: 2.7 });
  const [betAmount, setBetAmount] = useState(100);
  const [numberOfBets, setNumberOfBets] = useState(100);

  const games = {
    roulette: {
      name: 'Roulette (American)',
      bets: [
        { name: 'Single Number', payout: 35, probability: 2.63, description: 'Bet on one number' },
        { name: 'Split (2 numbers)', payout: 17, probability: 5.26, description: 'Bet on two adjacent numbers' },
        { name: 'Street (3 numbers)', payout: 11, probability: 7.89, description: 'Bet on a row of three numbers' },
        { name: 'Corner (4 numbers)', payout: 8, probability: 10.53, description: 'Bet on four numbers' },
        { name: 'Red/Black', payout: 1, probability: 47.37, description: 'Bet on color' },
        { name: 'Odd/Even', payout: 1, probability: 47.37, description: 'Bet on odd or even' },
        { name: 'Dozen', payout: 2, probability: 31.58, description: 'Bet on 12 numbers' }
      ],
      houseEdge: 5.26,
      rtp: 94.74
    },
    blackjack: {
      name: 'Blackjack (Basic Strategy)',
      bets: [
        { name: 'Standard Bet', payout: 1, probability: 49.1, description: 'Regular hand' },
        { name: 'Blackjack', payout: 1.5, probability: 4.8, description: 'Natural 21' },
        { name: 'Insurance', payout: 2, probability: 30.8, description: 'When dealer shows Ace' }
      ],
      houseEdge: 0.5,
      rtp: 99.5
    },
    slots: {
      name: 'Slot Machine (Typical)',
      bets: [
        { name: 'Low Volatility', payout: 1, probability: 25, description: 'Frequent small wins' },
        { name: 'Medium Volatility', payout: 5, probability: 10, description: 'Moderate wins' },
        { name: 'High Volatility', payout: 50, probability: 2, description: 'Rare big wins' },
        { name: 'Jackpot', payout: 1000, probability: 0.01, description: 'Maximum payout' }
      ],
      houseEdge: 5,
      rtp: 95
    },
    craps: {
      name: 'Craps',
      bets: [
        { name: 'Pass Line', payout: 1, probability: 49.29, description: 'Basic bet' },
        { name: 'Don\'t Pass', payout: 1, probability: 49.29, description: 'Opposite of pass line' },
        { name: 'Field', payout: 1, probability: 44.44, description: 'One roll bet' },
        { name: 'Any 7', payout: 4, probability: 16.67, description: 'Seven on next roll' },
        { name: 'Hard 4/10', payout: 7, probability: 11.11, description: 'Pairs only' }
      ],
      houseEdge: 1.41,
      rtp: 98.59
    },
    baccarat: {
      name: 'Baccarat',
      bets: [
        { name: 'Banker', payout: 0.95, probability: 50.68, description: 'Bet on banker (5% commission)' },
        { name: 'Player', payout: 1, probability: 49.32, description: 'Bet on player' },
        { name: 'Tie', payout: 8, probability: 9.51, description: 'Bet on tie' }
      ],
      houseEdge: 1.06,
      rtp: 98.94
    }
  };

  const calculateExpectedValue = (bet, amount) => {
    const winAmount = amount * bet.payout;
    const loseAmount = -amount;
    const winProb = bet.probability / 100;
    const loseProb = 1 - winProb;
    
    return (winAmount * winProb) + (loseAmount * loseProb);
  };

  const calculateHouseEdge = (bet, amount) => {
    const ev = calculateExpectedValue(bet, amount);
    return (Math.abs(ev) / amount) * 100;
  };

  const simulateBets = (bet, amount, numBets) => {
    let balance = 0;
    const results = [];
    
    for (let i = 0; i < numBets; i++) {
      const random = Math.random() * 100;
      if (random <= bet.probability) {
        balance += amount * bet.payout;
        results.push({ bet: i + 1, balance, outcome: 'win' });
      } else {
        balance -= amount;
        results.push({ bet: i + 1, balance, outcome: 'loss' });
      }
    }
    
    return results;
  };

  const currentGame = games[selectedGame];
  const [selectedBet, setSelectedBet] = useState(currentGame.bets[0]);
  const [simulationResults, setSimulationResults] = useState(null);

  const handleSimulation = () => {
    const results = simulateBets(selectedBet, betAmount, numberOfBets);
    setSimulationResults(results);
  };

  const ev = calculateExpectedValue(selectedBet, betAmount);
  const houseEdge = calculateHouseEdge(selectedBet, betAmount);
  const theoreticalRTP = 100 - houseEdge;

  const pieData = [
    { name: 'Win Probability', value: selectedBet.probability, color: '#10b981' },
    { name: 'Lose Probability', value: 100 - selectedBet.probability, color: '#ef4444' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
          <h1 className="text-4xl font-bold text-white mb-4">
            💰 Casino Odds & RTP Calculator
          </h1>
          <p className="text-gray-300 text-lg">
            Calculate house edge, expected value, and return to player (RTP) for various casino games
          </p>
        </div>

        {/* Game Selection */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
          <h3 className="text-white text-xl font-semibold mb-4">🎮 Select Game</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(games).map(([key, game]) => (
              <button
                key={key}
                onClick={() => {
                  setSelectedGame(key);
                  setSelectedBet(game.bets[0]);
                  setSimulationResults(null);
                }}
                className={`p-4 rounded-xl font-semibold transition-all ${
                  selectedGame === key
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                {game.name}
              </button>
            ))}
          </div>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-white text-xl font-semibold mb-4">📊 Game Statistics</h3>
            <div className="space-y-4">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-gray-300 text-sm">House Edge</div>
                <div className="text-red-400 text-3xl font-bold">{currentGame.houseEdge}%</div>
                <div className="text-gray-400 text-xs mt-1">Casino's mathematical advantage</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-gray-300 text-sm">RTP (Return to Player)</div>
                <div className="text-green-400 text-3xl font-bold">{currentGame.rtp}%</div>
                <div className="text-gray-400 text-xs mt-1">Expected return over long term</div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-white text-xl font-semibold mb-4">🎯 Select Bet Type</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {currentGame.bets.map((bet, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedBet(bet);
                    setSimulationResults(null);
                  }}
                  className={`w-full text-left p-4 rounded-lg transition-all ${
                    selectedBet === bet
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <div className="font-semibold">{bet.name}</div>
                  <div className="text-sm opacity-80 mt-1">{bet.description}</div>
                  <div className="text-xs opacity-60 mt-1">
                    Payout: {bet.payout}:1 | Win: {bet.probability}%
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bet Calculator */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
          <h3 className="text-white text-xl font-semibold mb-4">🎲 Calculate Your Bet</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-white font-semibold mb-2">Bet Amount ($)</label>
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(parseFloat(e.target.value) || 0)}
                className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white text-xl font-bold"
              />
            </div>
            <div>
              <label className="block text-white font-semibold mb-2">Number of Bets</label>
              <input
                type="number"
                value={numberOfBets}
                onChange={(e) => setNumberOfBets(parseInt(e.target.value) || 0)}
                className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white text-xl font-bold"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSimulation}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
              >
                🎰 Simulate
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-gray-300 text-sm">Win Amount</div>
              <div className="text-green-400 text-2xl font-bold">
                ${(betAmount * selectedBet.payout).toFixed(2)}
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-gray-300 text-sm">Win Probability</div>
              <div className="text-blue-400 text-2xl font-bold">
                {selectedBet.probability}%
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-gray-300 text-sm">Expected Value</div>
              <div className={`text-2xl font-bold ${ev >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${ev.toFixed(2)}
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-gray-300 text-sm">House Edge</div>
              <div className="text-red-400 text-2xl font-bold">
                {houseEdge.toFixed(2)}%
              </div>
            </div>
          </div>
        </div>

        {/* Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Probability Pie Chart */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-white text-xl font-semibold mb-4">📈 Win/Loss Probability</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value.toFixed(2)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Simulation Results */}
          {simulationResults && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-white text-xl font-semibold mb-4">📊 Simulation Results</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={simulationResults.slice(-20)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis dataKey="bet" stroke="#fff" />
                  <YAxis stroke="#fff" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="balance" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-gray-300 text-sm">Final Balance</div>
                  <div className={`text-xl font-bold ${simulationResults[simulationResults.length - 1].balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ${simulationResults[simulationResults.length - 1].balance.toFixed(2)}
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-gray-300 text-sm">Total Wagered</div>
                  <div className="text-white text-xl font-bold">
                    ${(betAmount * numberOfBets).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Educational Info */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-white text-xl font-semibold mb-4">📚 Understanding the Math</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
            <div className="bg-white/5 rounded-lg p-4">
              <strong className="text-white">Expected Value (EV)</strong>
              <p className="text-sm mt-2">
                EV = (Win Amount × Win Probability) - (Bet Amount × Lose Probability)
              </p>
              <p className="text-sm mt-2">
                Negative EV means you'll lose money over time. All casino games have negative EV.
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <strong className="text-white">House Edge</strong>
              <p className="text-sm mt-2">
                House Edge = |Expected Value| / Bet Amount × 100%
              </p>
              <p className="text-sm mt-2">
                The percentage advantage the casino has on every bet. Lower is better for players.
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <strong className="text-white">RTP (Return to Player)</strong>
              <p className="text-sm mt-2">
                RTP = 100% - House Edge
              </p>
              <p className="text-sm mt-2">
                The percentage of wagered money returned to players over time. Slots typically show RTP.
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <strong className="text-white">Probability</strong>
              <p className="text-sm mt-2">
                Win Probability = (Winning Outcomes / Total Outcomes) × 100%
              </p>
              <p className="text-sm mt-2">
                Your chance of winning on any single bet. Doesn't change based on previous results.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
