export const generateResult = ({
  won,
  selectedSide,
  coinCount,
  minHeads,
}: {
  won: boolean;
  selectedSide: 'HEADS' | 'TAILS';
  coinCount: number;
  minHeads: number;
}) => {
  // Validate input parameters
  if (coinCount <= 0) {
    throw new Error('coinCount must be greater than 0');
  }

  if (coinCount > 10) {
    throw new Error('coinCount must be less than or equal to 10');
  }

  if (minHeads < 0) {
    throw new Error('minHeads must be greater than or equal to 0');
  }

  if (minHeads > coinCount) {
    throw new Error('minHeads must be less than or equal to coinCount');
  }

  // Use a loop instead of recursion to avoid stack overflow
  while (true) {
    // Generate results for all coins
    const newResults = Array(coinCount)
      .fill(0)
      .map(() => (Math.random() < 0.5 ? 'HEADS' : 'TAILS'));

    // Count heads
    const headsCount = newResults.filter((result) => result === 'HEADS').length;

    // Win condition based on selected side and heads count
    const simulatedWon =
      selectedSide === 'HEADS' ? headsCount >= minHeads : headsCount <= coinCount - minHeads;

    // If we got the desired outcome, return the results
    if (simulatedWon === won) {
      return newResults;
    }
    // Otherwise, the loop will continue and try again
  }
};
