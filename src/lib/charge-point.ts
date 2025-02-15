import { CHARGER_POWER } from "@/data";
import { ChargingSession } from "@/types";

/**
 * Represents a single EV charging point that can handle one vehicle at a time
 */
export class ChargePoint {
  private currentSession: ChargingSession | null = null;

  /**
   * Checks if the charging point is available for a new session
   * @param currentTick Current simulation tick
   * @returns true if the charging point can accept a new session
   */
  public isAvailable(currentTick: number): boolean {
    if (!this.currentSession) return true;
    return (
      currentTick >=
      this.currentSession.startTick + this.currentSession.durationTicks
    );
  }
  /**
   * Starts a new charging session
   * @param session The charging session to start
   */
  public startCharging(session: ChargingSession): void {
    this.currentSession = session;
  }

  /**
   * Gets the current power demand at a specific tick
   * @param currentTick Current simulation tick
   * @returns Power demand in kW (either 0 or CHARGER_POWER)
   */
  public getPowerDemand(currentTick: number): number {
    if (!this.currentSession || !this.isCharging(currentTick)) return 0;
    return CHARGER_POWER;
  }

  /**
   * Checks if there is an active charging session at the given tick
   * @param currentTick Current simulation tick
   * @returns true if charging is in progress
   */
  private isCharging(currentTick: number): boolean {
    if (!this.currentSession) return false;
    return (
      currentTick >= this.currentSession.startTick &&
      currentTick <
        this.currentSession.startTick + this.currentSession.durationTicks
    );
  }
}
