import { SimulationConfig, SimulationResults } from "@/types";

const calculateBaselineEnergy = (config: SimulationConfig): number => {
  const multiplier = Math.max(0, (config.arrivalMultiplier ?? 100) / 100);
  const baseEnergy =
    config.numChargers * config.chargingPower! * 24 * 365 * 0.3;
  return baseEnergy * multiplier;
};

const calculateMaxPower = (config: SimulationConfig): number => {
  const multiplier = Math.max(0, (config.arrivalMultiplier ?? 100) / 100);
  const baseMaxPower = config.numChargers * config.chargingPower!;
  const utilizationFactor = 0.6 + multiplier * 0.3;
  return baseMaxPower * utilizationFactor;
};

export const getMockResults = (config: SimulationConfig): SimulationResults => {
  // Ensure valid config values
  const safeConfig: SimulationConfig = {
    ...config,
    numChargers: Math.max(1, config.numChargers),
    arrivalMultiplier: Math.max(0, config.arrivalMultiplier ?? 100),
    chargingPower: Math.max(0.1, config.chargingPower!),
    consumptionRate: Math.max(0.1, config.consumptionRate!),
  };

  const totalEnergy = calculateBaselineEnergy(safeConfig);
  const actualMaxPower = calculateMaxPower(safeConfig);
  const theoreticalMaxPower =
    safeConfig.numChargers * safeConfig.chargingPower!;
  const concurrencyFactor = actualMaxPower / theoreticalMaxPower;

  // Generate hourly demand pattern
  const hourlyPowerDemand = Array(24)
    .fill(0)
    .map((_, i) => {
      const morningPeak = Math.exp(-Math.pow((i - 8) / 2, 2)); // Peak at 8AM
      const eveningPeak = Math.exp(-Math.pow((i - 18) / 3, 2)); // Peak at 6PM
      const baseLoad = actualMaxPower * 0.2;
      const peakLoad = actualMaxPower * 0.9;
      const demandFactor = (morningPeak + eveningPeak) / 2;
      return baseLoad + (peakLoad - baseLoad) * demandFactor;
    });

  // Generate monthly events with seasonal variation
  const monthlyChargingEvents = Array(12)
    .fill(0)
    .map((_, i) => {
      const seasonalFactor = 1 + 0.3 * Math.sin(((i - 3) * Math.PI) / 6);
      const baseEvents =
        (30 * safeConfig.numChargers * safeConfig.arrivalMultiplier!) / 100;
      return Math.floor(
        baseEvents * seasonalFactor * (0.9 + Math.random() * 0.2)
      );
    });

  // Generate daily events with weekday/weekend pattern
  const dailyChargingEvents = Array(7)
    .fill(0)
    .map((_, i) => {
      const weekdayFactor = i < 5 ? 1 : 0.7;
      const baseEvents =
        (safeConfig.numChargers * safeConfig.arrivalMultiplier!) / 100;
      return Math.max(
        1,
        Math.floor(baseEvents * weekdayFactor * (0.9 + Math.random() * 0.2))
      );
    });

  // Generate hourly events with realistic distribution
  const hourlyChargingEvents = Array(24)
    .fill(0)
    .map((_, i) => {
      const morningPeak = Math.exp(-Math.pow((i - 8) / 2, 2));
      const eveningPeak = Math.exp(-Math.pow((i - 18) / 3, 2));
      const middayFactor = Math.exp(-Math.pow((i - 13) / 4, 2));
      const distribution = morningPeak + eveningPeak + middayFactor * 0.5;
      const baseEvents =
        (safeConfig.numChargers * safeConfig.arrivalMultiplier!) / 1200;
      return Math.max(
        0,
        Math.floor(baseEvents * distribution * (0.9 + Math.random() * 0.2))
      );
    });

  return {
    numChargers: config.numChargers,
    totalEnergyConsumed: Math.round(totalEnergy),
    actualMaxPower: Math.round(actualMaxPower),
    theoreticalMaxPower: Math.round(theoreticalMaxPower),
    concurrencyFactor: Math.min(1, Math.max(0, concurrencyFactor)),
    hourlyPowerDemand,
    monthlyChargingEvents,
    dailyChargingEvents,
    hourlyChargingEvents,
  };
};
