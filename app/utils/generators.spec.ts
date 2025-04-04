import { describe, expect, it } from 'vitest';
import { generateResult } from './generators';

describe('generateResult', () => {
  it('should generate correct results when player wins with HEADS', () => {
    const params = {
      won: true,
      selectedSide: 'HEADS' as const,
      coinCount: 10,
      minHeads: 7,
    };

    const result = generateResult(params);

    expect(result).toHaveLength(params.coinCount);
    const headsCount = result.filter((r) => r === 'HEADS').length;
    expect(headsCount).toBeGreaterThanOrEqual(params.minHeads);
  });

  it('should generate correct results when player wins with TAILS', () => {
    const params = {
      won: true,
      selectedSide: 'TAILS' as const,
      coinCount: 10,
      minHeads: 7,
    };

    const result = generateResult(params);

    expect(result).toHaveLength(params.coinCount);
    const headsCount = result.filter((r) => r === 'HEADS').length;
    expect(headsCount).toBeLessThanOrEqual(params.coinCount - params.minHeads);
  });

  it('should generate correct results when player loses with HEADS', () => {
    const params = {
      won: false,
      selectedSide: 'HEADS' as const,
      coinCount: 10,
      minHeads: 7,
    };

    const result = generateResult(params);

    expect(result).toHaveLength(params.coinCount);
    const headsCount = result.filter((r) => r === 'HEADS').length;
    expect(headsCount).toBeLessThan(params.minHeads);
  });

  it('should generate correct results when player loses with TAILS', () => {
    const params = {
      won: false,
      selectedSide: 'TAILS' as const,
      coinCount: 10,
      minHeads: 7,
    };

    const result = generateResult(params);

    expect(result).toHaveLength(params.coinCount);
    const headsCount = result.filter((r) => r === 'HEADS').length;
    expect(headsCount).toBeGreaterThan(params.coinCount - params.minHeads);
  });
});
