import { Simulator } from "@/lib/simulator";
import { DetailedSimulationResults } from "@/types";

const numChargers = 20;
const sim = new Simulator({ numChargers });
sim.run();
const results: DetailedSimulationResults = {
  ...sim.getResults(),
  maxPowerRatio:
    sim.getResults().actualMaxPower / sim.getResults().theoreticalMaxPower,
  energyPerCharger: sim.getResults().totalEnergyConsumed / numChargers,
};
const formatTableData = (r: DetailedSimulationResults) => {
  return {
    "Max Power (kW)": Math.round(r.actualMaxPower),
    "Theoretical (kW)": r.theoreticalMaxPower,
    "Concurrency (%)": (r.concurrencyFactor * 100).toFixed(1),
    "Energy/Charger (kWh)": Math.round(r.energyPerCharger),
    "Total Energy (MWh)": (r.totalEnergyConsumed / 1000).toFixed(1),
  };
};
console.log("Simulation Results (Random):");
console.table(formatTableData(results));
