import { ChargingDemand, SimulationConfig, SimulationResults } from "@/types";
import { ChargePoint } from "./charge-point";
import {
  ARRIVAL_PROBABILITIES,
  CHARGER_POWER,
  CHARGING_DEMANDS,
  HOURS_PER_DAY,
  KWH_PER_100KM,
  NUM_CHARGERS,
  TICKS_PER_HOUR,
  TOTAL_TICKS,
} from "@/data";

/**
 * Simulates a network of EV charging points over a one-year period
 */
export class Simulator {
  private chargePoints: ChargePoint[];
  private totalEnergyConsumed: number = 0;
  private maxPowerDemand: number = 0;

  constructor(private readonly config: SimulationConfig) {
    this.chargePoints = Array(config.numChargers)
      .fill(null)
      .map(() => new ChargePoint());
  }

  /**
   * Runs the simulation for one year in 15 minute intervals
   */
  public run(): void {
    for (let tick = 0; tick < TOTAL_TICKS; tick++) {
      this.simulateTick(tick);
    }
  }
  /**
   * Simulates a single 15 minute interval
   * @param tick Current simulation tick
   */
  private simulateTick(tick: number): void {
    const hour = Math.floor(
      (tick % (HOURS_PER_DAY * TICKS_PER_HOUR)) / TICKS_PER_HOUR
    );

    // Calculate base arrival probability for this 15 minute interval
    const baseArrivalProp = ARRIVAL_PROBABILITIES[hour].probability;

    // Calculate number of potential arrivals during this tick
    const availableChargers = this.chargePoints.filter((cp) =>
      cp.isAvailable(tick)
    ).length;
    if (availableChargers === 0) return;

    // Try to create arrivals based on time of day
    const numArrivals = Math.floor(baseArrivalProp * availableChargers);
    const extraArrivalProb = baseArrivalProp * availableChargers - numArrivals;

    // Handle determined arrivals
    for (let i = 0; i < numArrivals; i++) {
      const availableChargePoint = this.chargePoints.find((cp) =>
        cp.isAvailable(tick)
      );
      if (availableChargePoint) {
        this.handleNewArrival(tick, availableChargePoint);
      }
    }

    // Handle potential extra arrival
    if (this.getRandom() < extraArrivalProb) {
      const availableChargePoint = this.chargePoints.find((cp) =>
        cp.isAvailable(tick)
      );
      if (availableChargePoint) {
        this.handleNewArrival(tick, availableChargePoint);
      }
    }

    // Track power demand
    const currentPowerDemand = this.calculateTotalPowerDemand(tick);

    // Update power demand statistics
    this.maxPowerDemand = Math.max(this.maxPowerDemand, currentPowerDemand);
    this.totalEnergyConsumed += currentPowerDemand * (1 / TICKS_PER_HOUR);
  }

  /**
   * Handles a new EV arrival by finding an available chager and starting a session
   * @param tick Current simulation tick
   * @param chargePoint The charge point to handle the EV
   */
  private handleNewArrival(tick: number, chargePoint: ChargePoint): void {
    const chargingDemand = this.selectRandomChargingDemand();
    if (chargingDemand.kilometers === 0) return;

    const consumtionRate = KWH_PER_100KM;
    const chargingPower = CHARGER_POWER;

    const energyNeeded = (chargingDemand.kilometers / 100) * consumtionRate;
    const durationTicks = Math.ceil(
      (energyNeeded / chargingPower) * TICKS_PER_HOUR
    );

    chargePoint.startCharging({
      startTick: tick,
      durationTicks,
      powerDemand: chargingPower,
    });
  }

  /**
   * Calculates the total power demand across all charging points
   * @param tick Current simulation tick
   * @returns The total power demand
   */
  private calculateTotalPowerDemand(tick: number): number {
    return this.chargePoints.reduce(
      (sum, cp) => sum + cp.getPowerDemand(tick),
      0
    );
  }

  /**
   * Selects a random charging demand based on the probability distribution
   * @returns A random charging demand based on probability of distribution, otherwise a charging demand for 0 kilometers
   */
  private selectRandomChargingDemand(): ChargingDemand {
    const rand = this.getRandom();
    let cumulative = 0;
    for (const demand of CHARGING_DEMANDS) {
      cumulative += demand.probability;
      if (rand < cumulative) {
        return demand;
      }
    }
    return CHARGING_DEMANDS[0];
  }

  /**
   * @returns The simulation results
   */
  public getResults(): SimulationResults {
    const theoreticalMaxPower = NUM_CHARGERS * CHARGER_POWER;
    return {
      numChargers: this.config.numChargers,
      totalEnergyConsumed: this.totalEnergyConsumed,
      theoreticalMaxPower,
      actualMaxPower: this.maxPowerDemand,
      concurrencyFactor: this.maxPowerDemand / theoreticalMaxPower,
    };
  }

  /**
   * Returns a random number between 0 and 1
   */
  private getRandom(): number {
    return Math.random();
  }
}
