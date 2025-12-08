import React, { useState, useEffect } from 'react';

export default function BlackjackStrategyTrainer() {
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerCard, setDealerCard] = useState(null);
  const [score, setScore] = useState({ correct: 0, incorrect: 0, streak: 0, maxStreak: 0 });
  const [feedback, setFeedback] = useState(null);
  const [difficulty, setDifficulty] = useState('basic');
  const [showHint, setShowHint] = useState(false);

  const cards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  
  const cardValues = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
    '10': 10, 'J': 10, 'Q': 10, 'K': 10, 'A': 11
  };

  // Basic Strategy Chart
  const basicStrategy = {
    hard: {
      // [player total][dealer card] = action
      17: { 2: 'stand', 3: 'stand', 4: 'stand', 5: 'stand', 6: 'stand', 7: 'stand', 8: 'stand', 9: 'stand', 10: 'stand', A: 'stand' },
      16: { 2: 'stand', 3: 'stand', 4: 'stand', 5: 'stand', 6: 'stand', 7: 'hit', 8: 'hit', 9: 'surrender', 10: 'surrender', A: 'surrender' },
      15: { 2: 'stand', 3: 'stand', 4: 'stand', 5: 'stand', 6: 'stand', 7: 'hit', 8: 'hit', 9: 'hit', 10: 'surrender', A: 'hit' },
      14: { 2: 'stand', 3: 'stand', 4: 'stand', 5: 'stand', 6: 'stand', 7: 'hit', 8: 'hit', 9: 'hit', 10: 'hit', A: 'hit' },
      13: { 2: 'stand', 3: 'stand', 4: 'stand', 5: 'stand', 6: 'stand', 7: 'hit', 8: 'hit', 9: 'hit', 10: 'hit', A: 'hit' },
      12: { 2: 'hit', 3: 'hit', 4: 'stand', 5: 'stand', 6: 'stand', 7: 'hit', 8: 'hit', 9: 'hit', 10: 'hit', A: 'hit' },
      11: { 2: 'double', 3: 'double', 4: 'double', 5: 'double', 6: 'double', 7: 'double', 8: 'double', 9: 'double', 10: 'double', A: 'hit' },
      10: { 2: 'double', 3: 'double', 4: 'double', 5: 'double', 6: 'double', 7: 'double', 8: 'double', 9: 'double', 10: 'hit', A: 'hit' },
      9: { 2: 'hit', 3: 'double', 4: 'double', 5: 'double', 6: 'double', 7: 'hit', 8: 'hit', 9: 'hit', 10: 'hit', A: 'hit' },
      8: { 2: 'hit', 3: 'hit', 4: 'hit', 5: 'hit', 6: 'hit', 7: 'hit', 8: 'hit', 9: 'hit', 10: 'hit', A: 'hit' }
    },
    soft: {
      // Soft hands (with Ace)
      20: { 2: 'stand', 3: 'stand', 4: 'stand', 5: 'stand', 6: 'stand', 7: 'stand', 8: 'stand', 9: 'stand', 10: 'stand', A: 'stand' },
      19: { 2: 'stand', 3: 'stand', 4: 'stand', 5: 'stand', 6: 'double', 7: 'stand', 8: 'stand', 9: 'stand', 10: 'stand', A: 'stand' },
      18: { 2: 'stand', 3: 'double', 4: 'double', 5: 'double', 6: 'double', 7: 'stand', 8: 'stand', 9: 'hit', 10: 'hit', A: 'hit' },
      17: { 2: 'hit', 3: 'double', 4: 'double', 5: 'double', 6: 'double', 7: 'hit', 8: 'hit', 9: 'hit', 10: 'hit', A: 'hit' },
      16: { 2: 'hit', 3: 'hit', 4: 'double', 5: 'double', 6: 'double', 7: 'hit', 8: 'hit', 9: 'hit', 10: 'hit', A: 'hit' },
      15: { 2: 'hit', 3: 'hit', 4: 'double', 5: 'double', 6: 'double', 7: 'hit', 8: 'hit', 9: 'hit', 10: 'hit', A: 'hit' },
      14: { 2: 'hit', 3: 'hit', 4: 'hit', 5: 'double', 6: 'double', 7: 'hit', 8: 'hit', 9: 'hit', 10: 'hit', A: 'hit' },
      13: { 2: 'hit', 3: 'hit', 4: 'hit', 5: 'double', 6: 'double', 7: 'hit', 8: 'hit', 9: 'hit', 10: 'hit', A: 'hit' }
    },
    pairs: {
      'A,A': { 2: 'split', 3: 'split', 4: 'split', 5: 'split', 6: 'split', 7: 'split', 8: 'split', 9: 'split', 10: 'split', A: 'split' },
      '10,10': { 2: 'stand', 3: 'stand', 4: 'stand', 5: 'stand', 6: 'stand', 7: 'stand', 8: 'stand', 9: 'stand', 10: 'stand', A: 'stand' },
      '9,9': { 2: 'split', 3: 'split', 4: 'split', 5: 'split', 6: 'split', 7: 'stand', 8: 'split', 9: 'split', 10: 'stand', A: 'stand' },
      '8,8': { 2: 'split', 3: 'split', 4: 'split', 5: 'split', 6: 'split', 7: 'split', 8: 'split', 9: 'split', 10: 'split', A: 'split' },
      '7,7': { 2: 'split', 3: 'split', 4: 'split', 5: 'split', 6: 'split', 7: 'split', 8: 'hit', 9: 'hit', 10: 'hit', A: 'hit' },
      '6,6': { 2: 'split', 3: 'split', 4: 'split', 5: 'split', 6: 'split', 7: 'hit', 8: 'hit', 9: 'hit', 10: 'hit', A: 'hit' },
      '5,5': { 2: 'double', 3: 'double', 4: 'double', 5: 'double', 6: 'double', 7: 'double', 8: 'double', 9: 'double', 10: 'hit', A: 'hit' },
      '4,4': { 2: 'hit', 3: 'hit', 4: 'hit', 5: 'split', 6: 'split', 7: 'hit', 8: 'hit', 9: 'hit', 10: 'hit', A: 'hit' },
      '3,3': { 2: 'split', 3: 'split', 4: 'split', 5: 'split', 6: 'split', 7: 'split', 8: 'hit', 9: 'hit', 10: 'hit', A: 'hit' },
      '2,2': { 2: 'split', 3: 'split', 4: 'split', 5: 'split', 6: 'split', 7: 'split', 8: 'hit', 9: 'hit', 10: 'hit', A: 'hit' }
    }
  };

  const calculateHandValue = (hand) => {
    let value = 0;
    let aces = 0;

    hand.forEach(card => {
      value += cardValues[card];
      if (card === 'A') aces++;
    });

    while (value > 21 && aces > 0) {
      value -= 10;
      aces--;
    }

    return { value, hasAce: aces > 0 };
  };

  const getCorrectAction = () => {
    const handCalc = calculateHandValue(playerHand);
    const dealerValue = dealerCard === 'A' ? 'A' : cardValues[dealerCard];

    // Check for pairs
    if (playerHand.length === 2 && cardValues[playerHand[0]] === cardValues[playerHand[1]]) {
      const pairKey = `${playerHand[0]},${playerHand[1]}`;
      if (basicStrategy.pairs[pairKey]) {
        return basicStrategy.pairs[pairKey][dealerValue];
      }
    }

    // Check for soft hands (with usable Ace)
    if (handCalc.hasAce && handCalc.value >= 13 && handCalc.value <= 20) {
      if (basicStrategy.soft[handCalc.value]) {
        return basicStrategy.soft[handCalc.value][dealerValue];
      }
    }

    // Hard hands
    const hardValue = Math.min(handCalc.value, 17);
    if (handCalc.value >= 8 && handCalc.value <= 17) {
      if (basicStrategy.hard[hardValue]) {
        return basicStrategy.hard[hardValue][dealerValue];
      }
    }

    // Default
    if (handCalc.value >= 17) return 'stand';
    return 'hit';
  };

  const dealNewHand = () => {
    // Generate random hand based on difficulty
    let newHand = [];
    
    if (difficulty === 'basic') {
      // Simple hands
      const card1 = cards[Math.floor(Math.random() * cards.length)];
      const card2 = cards[Math.floor(Math.random() * cards.length)];
      newHand = [card1, card2];
    } else if (difficulty === 'pairs') {
      // Focus on pairs
      if (Math.random() > 0.3) {
        const card = cards[Math.floor(Math.random() * cards.length)];
        newHand = [card, card];
      } else {
        const card1 = cards[Math.floor(Math.random() * cards.length)];
        const card2 = cards[Math.floor(Math.random() * cards.length)];
        newHand = [card1, card2];
      }
    } else {
      // Mixed difficulty
      const card1 = cards[Math.floor(Math.random() * cards.length)];
      const card2 = cards[Math.floor(Math.random() * cards.length)];
      newHand = [card1, card2];
    }

    const newDealerCard = cards[Math.floor(Math.random() * cards.length)];
    
    setPlayerHand(newHand);
    setDealerCard(newDealerCard);
    setFeedback(null);
    setShowHint(false);
  };

  const handleAction = (action) => {
    const correctAction = getCorrectAction();
    const isCorrect = action === correctAction;

    if (isCorrect) {
      setScore(prev => ({
        correct: prev.correct + 1,
        incorrect: prev.incorrect,
        streak: prev.streak + 1,
        maxStreak: Math.max(prev.streak + 1, prev.maxStreak)
      }));
      setFeedback({
        correct: true,
        message: '✅ Correct! Well done!',
        correctAction
      });
    } else {
      setScore(prev => ({
        ...prev,
        incorrect: prev.incorrect + 1,
        streak: 0
      }));
      setFeedback({
        correct: false,
        message: `❌ Incorrect. The correct play is: ${correctAction.toUpperCase()}`,
        correctAction,
        explanation: getExplanation(playerHand, dealerCard, correctAction)
      });
    }

    setTimeout(() => {
      dealNewHand();
    }, 3000);
  };

  const getExplanation = (hand, dealer, action) => {
    const handCalc = calculateHandValue(hand);
    const isPair = hand.length === 2 && cardValues[hand[0]] === cardValues[hand[1]];
    
    const explanations = {
      hit: `With ${handCalc.value}, you need to draw another card to improve your hand.`,
      stand: `${handCalc.value} is strong enough. Drawing risks busting.`,
      double: `This is a strong hand to double down - the expected value is highest when doubling your bet.`,
      split: `Always split ${hand[0]}s. Each hand has better potential separately.`,
      surrender: `Dealer has a strong card and your hand is weak. Surrender to minimize losses.`
    };

    return explanations[action] || 'Follow basic strategy for optimal play.';
  };

  useEffect(() => {
    dealNewHand();
  }, [difficulty]);

  const handCalc = calculateHandValue(playerHand);
  const accuracy = score.correct + score.incorrect > 0
    ? ((score.correct / (score.correct + score.incorrect)) * 100).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
          <h1 className="text-4xl font-bold text-white mb-4">
            🃏 Blackjack Basic Strategy Trainer
          </h1>
          <p className="text-gray-300 text-lg">
            Master perfect blackjack strategy and reduce the house edge to ~0.5%
          </p>
        </div>

        {/* Score & Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Statistics */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-white text-xl font-semibold mb-4">📊 Your Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-500/20 border border-green-500 rounded-lg p-4">
                <div className="text-green-300 text-sm">Correct</div>
                <div className="text-white text-3xl font-bold">{score.correct}</div>
              </div>
              <div className="bg-red-500/20 border border-red-500 rounded-lg p-4">
                <div className="text-red-300 text-sm">Incorrect</div>
                <div className="text-white text-3xl font-bold">{score.incorrect}</div>
              </div>
              <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-4">
                <div className="text-blue-300 text-sm">Accuracy</div>
                <div className="text-white text-3xl font-bold">{accuracy}%</div>
              </div>
              <div className="bg-purple-500/20 border border-purple-500 rounded-lg p-4">
                <div className="text-purple-300 text-sm">Max Streak</div>
                <div className="text-white text-3xl font-bold">{score.maxStreak}</div>
              </div>
            </div>
            {score.streak > 0 && (
              <div className="mt-4 bg-yellow-500/20 border border-yellow-500 rounded-lg p-3 text-center">
                <div className="text-yellow-300 font-bold">🔥 {score.streak} in a row!</div>
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-white text-xl font-semibold mb-4">⚙️ Difficulty</h3>
            <div className="space-y-3">
              <button
                onClick={() => setDifficulty('basic')}
                className={`w-full p-4 rounded-lg font-semibold transition-all ${
                  difficulty === 'basic'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                🟢 Basic - Simple two-card hands
              </button>
              <button
                onClick={() => setDifficulty('pairs')}
                className={`w-full p-4 rounded-lg font-semibold transition-all ${
                  difficulty === 'pairs'
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                🟡 Pairs - Focus on splitting decisions
              </button>
              <button
                onClick={() => setDifficulty('advanced')}
                className={`w-full p-4 rounded-lg font-semibold transition-all ${
                  difficulty === 'advanced'
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                🔴 Advanced - All situations
              </button>
            </div>
          </div>
        </div>

        {/* Game Table */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
          {/* Dealer */}
          <div className="text-center mb-12">
            <div className="text-gray-300 text-lg mb-4">Dealer Shows</div>
            <div className="inline-block bg-white rounded-xl p-8 shadow-2xl">
              <div className="text-6xl font-bold text-gray-900">{dealerCard}</div>
            </div>
          </div>

          {/* Player Hand */}
          <div className="text-center mb-8">
            <div className="text-gray-300 text-lg mb-4">Your Hand</div>
            <div className="flex justify-center gap-4 mb-4">
              {playerHand.map((card, index) => (
                <div key={index} className="bg-white rounded-xl p-8 shadow-2xl transform hover:scale-105 transition-all">
                  <div className="text-6xl font-bold text-gray-900">{card}</div>
                </div>
              ))}
            </div>
            <div className="text-white text-2xl font-bold">
              Total: {handCalc.value}
              {handCalc.hasAce && handCalc.value <= 11 && ' (Soft)'}
            </div>
          </div>

          {/* Feedback */}
          {feedback && (
            <div className={`rounded-xl p-6 mb-8 ${
              feedback.correct
                ? 'bg-green-500/20 border border-green-500'
                : 'bg-red-500/20 border border-red-500'
            }`}>
              <div className={`text-2xl font-bold mb-2 ${
                feedback.correct ? 'text-green-300' : 'text-red-300'
              }`}>
                {feedback.message}
              </div>
              {feedback.explanation && (
                <div className="text-gray-300">{feedback.explanation}</div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          {!feedback && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <button
                onClick={() => handleAction('hit')}
                className="bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-6 rounded-xl font-bold text-xl transition-all transform hover:scale-105"
              >
                👊 HIT
              </button>
              <button
                onClick={() => handleAction('stand')}
                className="bg-gradient-to-br from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-6 rounded-xl font-bold text-xl transition-all transform hover:scale-105"
              >
                ✋ STAND
              </button>
              <button
                onClick={() => handleAction('double')}
                className="bg-gradient-to-br from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-6 rounded-xl font-bold text-xl transition-all transform hover:scale-105"
              >
                💰 DOUBLE
              </button>
              <button
                onClick={() => handleAction('split')}
                className="bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-6 rounded-xl font-bold text-xl transition-all transform hover:scale-105"
              >
                ✂️ SPLIT
              </button>
              <button
                onClick={() => handleAction('surrender')}
                className="bg-gradient-to-br from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white px-8 py-6 rounded-xl font-bold text-xl transition-all transform hover:scale-105"
              >
                🏳️ SURRENDER
              </button>
            </div>
          )}

          {/* Hint Button */}
          {!feedback && (
            <div className="text-center mt-6">
              <button
                onClick={() => setShowHint(!showHint)}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition-all"
              >
                {showHint ? '🔒 Hide Hint' : '💡 Show Hint'}
              </button>
              {showHint && (
                <div className="mt-4 bg-yellow-500/20 border border-yellow-500 rounded-lg p-4 text-yellow-100">
                  💡 The correct play is: <strong className="text-white">{getCorrectAction().toUpperCase()}</strong>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Strategy Tips */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-white text-xl font-semibold mb-4">🎓 Strategy Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
            <div className="bg-white/5 rounded-lg p-4">
              <strong className="text-white">Always Split Aces & 8s</strong>
              <p className="text-sm mt-2">Two aces give you two chances at 21. Two 8s = 16 (worst hand), but split = two chances at 18+.</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <strong className="text-white">Never Split 10s</strong>
              <p className="text-sm mt-2">20 is already a strong hand. Don't break it up for two potential weaker hands.</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <strong className="text-white">Double on 11</strong>
              <p className="text-sm mt-2">11 is the best doubling hand. You can't bust and have a high chance of getting a strong total.</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <strong className="text-white">Dealer Must Hit 16</strong>
              <p className="text-sm mt-2">Dealer follows fixed rules. They must hit on 16 and below, which influences when you should stand.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
