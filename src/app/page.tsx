"use client";

import { AnimatedNumber, Charts, SimulationControls } from "@/components";
import { Simulator } from "@/lib/simulator";
import { SimulationConfig, SimulationResults } from "@/types";
import { useCallback, useState } from "react";

const defaultConfig: SimulationConfig = {
  numChargers: 20,
  useDST: false,
  randomSeed: undefined,
  arrivalMultiplier: 100,
  consumptionRate: 18,
  chargingPower: 11,
};

export default function Home() {
  const [config, setConfig] = useState(defaultConfig);
  const [results, setResults] = useState<SimulationResults | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulate = useCallback(() => {
    setIsSimulating(true);
    try {
      const simulator = new Simulator({
        ...config,
        arrivalMultiplier: config.arrivalMultiplier! / 100,
      });
      simulator.run();
      setResults(simulator.getResults());
    } catch (err) {
      console.error("Simulation error:", err);
    } finally {
      setIsSimulating(false);
    }
  }, [config]);

  return (
    <div className="min-h-screen bg-gray-900">
      <main className="container mx-auto px-4 py-8 text-gray-100">
        <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          EV Charging Simulation
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Simulation configuration */}
          <div className="hidden md:block md:sticky top-8 h-fit">
            <SimulationControls
              config={config}
              onChange={setConfig}
              onSimulate={handleSimulate}
              isSimulating={isSimulating}
            />
          </div>

          {/* Results section */}
          {results && (
            <div className="md:col-span-2 space-y-8 animate-fade-in-up">
              <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-700 backdrop-blur-sm">
                <h2 className="text-xl font-semibold mb-4 text-gray-100">
                  Simulation Results
                </h2>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gray-700/50 p-4 rounded-lg hover:bg-gray-700 transition-colors duration-300 animate-stagger-1">
                    <p className="text-sm text-gray-400">Total Energy</p>
                    <p className="text-2xl font-bold text-blue-400">
                      <AnimatedNumber
                        value={results.totalEnergyConsumed}
                        formatter={(v) =>
                          `${Math.round(v).toLocaleString()} kWh`
                        }
                      />
                    </p>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg hover:bg-gray-700 transition-colors duration-300 animate-stagger-2">
                    <p className="text-sm text-gray-400">Max Power</p>
                    <p className="text-2xl font-bold text-blue-400">
                      <AnimatedNumber
                        value={results.actualMaxPower}
                        formatter={(v) =>
                          `${Math.round(v).toLocaleString()} kW`
                        }
                      />
                    </p>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg hover:bg-gray-700 transition-colors duration-300 animate-stagger-3">
                    <p className="text-sm text-gray-400">Theoretical Max</p>
                    <p className="text-2xl font-bold text-blue-400">
                      <AnimatedNumber
                        value={results.theoreticalMaxPower}
                        formatter={(v) => `${Math.round(v)} kW`}
                      />
                    </p>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg hover:bg-gray-700 transition-colors duration-300 animate-stagger-4">
                    <p className="text-sm text-gray-400">Concurrency</p>
                    <p className="text-2xl font-bold text-blue-400">
                      <AnimatedNumber
                        value={results.concurrencyFactor * 100}
                        formatter={(v) => `${v.toFixed(1)}%`}
                      />
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-700 animate-slide-in">
                <h2 className="text-xl font-semibold mb-4 text-gray-100">
                  Daily Power Demand
                </h2>
                <Charts.DailyPowerChart
                  data={results.hourlyPowerDemand.map((power, hour) => ({
                    hour,
                    power,
                  }))}
                />
              </div>

              <div className="grid grid-cols-1 gap-8">
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-700 animate-stagger-1">
                  <h2 className="text-xl font-semibold mb-4 text-gray-100">
                    Monthly Charging Events
                  </h2>
                  <Charts.TimeScaleChart
                    data={results.monthlyChargingEvents}
                    timeScale="monthly"
                    title="Charging Events per Month"
                  />
                </div>

                <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-700 animate-stagger-2">
                  <h2 className="text-xl font-semibold mb-4 text-gray-100">
                    Daily Charging Events
                  </h2>
                  <div className="text-sm text-gray-400 mb-2">
                    Total Events:{" "}
                    {results.dailyChargingEvents.reduce((a, b) => a + b, 0)}
                  </div>
                  <Charts.TimeScaleChart
                    data={results.dailyChargingEvents}
                    timeScale="daily"
                    title="Charging Events per Day"
                  />
                </div>

                <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-700 animate-stagger-3">
                  <h2 className="text-xl font-semibold mb-4 text-gray-100">
                    Hourly Distribution
                  </h2>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-400">
                        Average Events per Day
                      </p>
                      <p className="text-2xl font-bold text-blue-400">
                        <AnimatedNumber
                          value={
                            results.hourlyChargingEvents.reduce(
                              (a, b) => a + b,
                              0
                            ) / 365
                          }
                          formatter={(v) => v.toFixed(1)}
                        />
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Peak Hour</p>
                      <p className="text-2xl font-bold text-blue-400">
                        <AnimatedNumber
                          value={results.hourlyChargingEvents.indexOf(
                            Math.max(...results.hourlyChargingEvents)
                          )}
                          formatter={(v) => `${Math.round(v)}:00`}
                        />
                      </p>
                    </div>
                  </div>
                  <Charts.TimeScaleChart
                    data={results.hourlyChargingEvents}
                    timeScale="hourly"
                    title="Events by Hour of Day"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
