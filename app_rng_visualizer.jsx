import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function RNGVisualizer() {
  const [numbers, setNumbers] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [speed, setSpeed] = useState(100);
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [distribution, setDistribution] = useState({});
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({
    mean: 0,
    median: 0,
    mode: 0,
    stdDev: 0,
    count: 0
  });

  // Generate random number using crypto API for true randomness
  const generateSecureRandom = (min, max) => {
    const range = max - min + 1;
    const bytesNeeded = Math.ceil(Math.log2(range) / 8);
    const maxValue = Math.pow(256, bytesNeeded);
    const randomBytes = new Uint8Array(bytesNeeded);
    
    crypto.getRandomValues(randomBytes);
    
    let randomValue = 0;
    for (let i = 0; i < bytesNeeded; i++) {
      randomValue = randomValue * 256 + randomBytes[i];
    }
    
    return min + (randomValue % range);
  };

  // Calculate statistics
  const calculateStats = (nums) => {
    if (nums.length === 0) return stats;

    const sorted = [...nums].sort((a, b) => a - b);
    const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
    const median = sorted[Math.floor(sorted.length / 2)];
    
    // Calculate mode
    const frequency = {};
    let maxFreq = 0;
    let mode = nums[0];
    nums.forEach(num => {
      frequency[num] = (frequency[num] || 0) + 1;
      if (frequency[num] > maxFreq) {
        maxFreq = frequency[num];
        mode = num;
      }
    });

    // Calculate standard deviation
    const squareDiffs = nums.map(value => Math.pow(value - mean, 2));
    const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / nums.length;
    const stdDev = Math.sqrt(avgSquareDiff);

    return {
      mean: mean.toFixed(2),
      median,
      mode,
      stdDev: stdDev.toFixed(2),
      count: nums.length
    };
  };

  // Update distribution for chart
  const updateDistribution = (nums) => {
    const dist = {};
    const bucketSize = Math.ceil((max - min + 1) / 20);
    
    for (let i = min; i <= max; i += bucketSize) {
      const bucketKey = `${i}-${Math.min(i + bucketSize - 1, max)}`;
      dist[bucketKey] = 0;
    }

    nums.forEach(num => {
      const bucketIndex = Math.floor((num - min) / bucketSize);
      const bucketStart = min + bucketIndex * bucketSize;
      const bucketKey = `${bucketStart}-${Math.min(bucketStart + bucketSize - 1, max)}`;
      if (dist[bucketKey] !== undefined) {
        dist[bucketKey]++;
      }
    });

    setDistribution(dist);
  };

  useEffect(() => {
    let interval;
    if (isGenerating) {
      interval = setInterval(() => {
        const newNum = generateSecureRandom(min, max);
        const newNumbers = [...numbers, newNum].slice(-1000); // Keep last 1000
        setNumbers(newNumbers);
        setStats(calculateStats(newNumbers));
        updateDistribution(newNumbers);
        
        // Update history for line chart
        setHistory(prev => [...prev, { index: prev.length, value: newNum }].slice(-100));
      }, speed);
    }
    return () => clearInterval(interval);
  }, [isGenerating, speed, min, max, numbers]);

  const startGeneration = () => {
    setIsGenerating(true);
  };

  const stopGeneration = () => {
    setIsGenerating(false);
  };

  const reset = () => {
    setNumbers([]);
    setDistribution({});
    setHistory([]);
    setStats({ mean: 0, median: 0, mode: 0, stdDev: 0, count: 0 });
    setIsGenerating(false);
  };

  const generateBatch = () => {
    const batch = [];
    for (let i = 0; i < 1000; i++) {
      batch.push(generateSecureRandom(min, max));
    }
    const newNumbers = [...numbers, ...batch].slice(-1000);
    setNumbers(newNumbers);
    setStats(calculateStats(newNumbers));
    updateDistribution(newNumbers);
  };

  const chartData = Object.entries(distribution).map(([range, count]) => ({
    range,
    count
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
          <h1 className="text-4xl font-bold text-white mb-4">
            🎲 Cryptographic RNG Visualizer
          </h1>
          <p className="text-gray-300 text-lg">
            Real-time visualization of cryptographically secure random number generation using Web Crypto API
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="block text-white font-semibold mb-2">Min Value</label>
              <input
                type="number"
                value={min}
                onChange={(e) => setMin(parseInt(e.target.value))}
                className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white"
                disabled={isGenerating}
              />
            </div>
            <div>
              <label className="block text-white font-semibold mb-2">Max Value</label>
              <input
                type="number"
                value={max}
                onChange={(e) => setMax(parseInt(e.target.value))}
                className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white"
                disabled={isGenerating}
              />
            </div>
            <div>
              <label className="block text-white font-semibold mb-2">Speed (ms)</label>
              <input
                type="range"
                min="10"
                max="1000"
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-white text-sm text-center mt-1">{speed}ms</div>
            </div>
            <div className="flex items-end">
              <div className="w-full space-y-2">
                <button
                  onClick={isGenerating ? stopGeneration : startGeneration}
                  className={`w-full px-6 py-3 rounded-lg font-semibold transition-all ${
                    isGenerating
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {isGenerating ? '⏸ Stop' : '▶ Start'}
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={generateBatch}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
              disabled={isGenerating}
            >
              🎯 Generate 1,000
            </button>
            <button
              onClick={reset}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
              disabled={isGenerating}
            >
              🔄 Reset
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="text-gray-300 text-sm mb-1">Count</div>
            <div className="text-white text-3xl font-bold">{stats.count}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="text-gray-300 text-sm mb-1">Mean</div>
            <div className="text-white text-3xl font-bold">{stats.mean}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="text-gray-300 text-sm mb-1">Median</div>
            <div className="text-white text-3xl font-bold">{stats.median}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="text-gray-300 text-sm mb-1">Mode</div>
            <div className="text-white text-3xl font-bold">{stats.mode}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="text-gray-300 text-sm mb-1">Std Dev</div>
            <div className="text-white text-3xl font-bold">{stats.stdDev}</div>
          </div>
        </div>

        {/* Latest Number Display */}
        {numbers.length > 0 && (
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 mb-8 text-center">
            <div className="text-white text-lg mb-2">Latest Number</div>
            <div className="text-white text-7xl font-bold animate-pulse">
              {numbers[numbers.length - 1]}
            </div>
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Distribution Chart */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-white text-xl font-semibold mb-4">Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="range" stroke="#fff" angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="#fff" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* History Line Chart */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-white text-xl font-semibold mb-4">Recent History (Last 100)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="index" stroke="#fff" />
                <YAxis stroke="#fff" domain={[min, max]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="value" stroke="#ec4899" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Information */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mt-8 border border-white/20">
          <h3 className="text-white text-xl font-semibold mb-4">📚 About This Tool</h3>
          <div className="text-gray-300 space-y-2">
            <p>
              <strong className="text-white">Cryptographic RNG:</strong> This tool uses the Web Crypto API 
              (crypto.getRandomValues) to generate cryptographically secure random numbers, the same method used 
              by online casinos for fair gaming.
            </p>
            <p>
              <strong className="text-white">Statistical Analysis:</strong> Watch how the distribution approaches 
              uniformity as more numbers are generated. True randomness should show no patterns.
            </p>
            <p>
              <strong className="text-white">Expected Distribution:</strong> For a truly random generator over 
              a large sample size, each value should appear with roughly equal frequency.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
