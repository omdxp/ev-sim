import { ArrivalProbability, ChargingDemand } from "@/types";

// Simulation configuration constants
export const CHARGER_POWER = 11; // kW
export const NUM_CHARGERS = 20; // Fixed number of chargers as per requirements
export const TICKS_PER_HOUR = 4; // 15 minutes interval
export const HOURS_PER_DAY = 24;
export const DAYS_PER_YEAR = 365; // No leap year
export const TOTAL_TICKS = DAYS_PER_YEAR * HOURS_PER_DAY * TICKS_PER_HOUR;
export const KWH_PER_100KM = 18; // Energy consumption rate for standard EVs

/**
 * Hourly arrival probabilites based on table T1
 */
export const ARRIVAL_PROBABILITIES: ArrivalProbability[] = [
  { startHour: 0, probability: 0.0094 },
  { startHour: 1, probability: 0.0094 },
  { startHour: 2, probability: 0.0094 },
  { startHour: 3, probability: 0.0094 },
  { startHour: 4, probability: 0.0094 },
  { startHour: 5, probability: 0.0094 },
  { startHour: 6, probability: 0.0094 },
  { startHour: 7, probability: 0.0094 },
  { startHour: 8, probability: 0.0283 },
  { startHour: 9, probability: 0.0283 },
  { startHour: 10, probability: 0.0566 },
  { startHour: 11, probability: 0.0566 },
  { startHour: 12, probability: 0.0566 },
  { startHour: 13, probability: 0.0755 },
  { startHour: 14, probability: 0.0755 },
  { startHour: 15, probability: 0.0755 },
  { startHour: 16, probability: 0.1038 },
  { startHour: 17, probability: 0.1038 },
  { startHour: 18, probability: 0.1038 },
  { startHour: 19, probability: 0.0472 },
  { startHour: 20, probability: 0.0472 },
  { startHour: 21, probability: 0.0472 },
  { startHour: 22, probability: 0.0094 },
  { startHour: 23, probability: 0.0094 },
] as const;

/**
 * Charging demand distribution based on table T2
 */
export const CHARGING_DEMANDS: ChargingDemand[] = [
  { kilometers: 0, probability: 0.3431 },
  { kilometers: 5, probability: 0.049 },
  { kilometers: 10, probability: 0.098 },
  { kilometers: 20, probability: 0.1176 },
  { kilometers: 30, probability: 0.0882 },
  { kilometers: 50, probability: 0.1176 },
  { kilometers: 100, probability: 0.1078 },
  { kilometers: 200, probability: 0.049 },
  { kilometers: 300, probability: 0.0294 },
] as const;
