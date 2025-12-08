import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function BettingStrategySimulator() {
  const [strategy, setStrategy] = useState('martingale');
  const [startingBalance, setStartingBalance] = useState(1000);
  const [baseBet, setBaseBet] = useState(10);
  const [winProbability, setWinProbability] = useState(47.37); // Roulette red/black
  const [numberOfRounds, setNumberOfRounds] = useState(100);
  const [simulationResults, setSimulationResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const strategies = {
    martingale: {
      name: 'Martingale System',
      description: 'Double your bet after every loss, return to base bet after win',
      emoji: '📈',
      calculate: (baseBet, lossStreak) => baseBet * Math.pow(2, lossStreak)
    },
    fibonacci: {
      name: 'Fibonacci System',
      description: 'Increase bet following Fibonacci sequence after loss',
      emoji: '🔢',
      calculate: (baseBet, sequence) => {
        const fib = [1, 1];
        for (let i = 2; i <= sequence; i++) {
          fib[i] = fib[i - 1] + fib[i - 2];
        }
        return baseBet * fib[sequence];
      }
    },
    dalembert: {
      name: "D'Alembert System",
      description: 'Increase bet by 1 unit after loss, decrease by 1 unit after win',
      emoji: '➕',
      calculate: (baseBet, units) => baseBet + (units * baseBet * 0.1)
    },
    flat: {
      name: 'Flat Betting',
      description: 'Always bet the same amount (control group)',
      emoji: '➖',
      calculate: (baseBet) => baseBet
    },
    paroli: {
      name: 'Paroli System',
      description: 'Double bet after win, reset to base after loss (reverse Martingale)',
      emoji: '🔄',
      calculate: (baseBet, winStreak) => baseBet * Math.pow(2, Math.min(winStreak, 3))
    },
    labouchere: {
      name: 'Labouchere System',
      description: 'Bet sum of first and last numbers in sequence',
      emoji: '📝',
      calculate: (baseBet, sequence) => {
        if (sequence.length === 0) return baseBet;
        if (sequence.length === 1) return baseBet * sequence[0];
        return baseBet * (sequence[0] + sequence[sequence.length - 1]);
      }
    }
  };

  const simulateStrategy = () => {
    setIsRunning(true);
    let balance = startingBalance;
    let currentBet = baseBet;
    let lossStreak = 0;
    let winStreak = 0;
    let units = 0;
    let sequence = [1, 2, 3, 4]; // For Labouchere
    const results = [];
    const betHistory = [];
    
    let maxBalance = startingBalance;
    let minBalance = startingBalance;
    let totalWagered = 0;
    let wins = 0;
    let losses = 0;
    let maxBet = baseBet;

    for (let round = 1; round <= numberOfRounds; round++) {
      // Calculate bet based on strategy
      switch (strategy) {
        case 'martingale':
          currentBet = strategies.martingale.calculate(baseBet, lossStreak);
          break;
        case 'fibonacci':
          currentBet = strategies.fibonacci.calculate(baseBet, lossStreak);
          break;
        case 'dalembert':
          currentBet = strategies.dalembert.calculate(baseBet, units);
          break;
        case 'flat':
          currentBet = baseBet;
          break;
        case 'paroli':
          currentBet = strategies.paroli.calculate(baseBet, winStreak);
          break;
        case 'labouchere':
          currentBet = strategies.labouchere.calculate(baseBet, sequence);
          break;
      }

      // Ensure bet doesn't exceed balance
      if (currentBet > balance) {
        currentBet = balance;
      }

      maxBet = Math.max(maxBet, currentBet);

      // Simulate outcome
      const random = Math.random() * 100;
      const won = random <= winProbability;
      
      totalWagered += currentBet;

      if (won) {
        balance += currentBet;
        wins++;
        lossStreak = 0;
        winStreak++;
        units = Math.max(0, units - 1);
        
        // Labouchere: remove first and last
        if (strategy === 'labouchere' && sequence.length > 0) {
          if (sequence.length === 1) {
            sequence = [1, 2, 3, 4];
          } else {
            sequence = sequence.slice(1, -1);
            if (sequence.length === 0) sequence = [1, 2, 3, 4];
          }
        }
      } else {
        balance -= currentBet;
        losses++;
        lossStreak++;
        winStreak = 0;
        units++;
        
        // Labouchere: add lost amount to end
        if (strategy === 'labouchere') {
          const lostUnits = currentBet / baseBet;
          sequence.push(lostUnits);
        }
      }

      maxBalance = Math.max(maxBalance, balance);
      minBalance = Math.min(minBalance, balance);

      results.push({
        round,
        balance: parseFloat(balance.toFixed(2)),
        bet: parseFloat(currentBet.toFixed(2)),
        outcome: won ? 'Win' : 'Loss'
      });

      betHistory.push(currentBet);

      // Stop if bankrupt
      if (balance <= 0) {
        break;
      }

      // Paroli: reset after 3 wins
      if (strategy === 'paroli' && winStreak >= 3) {
        winStreak = 0;
      }
    }

    const finalBalance = balance;
    const profit = finalBalance - startingBalance;
    const profitPercentage = ((profit / startingBalance) * 100).toFixed(2);
    const avgBet = (totalWagered / results.length).toFixed(2);
    const roi = ((profit / totalWagered) * 100).toFixed(2);

    setSimulationResults({
      results,
      stats: {
        finalBalance: finalBalance.toFixed(2),
        profit: profit.toFixed(2),
        profitPercentage,
        maxBalance: maxBalance.toFixed(2),
        minBalance: minBalance.toFixed(2),
        totalWagered: totalWagered.toFixed(2),
        wins,
        losses,
        winRate: ((wins / (wins + losses)) * 100).toFixed(2),
        maxBet: maxBet.toFixed(2),
        avgBet,
        roi,
        roundsPlayed: results.length,
        busted: balance <= 0
      }
    });

    setIsRunning(false);
  };

  const reset = () => {
    setSimulationResults(null);
  };

  const runMultipleSimulations = () => {
    setIsRunning(true);
    const numSims = 100;
    const outcomes = {
      profit: 0,
      loss: 0,
      busted: 0,
      totalProfit: 0
    };

    for (let sim = 0; sim < numSims; sim++) {
      let balance = startingBalance;
      let currentBet = baseBet;
      let lossStreak = 0;
      let winStreak = 0;
      let units = 0;

      for (let round = 1; round <= numberOfRounds; round++) {
        switch (strategy) {
          case 'martingale':
            currentBet = strategies.martingale.calculate(baseBet, lossStreak);
            break;
          case 'fibonacci':
            currentBet = strategies.fibonacci.calculate(baseBet, lossStreak);
            break;
          case 'dalembert':
            currentBet = strategies.dalembert.calculate(baseBet, units);
            break;
          case 'flat':
            currentBet = baseBet;
            break;
          case 'paroli':
            currentBet = strategies.paroli.calculate(baseBet, winStreak);
            break;
        }

        if (currentBet > balance) currentBet = balance;

        const won = Math.random() * 100 <= winProbability;

        if (won) {
          balance += currentBet;
          lossStreak = 0;
          winStreak++;
          units = Math.max(0, units - 1);
        } else {
          balance -= currentBet;
          lossStreak++;
          winStreak = 0;
          units++;
        }

        if (balance <= 0) break;
        if (strategy === 'paroli' && winStreak >= 3) winStreak = 0;
      }

      const profit = balance - startingBalance;
      outcomes.totalProfit += profit;

      if (balance <= 0) {
        outcomes.busted++;
        outcomes.loss++;
      } else if (balance > startingBalance) {
        outcomes.profit++;
      } else {
        outcomes.loss++;
      }
    }

    alert(`Results of ${numSims} simulations:\n\n` +
      `Ended in profit: ${outcomes.profit}%\n` +
      `Ended in loss: ${outcomes.loss - outcomes.busted}%\n` +
      `Went bankrupt: ${outcomes.busted}%\n` +
      `Average outcome: $${(outcomes.totalProfit / numSims).toFixed(2)}`);

    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-900 via-red-900 to-orange-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
          <h1 className="text-4xl font-bold text-white mb-4">
            📊 Betting Strategy Simulator
          </h1>
          <p className="text-gray-300 text-lg">
            Test popular betting systems and see how they perform over time
          </p>
        </div>

        {/* Warning */}
        <div className="bg-yellow-500/20 border border-yellow-500 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="text-4xl">⚠️</div>
            <div>
              <h3 className="text-yellow-300 font-bold text-xl mb-2">Important Disclaimer</h3>
              <p className="text-yellow-100">
                No betting system can overcome the house edge. All these strategies will lose money over 
                a large sample size. This tool is for educational purposes to understand why progressive 
                betting systems don't work in the long run.
              </p>
            </div>
          </div>
        </div>

        {/* Strategy Selection */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
          <h3 className="text-white text-xl font-semibold mb-4">🎯 Select Strategy</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(strategies).map(([key, strat]) => (
              <button
                key={key}
                onClick={() => {
                  setStrategy(key);
                  setSimulationResults(null);
                }}
                className={`p-4 rounded-xl font-semibold transition-all ${
                  strategy === key
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                <div className="text-3xl mb-2">{strat.emoji}</div>
                <div className="text-sm">{strat.name.split(' ')[0]}</div>
              </button>
            ))}
          </div>
          <div className="mt-4 bg-white/5 rounded-lg p-4">
            <div className="text-white font-semibold mb-2">
              {strategies[strategy].emoji} {strategies[strategy].name}
            </div>
            <div className="text-gray-300 text-sm">
              {strategies[strategy].description}
            </div>
          </div>
        </div>

        {/* Parameters */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
          <h3 className="text-white text-xl font-semibold mb-4">⚙️ Parameters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-white font-semibold mb-2">Starting Balance ($)</label>
              <input
                type="number"
                value={startingBalance}
                onChange={(e) => setStartingBalance(parseFloat(e.target.value) || 0)}
                className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white"
                disabled={isRunning}
              />
            </div>
            <div>
              <label className="block text-white font-semibold mb-2">Base Bet ($)</label>
              <input
                type="number"
                value={baseBet}
                onChange={(e) => setBaseBet(parseFloat(e.target.value) || 0)}
                className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white"
                disabled={isRunning}
              />
            </div>
            <div>
              <label className="block text-white font-semibold mb-2">Win Probability (%)</label>
              <input
                type="number"
                step="0.01"
                value={winProbability}
                onChange={(e) => setWinProbability(parseFloat(e.target.value) || 0)}
                className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white"
                disabled={isRunning}
              />
            </div>
            <div>
              <label className="block text-white font-semibold mb-2">Rounds</label>
              <input
                type="number"
                value={numberOfRounds}
                onChange={(e) => setNumberOfRounds(parseInt(e.target.value) || 0)}
                className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white"
                disabled={isRunning}
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={simulateStrategy}
                disabled={isRunning}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
              >
                {isRunning ? '⏳ Running...' : '▶️ Run Simulation'}
              </button>
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <button
              onClick={runMultipleSimulations}
              disabled={isRunning}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
            >
              🎲 Run 100 Simulations
            </button>
            <button
              onClick={reset}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              🔄 Reset
            </button>
          </div>
        </div>

        {/* Results */}
        {simulationResults && (
          <>
            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                <div className="text-gray-300 text-sm">Final Balance</div>
                <div className={`text-2xl font-bold ${parseFloat(simulationResults.stats.profit) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ${simulationResults.stats.finalBalance}
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                <div className="text-gray-300 text-sm">Profit/Loss</div>
                <div className={`text-2xl font-bold ${parseFloat(simulationResults.stats.profit) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ${simulationResults.stats.profit}
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                <div className="text-gray-300 text-sm">Return</div>
                <div className={`text-2xl font-bold ${parseFloat(simulationResults.stats.profitPercentage) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {simulationResults.stats.profitPercentage}%
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                <div className="text-gray-300 text-sm">Win Rate</div>
                <div className="text-white text-2xl font-bold">
                  {simulationResults.stats.winRate}%
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                <div className="text-gray-300 text-sm">Max Bet</div>
                <div className="text-yellow-400 text-2xl font-bold">
                  ${simulationResults.stats.maxBet}
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                <div className="text-gray-300 text-sm">Total Wagered</div>
                <div className="text-white text-2xl font-bold">
                  ${simulationResults.stats.totalWagered}
                </div>
              </div>
            </div>

            {/* Busted Warning */}
            {simulationResults.stats.busted && (
              <div className="bg-red-500/20 border border-red-500 rounded-2xl p-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">💥</div>
                  <div>
                    <h3 className="text-red-300 font-bold text-2xl mb-2">BANKRUPT!</h3>
                    <p className="text-red-100">
                      You ran out of money after {simulationResults.stats.roundsPlayed} rounds. 
                      This demonstrates the risk of progressive betting systems - one bad streak can wipe out your bankroll.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Chart */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
              <h3 className="text-white text-xl font-semibold mb-4">📈 Balance Over Time</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={simulationResults.results}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis dataKey="round" stroke="#fff" />
                  <YAxis stroke="#fff" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="balance" stroke="#10b981" strokeWidth={2} name="Balance" />
                  <Line type="monotone" dataKey="bet" stroke="#f59e0b" strokeWidth={2} name="Bet Size" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* Educational Content */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-white text-xl font-semibold mb-4">🎓 Why Betting Systems Don't Work</h3>
          <div className="space-y-4 text-gray-300">
            <div className="bg-white/5 rounded-lg p-4">
              <strong className="text-white">The Gambler's Fallacy</strong>
              <p className="mt-2">Past results don't affect future outcomes. A roulette wheel has no memory - each spin is independent.</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <strong className="text-white">The House Edge Never Changes</strong>
              <p className="mt-2">No matter what betting pattern you use, the mathematical expectation remains negative. You can't overcome this with clever betting.</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <strong className="text-white">Table Limits & Bankroll</strong>
              <p className="mt-2">Progressive systems like Martingale quickly hit table limits or exhaust your bankroll during a losing streak. A 10-loss streak requires betting 1,024× your base bet!</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <strong className="text-white">Short-Term Variance</strong>
              <p className="mt-2">You might win in the short term due to luck, but over thousands of bets, the house edge guarantees the casino wins. These systems just change your variance profile.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
