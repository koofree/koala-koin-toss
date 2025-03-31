const simulate = (
  won: boolean,
  selectedSide: 'HEADS' | 'TAILS',
  coinCount: number,
  minHeads: number
): Array<'HEADS' | 'TAILS'> => {
  // Generate results for all coins
  const newResults = Array(coinCount)
    .fill(0)
    .map(() => (Math.random() < 0.5 ? 'HEADS' : 'TAILS'));

  // Count heads
  const headsCount = newResults.filter((result) => result === 'HEADS').length;

  // Win condition based on selected side and heads count
  const simulatedWon =
    selectedSide === 'HEADS' ? headsCount >= minHeads : headsCount <= coinCount - minHeads;

  if (simulatedWon == won) {
    return newResults;
  } else {
    // recurisvely retly to find out the result.
    return simulate(won, selectedSide, coinCount, minHeads);
  }
};

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
  // Generate an array with the correct number of HEADS and TAILS
  const resultArray: Array<'HEADS' | 'TAILS'> = simulate(won, selectedSide, coinCount, minHeads);

  return resultArray;
};
