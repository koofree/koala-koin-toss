# Coin Flip Game Rules

## Game Objective

The objective of the Coin Flip game is to correctly predict the outcome of a coin flip. Players bet on heads or tails and receive 2x their bet amount for correct predictions.

## How to Play

1. Set your bet amount (1-100 FCT) using the + and - buttons
2. Select either HEADS or TAILS as your prediction
3. Click the FLIP button to start the game
4. The coin will animate for 2 seconds showing the result
5. Winnings are automatically added to your balance if successful

## Game Mechanics

- Starting balance: 100 FCT
- Minimum bet: 1 FCT
- Maximum bet: Limited to current balance
- Payout ratio: 2:1 (win double your bet)
- Multiple coin mode:
  - Select 1-10 coins to flip simultaneously
  - Specify minimum heads count required (1-10)
  - Payout calculated based on probability:
    - 1 coin, heads: 2x (50% probability)
    - 5 coins, 3+ heads: 2.5x (50% probability)
    - 10 coins, 8+ heads: 8.6x (5.5% probability)

## UI Elements

- Coin display:
  - Single mode: One 120px yellow circle with "H" or "T" text
  - Multiple mode: Grid of 1-10 coins (60px each) in up to 2 rows
  - Heads: Gold with "H" marking
  - Tails: Silver with "T" marking
- Balance display: Top-right corner showing "Balance: X FCT"
- Bet controls:
  - "+" button: Increases bet by 1 FCT
  - "-" button: Decreases bet by 1 FCT
  - Input field: Direct entry of bet amount
- Side selection:
  - HEADS button: 150px width, blue when selected
  - TAILS button: 150px width, red when selected
  - Coin count selector: Dropdown with values 1-10
  - Minimum heads input: Numeric field (1-10)
- FLIP button: 200px width, green background
- History panel: Left side, displays last 10 results with:
  - Game ID number
  - Bet amount
  - Selected side
  - Result (win/loss)
  - Timestamp

## Game Features

- Animation settings:
  - Toggle on/off via settings menu
  - Speed options: Slow (3s), Normal (2s), Fast (1s)
  - Progress indicator: Circular timer around coin
- Auto-flip mode:
  - Starts continuous flipping at 3-second intervals
  - Stops when user clicks "Stop" button
  - Stops automatically if balance < bet amount
  - Maximum 100 consecutive flips
- Session statistics:
  - Win/loss ratio
  - Total amount won/lost
  - Longest win/loss streak
  - Updated in real-time after each flip

## Technical Specifications

- Random number generation: Cryptographically secure PRNG
- Animation framerate: 60fps
- Minimum balance to play: 1 FCT
- Maximum single bet: 100 FCT
- History storage: Last 10 games in local storage
- Betting lockout: No bets allowed during animation
