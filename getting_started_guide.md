# Getting Started: Your First Automated Strategy

**Estimated time:** 30-45 minutes  
**Difficulty:** Beginner  
**Prerequisites:** Platform account created, basic understanding of trading

---

## What You'll Accomplish

By the end of this guide, you will:
- ✅ Have your account fully configured with risk limits
- ✅ Create or select your first trading strategy
- ✅ Backtest the strategy on historical data
- ✅ Deploy the strategy to paper trading
- ✅ Monitor performance and understand key metrics

**Important:** This guide focuses on paper trading (simulated trading with fake money). You should paper trade for at least 2 weeks before considering live trading.

---

## Step 1: Complete Account Setup (5 minutes)

### Set Your Risk Tolerance

Before creating any strategy, define your risk parameters. These act as safety limits across all your strategies.

**Navigate to:** Settings → Risk Management

**Configure the following:**

**Account-Level Limits:**
- **Maximum Daily Loss:** $500 (or 5% of capital)
  - If daily losses hit this amount, all strategies auto-pause
- **Maximum Drawdown:** 20%
  - If account drops 20% from peak, all strategies stop
- **Maximum Position Size:** 30% of capital
  - Prevents over-concentration in single trades

**Strategy-Level Defaults:**
- **Risk Per Trade:** 1% of capital
  - Standard conservative approach
- **Max Concurrent Positions:** 3-5
  - Limits total exposure at any time
- **Leverage:** 1x (no leverage to start)
  - Increase only after proven success

**[VISUAL: Risk settings form with recommended values filled in and "Save Settings" button]**

Click **"Save Settings"**.

### Connect Exchange or Broker (Paper Trading)

For paper trading, you don't need to connect a real exchange account.

**Navigate to:** Settings → Trading Accounts

**Select:** Paper Trading Account
- Starting balance: $10,000 (default)
- Trading fees: 0.1% (realistic simulation)
- Slippage model: Enabled

Click **"Activate Paper Trading"**.

**[VISUAL: Trading accounts panel showing "Paper Trading" selected with green "Active" status]**

✅ **Checkpoint:** Your account is now configured with safety limits and ready for paper trading.

---

## Step 2: Choose Your First Strategy (10 minutes)

You have two options: create your own strategy or use a proven template.

### Option A: Use a Proven Template (Recommended for Beginners)

**Navigate to:** Strategies → Strategy Library → Templates

**Recommended beginner strategies:**

**1. Moving Average Crossover**
- **Complexity:** Low
- **Type:** Trend following
- **Win Rate:** ~45-55%
- **Best For:** Trending markets
- **Assets:** BTC/USDT, ETH/USDT, major forex pairs

**2. RSI Mean Reversion**
- **Complexity:** Low
- **Type:** Counter-trend
- **Win Rate:** ~55-65%
- **Best For:** Range-bound markets
- **Assets:** Stocks, crypto during consolidation

**3. Bollinger Band Bounce**
- **Complexity:** Low-Medium
- **Type:** Mean reversion
- **Win Rate:** ~50-60%
- **Best For:** Moderate volatility markets
- **Assets:** Most liquid assets

**Select a strategy** and click **"Clone to My Strategies"**.

**[VISUAL: Strategy cards showing name, type, win rate, and "Clone" button. MA Crossover card is highlighted]**

### Option B: Create Your Own Strategy

If you prefer to build from scratch:

**Navigate to:** Strategies → Create New

Follow the [Strategy Builder Tutorial](#) for step-by-step instructions.

**For this guide, we'll use the Moving Average Crossover template.**

---

## Step 3: Configure Strategy Parameters (5 minutes)

After cloning the template:

**Navigate to:** My Strategies → Moving Average Crossover

Click **"Edit Settings"**.

### Basic Settings

**Strategy Name:** MA Crossover - BTC (customize as needed)

**Asset Selection:**
- Primary asset: BTC/USDT
- Exchange: Binance (or your preferred exchange)
- Timeframe: 1 hour

**Capital Allocation:**
- Dedicated capital: $3,000 (30% of $10,000 account)
- This strategy can only use up to $3,000

### Strategy Parameters

**Moving Average Settings:**
- Fast MA: 20 periods (default)
- Slow MA: 50 periods (default)
- Type: Simple Moving Average (SMA)

**Entry Rules:**
- Signal: Fast MA crosses above Slow MA
- Confirmation: 1 bar (wait for candle to close)

**Exit Rules:**
- Signal: Fast MA crosses below Slow MA
- Stop-loss: 5% below entry price
- Take-profit: 10% above entry price (optional)

**Position Sizing:**
- Risk per trade: 1% of dedicated capital = $30
- Position size: Calculated automatically based on stop-loss distance

**[VISUAL: Strategy configuration form with these parameters filled in]**

Click **"Save Configuration"**.

✅ **Checkpoint:** Your strategy is configured and ready to backtest.

---

## Step 4: Backtest Your Strategy (10 minutes)

Before deploying any strategy, test it on historical data to see how it would have performed.

### Run the Backtest

From your strategy page, click **"Run Backtest"**.

**Backtest Configuration:**

**Date Range:**
- Start: 12 months ago
- End: Today
- (Longer = more reliable results)

**Initial Capital:**
- $3,000 (matches your dedicated capital)

**Trading Costs:**
- Commission: 0.1% per trade
- Slippage: 0.05%

Click **"Start Backtest"**.

**Wait time:** 30-60 seconds for 12 months of hourly data.

### Evaluate Results

**[VISUAL: Results dashboard showing equity curve, metrics table, and trade list]**

**Minimum standards to proceed:**

| Metric | Minimum | Your Result | Pass? |
|--------|---------|-------------|-------|
| Total Return | >10% | ___ % | ☐ |
| Profit Factor | >1.3 | ___ | ☐ |
| Max Drawdown | <30% | ___ % | ☐ |
| Win Rate | >40% | ___ % | ☐ |
| Total Trades | >50 | ___ | ☐ |

**If all checkboxes pass:** Proceed to paper trading ✅

**If 2+ checkboxes fail:** 
- Consider adjusting parameters
- Try a different strategy template
- Review [Backtesting Engine Guide](#) for optimization tips

### Common Backtest Interpretations

**Good Result Example:**
```
Total Return: +42%
Profit Factor: 1.68
Max Drawdown: -18%
Win Rate: 52%
Total Trades: 127

→ Strong strategy, proceed to paper trading
```

**Concerning Result Example:**
```
Total Return: +8%
Profit Factor: 1.12
Max Drawdown: -38%
Win Rate: 34%
Total Trades: 23

→ Weak strategy, adjust parameters or choose different strategy
```

✅ **Checkpoint:** Your strategy passed backtesting standards.

---

## Step 5: Deploy to Paper Trading (5 minutes)

Now that your strategy is validated, deploy it to paper trading for real-time simulation.

### Activate Paper Trading

From your strategy page, click **"Deploy"**.

**Deployment Options:**

Select **"Paper Trading"** (not Live Trading).

**Confirmation Checklist:**
- [ ] Strategy backtested with acceptable results
- [ ] Risk parameters configured
- [ ] Account limits set (max loss, max drawdown)
- [ ] Understanding this is simulated trading (no real money)

Click **"Deploy to Paper Trading"**.

**[VISUAL: Deployment modal with Paper Trading selected, showing confirmation checklist and "Deploy" button]**

### Activation Confirmation

You'll see:
- ✅ Strategy Status: Active (Paper)
- 📊 Current Position: None (waiting for signal)
- 💰 Dedicated Capital: $3,000 available
- ⏰ Last Checked: Just now

**[VISUAL: Strategy dashboard showing Active status with green indicator]**

---

## Step 6: Monitor Your Strategy (Ongoing)

Your strategy is now running automatically. Here's how to monitor it.

### Daily Monitoring

**Navigate to:** Dashboard → Active Strategies

**Key information displayed:**

**Performance Today:**
- P&L: $0 (no trades yet)
- Open Positions: 0
- Trades Today: 0

**Overall Performance:**
- Total Return: 0% (just started)
- Current Drawdown: 0%
- Win Rate: N/A (need 10+ trades)

**Recent Activity:**
- [Timestamp] Strategy activated
- [Timestamp] Monitoring BTC/USDT for signals
- [Timestamp] Waiting for Fast MA to cross Slow MA

**[VISUAL: Dashboard showing strategy card with these metrics and activity feed]**

### Understanding Signals and Trades

**When a trade happens, you'll see:**

**Entry Notification:**
```
🟢 BUY Signal Triggered
Asset: BTC/USDT
Entry Price: $43,250
Position Size: 0.069 BTC ($3,000)
Stop-Loss: $41,087 (-5%)
Take-Profit: $47,575 (+10%)
Risk: $30 (1% of capital)
Time: 2024-12-10 14:00:00 UTC
```

**Exit Notification:**
```
🔴 SELL Signal Triggered (or Stop-Loss Hit / Take-Profit Reached)
Asset: BTC/USDT
Exit Price: $44,800
P&L: +$107 (+3.58%)
Duration: 2.3 days
Time: 2024-12-12 21:00:00 UTC
```

### What to Watch For

**First 2 weeks of paper trading:**

**Positive signs:**
- Strategy generates signals as expected
- Entry/exit logic makes sense in real-time
- Risk per trade matches configuration
- No technical errors or bugs

**Warning signs:**
- No signals generated for days (conditions too strict?)
- Too many signals (conditions too loose?)
- Losses consistently larger than expected
- Technical errors (API failures, connectivity issues)

---

## Step 7: Review After 2 Weeks (5 minutes)

After 2 weeks of paper trading, perform a formal review before considering live trading.

### Performance Checklist

**Metrics to evaluate:**

| Metric | Target | Your Result |
|--------|--------|-------------|
| Total Return | Positive | ___ % |
| Number of Trades | 10+ | ___ |
| Win Rate | 40%+ | ___ % |
| Largest Loss | <3% of capital | ___ |
| Strategy Uptime | 95%+ | ___ % |

**Qualitative Assessment:**
- [ ] I understand why each trade was taken
- [ ] Drawdowns felt emotionally manageable
- [ ] No technical issues or bugs
- [ ] Strategy behavior matches backtest expectations
- [ ] Comfortable proceeding to live trading with small capital

### Three Possible Outcomes

**1. Paper Trading Success** ✅
- Performance meets/exceeds expectations
- No technical issues
- Emotionally comfortable with process
- **Action:** Consider live trading with 10-20% of intended capital

**2. Mixed Results** ⚠️
- Some good trades, some concerning patterns
- Minor technical hiccups
- Need more data to assess
- **Action:** Continue paper trading for another 2-4 weeks

**3. Poor Performance** ❌
- Losses exceed expectations
- Frequent errors or issues
- Strategy behavior doesn't match backtest
- **Action:** Pause, analyze problems, adjust or choose different strategy

---

## Step 8: Transition to Live Trading (If Ready)

**Only proceed if you passed the 2-week review checklist above.**

### Start Small

**Recommended approach:**
1. Start with 10-20% of your intended capital
2. Run for 2 weeks alongside paper trading
3. Compare live vs paper performance
4. Gradually increase capital if performance matches

**Example:**
- Planned live capital: $10,000
- Start with: $1,000-$2,000
- Run both: Live ($1,000) + Paper ($10,000)
- After 2 weeks: Increase to $3,000-$5,000 if successful

### Activate Live Trading

**Navigate to:** My Strategies → [Your Strategy]

Click **"Deploy"** → **"Live Trading"**

**You'll need to:**
1. Connect your exchange/broker account (API keys)
2. Confirm risk limits
3. Verify starting capital
4. Accept terms (acknowledge real money at risk)

**[VISUAL: Live trading deployment with exchange connection, capital input, and risk confirmation]**

### Live Trading Differences

**What changes:**
- Real money at risk
- Emotional responses intensify
- Small technical issues become costly
- Discipline becomes critical

**What doesn't change:**
- Strategy logic and rules
- Risk management parameters
- Monitoring requirements

---

## Best Practices for Success

### Do's ✅

**1. Start Conservative**
- Use 1% risk per trade maximum
- Begin with simple strategies
- Paper trade for full 2 weeks minimum

**2. Monitor Regularly**
- Check performance daily (first month)
- Review trades weekly
- Analyze metrics monthly

**3. Follow Your Rules**
- Let strategy execute automatically
- Don't manually override signals
- Trust the system you backtested

**4. Keep Learning**
- Review why trades won or lost
- Study market conditions during drawdowns
- Adjust only based on data, not emotion

**5. Maintain Discipline**
- Accept that losses are normal
- Don't increase risk after losses
- Stick to position sizing rules

### Don'ts ❌

**1. Don't Rush to Live Trading**
- Skipping paper trading = high failure risk
- Wait for statistical significance (100+ paper trades ideal)

**2. Don't Overtrade**
- Resist urge to increase position sizes
- More trades ≠ more profit
- Quality over quantity

**3. Don't Panic During Drawdowns**
- All strategies have losing periods
- Review if drawdown exceeds 25%, but don't react to 10-15% drawdowns

**4. Don't Constantly Tweak Parameters**
- Changing settings after every loss = destroying your edge
- Only adjust based on months of data

**5. Don't Ignore Risk Management**
- Never disable stop-losses
- Always respect maximum daily loss limits
- Position sizing is not optional

---

## Troubleshooting Quick Reference

**"Strategy not generating signals"**
→ See [Troubleshooting Guide: No Signals](#)

**"Backtest results look too good to be true"**
→ Likely overfitting. Retest with different parameters or longer timeframe.

**"Paper trading performance worse than backtest"**
→ Normal 10-20% variance. If >30% worse, review [Common Backtest Pitfalls](#).

**"Strategy paused automatically"**
→ Check if daily loss limit or max drawdown limit triggered. Review recent trades.

**"Can't connect exchange account"**
→ Verify API keys, check permissions, ensure IP whitelist configured.

---

## Next Steps

### Continue Learning

**Recommended reading:**
- [Backtesting Engine Guide](#) - Master performance analysis
- [Position Sizing Strategy](#) - Optimize risk per trade
- [Risk Management Dashboard](#) - Monitor portfolio health

**Join the Community:**
- Strategy discussion forums
- Weekly strategy webinars
- User success stories

### Expand Your Portfolio

Once comfortable with your first strategy:
- Clone and modify templates
- Test different assets (crypto, stocks, forex)
- Run multiple strategies simultaneously (with proper correlation management)
- Experiment with different timeframes

---

## Summary Checklist

**Setup Phase:**
- [ ] Account risk limits configured
- [ ] Paper trading activated
- [ ] Strategy selected and cloned

**Testing Phase:**
- [ ] Strategy parameters configured
- [ ] Backtest completed with passing results
- [ ] Backtest results reviewed and understood

**Deployment Phase:**
- [ ] Strategy deployed to paper trading
- [ ] Monitoring dashboard familiarized
- [ ] Notifications configured

**Validation Phase:**
- [ ] 2 weeks of paper trading completed
- [ ] Performance reviewed against checklist
- [ ] Decision made (continue paper / go live / adjust)

**Live Trading (Optional):**
- [ ] Exchange/broker connected
- [ ] Live trading with small capital initiated
- [ ] Live vs paper performance compared

---

## Support Resources

**Technical Help:**
- 📚 Knowledge Base: [help.platform.com](#)
- 💬 Live Chat: Available 24/7
- 📧 Email Support: support@platform.com

**Educational Resources:**
- 🎓 Video Tutorials: [tutorials.platform.com](#)
- 📊 Webinars: Weekly strategy sessions
- 👥 Community Forum: [community.platform.com](#)

**Emergency Issues:**
- Strategy not stopping: Contact support immediately
- Unexpected losses: Pause strategy, review logs, contact support
- API errors: Check system status page, verify credentials

---

## Congratulations!

You've completed your first automated strategy setup. Remember:
- **Patience is key** - Paper trade thoroughly before risking real money
- **Risk management** - Protects your capital during inevitable losing streaks
- **Continuous learning** - Markets change, strategies evolve, keep improving

**Most important:** This is a marathon, not a sprint. Traders who start conservatively and learn systematically have the highest long-term success rates.

---

*Last updated: December 2024 | Questions? Check our [FAQ](#) or contact support*
