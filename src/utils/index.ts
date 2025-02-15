/**
 * Generates a random number based on a seed for deterministic results
 */
export class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  /**
   * @returns A random number based on a seed
   */
  public random(): number {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }
}

/**
 * Returns adjusted tick based on DST
 * @param tick Current simulation tick
 * @param hourlyTicks Ticks in an hour
 * @returns Adjusted tick if DST is applied
 */
export const adjustForDST = (tick: number, hourlyTicks: number): number => {
  const dayOfYear = Math.floor(tick / (24 * hourlyTicks));

  // Simplified DST calculation (last Sunday in March to last Sunday in October)
  const isDST = dayOfYear >= 84 && dayOfYear < 301;

  return isDST ? tick + hourlyTicks : tick;
};
