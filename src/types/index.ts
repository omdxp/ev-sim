/**
 * Represents the probability of an EV arriving during a specific hour
 */
export type ArrivalProbability = {
  startHour: number; // Hour of the day (0-23)
  probability: number; // Probability of arrival during this hour
};

/**
 * Represents the probability distribution of charging demands
 */
export type ChargingDemand = {
  kilometers: number; // Required range in kilometers
  probability: number; // Probability of this charging demand occuring
};

/**
 * Represents an active charging session at a charging point
 */
export type ChargingSession = {
  startTick: number; // Simulation tick when charging started
  durationTicks: number; // Number of ticks needed to complete charging
  powerDemand: number; // Power demand in kW
};

/**
 * Configuration options for the simulation
 */
export type SimulationConfig = {
  numChargers: number;
  useDST?: boolean;
  randomSeed?: number;
};

/**
 * Results from a single simulation run
 */
export type SimulationResults = {
  numChargers: number;
  totalEnergyConsumed: number;
  theoreticalMaxPower: number;
  actualMaxPower: number;
  concurrencyFactor: number;
  hourlyPowerDemand: number[]; // 24 values, one per hour
  hourlyChargingEvents: number[]; // 24 values, one per hour
  dailyChargingEvents: number[]; // 365 values, one per day
  monthlyChargingEvents: number[]; // 12 values, one per month
};

/**
 * Details results from a single simulation run
 */
export interface DetailedSimulationResults extends SimulationResults {
  maxPowerRatio: number;
  energyPerCharger: number;
}
