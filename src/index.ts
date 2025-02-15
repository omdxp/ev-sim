import { Simulator } from "@/lib/simulator";
import { DetailedSimulationResults } from "@/types";

function analyzeChargerScenarios() {
  const basicResults: DetailedSimulationResults[] = [];
  const dstResults: DetailedSimulationResults[] = [];
  const seededResults: DetailedSimulationResults[] = [];

  // Run scenarios with different configurations
  for (let numChargers = 1; numChargers <= 30; numChargers++) {
    // Regular simulation
    const simBasic = new Simulator({ numChargers });
    simBasic.run();
    basicResults.push({
      ...simBasic.getResults(),
      maxPowerRatio:
        simBasic.getResults().actualMaxPower /
        simBasic.getResults().theoreticalMaxPower,
      energyPerCharger: simBasic.getResults().totalEnergyConsumed / numChargers,
    });

    // With DST
    const simDST = new Simulator({ numChargers, useDST: true });
    simDST.run();
    dstResults.push({
      ...simDST.getResults(),
      maxPowerRatio:
        simDST.getResults().actualMaxPower /
        simDST.getResults().theoreticalMaxPower,
      energyPerCharger: simDST.getResults().totalEnergyConsumed / numChargers,
    });

    // With seeded random
    const simSeeded = new Simulator({ numChargers, randomSeed: 42 });
    simSeeded.run();
    seededResults.push({
      ...simSeeded.getResults(),
      maxPowerRatio:
        simSeeded.getResults().actualMaxPower /
        simSeeded.getResults().theoreticalMaxPower,
      energyPerCharger:
        simSeeded.getResults().totalEnergyConsumed / numChargers,
    });
  }

  const formatTableData = (results: DetailedSimulationResults[]) =>
    results.map((r) => ({
      Chargers: r.numChargers,
      "Max Power (kW)": Math.round(r.actualMaxPower),
      "Theoretical (kW)": r.theoreticalMaxPower,
      "Concurrency (%)": (r.concurrencyFactor * 100).toFixed(1),
      "Energy/Charger (kWh)": Math.round(r.energyPerCharger),
      "Total Energy (MWh)": (r.totalEnergyConsumed / 1000).toFixed(1),
    }));

  // Display results by simulation type
  console.log("\nBasic Simulation Results (Random):");
  console.table(formatTableData(basicResults));
  analyzeResults("Basic Simulation", basicResults);

  console.log("\nDST-Adjusted Simulation Results:");
  console.table(formatTableData(dstResults));
  analyzeResults("DST Simulation", dstResults);

  console.log("\nSeeded Simulation Results (Deterministic):");
  console.table(formatTableData(seededResults));
  analyzeResults("Seeded Simulation", seededResults);

  // Compare configuration
  compareSimulations(basicResults, dstResults, seededResults);
}

function analyzeResults(title: string, results: DetailedSimulationResults[]) {
  const concurrencyTrend = results.reduce((acc, curr, idx, arr) => {
    if (idx == 0) return acc;
    const change = curr.concurrencyFactor - arr[idx - 1].concurrencyFactor;
    return acc + change / (arr.length - 1);
  }, 0);

  console.log(`\n${title} Analysis:`);
  console.log("-----------------");
  console.log(
    `Average Concurrency: ${(
      mean(results.map((r) => r.concurrencyFactor)) * 100
    ).toFixed(3)}% per additional charger`
  );
  console.log(
    `Concurrency Trend: ${(concurrencyTrend * 100).toFixed(
      3
    )}% per additional charger`
  );
  console.log(
    `Min Concurrency: ${(
      Math.min(...results.map((r) => r.concurrencyFactor)) * 100
    ).toFixed(1)}%`
  );
  console.log(
    `Max Concurrency: ${(
      Math.max(...results.map((r) => r.concurrencyFactor)) * 100
    ).toFixed(1)}%`
  );
}

function compareSimulations(
  basic: DetailedSimulationResults[],
  dst: DetailedSimulationResults[],
  seeded: DetailedSimulationResults[]
) {
  console.log("\nComparison of Simulation Types:");
  console.table({
    "Basic vs DST": {
      "Avg Concurrency Diff (%)": (
        mean(
          basic.map((r, i) => r.concurrencyFactor - dst[i].concurrencyFactor)
        ) * 100
      ).toFixed(1),
      "Avg Energy Diff (%)": (
        mean(
          basic.map(
            (r, i) =>
              (r.totalEnergyConsumed - dst[i].totalEnergyConsumed) /
              r.totalEnergyConsumed
          )
        ) * 100
      ).toFixed(1),
    },
    "Basic vs Seeded": {
      "Avg Concurrency Diff (%)": (
        mean(
          basic.map((r, i) => r.concurrencyFactor - seeded[i].concurrencyFactor)
        ) * 100
      ).toFixed(1),
      "Avg Energy Diff (%)": (
        mean(
          basic.map(
            (r, i) =>
              (r.totalEnergyConsumed - seeded[i].totalEnergyConsumed) /
              r.totalEnergyConsumed
          )
        ) * 100
      ).toFixed(1),
    },
  });
}

function mean(values: number[]): number {
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

analyzeChargerScenarios();
