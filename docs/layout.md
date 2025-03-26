# Layout Documentation

## Theme

- Primary Background: #0C0C0C
- Secondary Background: Linear gradient from #0C0C0C to #320076
- Accent Colors:
  - Primary Purple: #B138E8
  - Secondary Purple: #7620A8

## Layout Structure

### Root Layout

- Full viewport height and width
- Support for both Light and Dark themes
- Animated gradient background with subtle floating elements
- Font: `Press Start 2P` for retro gaming aesthetic

### Page Layout

![entire_screen_1.png](entire_screen_1.png)
![entire_screen_2.png](entire_screen_2.png)

1. Header & Footer

   - No header or footer present as this page will be embedded within another service

2. Main Content Area

   - Padding: 2rem (32px)
   - Fixed dimensions: 1200px width × 800px height
   - Horizontally centered in viewport
   - Sections separated by 2rem gap

3. Game Layout
   - Block-style arrangement
   - Game Board (Coin Flipping Area)
     - Borderless design
     - Transparent background
     - Positioned at top third of layout
     - Spans full width
   - Controls Section
     - 2D pixel-art style dotted background and border
     - Positioned at bottom two-thirds of layout
     - Occupies middle two-thirds of width
   - Side Padding Areas
     - Left and right padding each occupy 1/6 of total width
     - Animated character displays in these areas

### Control Section Layout

![control_panel.png](control_panel.png)

    - First Row
        - AUTOBET: Checkbox options for setting automatic win conditions
        - COINAMOUNT: Slider from 0.0x to 1.0x to adjust betting proportion
        - WAGER: Betting amount input with 0.5x and 2x quick adjustment buttons
    - Second Row
        - PRESETS: Quick selection options (1:1 (x1.96), 1:10 (x983.04), etc.)
        - MIN HEADS/TAILS: Minimum required heads or tails count for winning
        - POTENTIAL WIN: Calculated potential earnings display based on current settings

## Responsive Design

- Fixed layout with no responsive adaptations

## Component Spacing

- Small gap: 0.5rem (8px)
- Medium gap: 1rem (16px)
- Large gap: 2rem (32px)

## Animations

- Smooth transitions: 0.2s ease-in-out
- Interactive button hover effects
- Coin flip animation featuring distinct front and back images
- Results reveal animation sequence

## Z-Index Hierarchy

1. Base content: 0
2. Game controls: 1
3. Modal overlays: 100
4. Notifications: 1000

## Accessibility Features

- Minimum contrast ratio of 4.5:1 for readability
- Visible focus indicators for navigation
- ARIA labels on all interactive elements
- Complete keyboard navigation support
