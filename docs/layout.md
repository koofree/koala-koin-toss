# Coin Flip Game Layout

## Layout Structure

### Main Sections

- **Left Section**: Game history panel (20% of screen width)
- **Center Section**: Main game area (60% of screen width)
- **Right Section**: Statistics and settings panel (20% of screen width)

### Game History Panel (Left)

- Fixed width: 20% of screen
- Dark background for contrast
- Displays last 10 game results with:
  - Game ID
  - Bet amount
  - Selected side
  - Result (win/loss)
  - Timestamp
- Color-coded results (green for wins, red for losses)

### Main Game Area (Center)

#### Top Area

- Balance display (top-right)
- Session statistics summary (top-left)

#### Center Area

- Coin Display Modes:
  - Single Mode: 120px centered coin
  - Multiple Mode: Grid layout for 1-10 coins (60px each)
  - Coin Styling:
    - Heads: Gold with "H" marking
    - Tails: Silver with "T" marking
  - Animation progress indicator (circular timer)

#### Bottom Area (Controls)

1. Betting Controls Row

   - "-" button
   - Bet amount input field (1-100 FCT)
   - "+" button
   - Current bet display

2. Game Mode Controls Row

   - Coin count selector dropdown (1-10)
   - Minimum heads input field (for multiple mode)

3. Side Selection Row

   - HEADS button (150px width, blue when selected)
   - TAILS button (150px width, red when selected)

4. Action Buttons Row
   - FLIP button (200px width, green)
   - Auto-flip toggle button
   - Stop button (visible during auto-flip)

### Statistics & Settings Panel (Right)

#### Session Statistics Section

- Win/loss ratio
- Total amount won/lost
- Longest win/loss streak
- Real-time updates

#### Settings Section

- Animation controls:
  - Toggle on/off
  - Speed selection (Slow/Normal/Fast)
- Auto-flip settings
- Sound toggle

## Visual Design Specifications

### Colors

- Background: Dark theme (#282c34)
- Heads coin: Gold (#FFD700)
- Tails coin: Silver (#C0C0C0)
- Win indicator: Green (#4CAF50)
- Loss indicator: Red (#F44336)
- Button states:
  - Default: #3498db
  - Hover: #2980b9
  - Active: #1f6dad
  - Disabled: #95a5a6

### Spacing and Dimensions

- Standard padding: 20px
- Button heights: 40px
- Input field heights: 36px
- Gaps between controls: 16px
- Border radius: 8px

### Responsive Behavior

- Minimum width: 1024px
- Maximum width: 1920px
- Breakpoints:
  - Mobile: Hide statistics panel
  - Tablet: Condensed controls layout
  - Desktop: Full layout

### Animation Specifications

- Coin flip animation: 60fps
- Duration options:
  - Slow: 3s
  - Normal: 2s
  - Fast: 1s
- Progress indicator animation: Smooth circular rotation

### Typography

- Primary font: System default sans-serif
- Game statistics: Monospace for numbers
- Button text: Bold, 16px
- Balance display: Bold, 24px
- History text: 14px

## Technical Constraints

- Betting controls locked during animation
- Auto-flip mode maximum: 100 consecutive flips
- Local storage for game history
- Minimum balance check: 1 FCT
- Maximum single bet: 100 FCT or current balance
