"use client";

import { AnimatedNumber, Charts, SimulationControls } from "@/components";
import { getMockResults } from "@/lib/mockData";
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
    // Simulate a delay
    setTimeout(() => {
      try {
        setResults(getMockResults(config));
      } catch (err) {
        console.error("Simulation error:", err);
      } finally {
        setIsSimulating(false);
      }
    }, 1000);
  }, [config]);

  return (
    <div className="min-h-screen bg-gray-900">
      <main className="container mx-auto px-4 py-8 text-gray-100">
        <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          EV Charging Simulation
        </h1>

        {/* Main layout grid - 1 column on mobile, 3 columns on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Simulation controls - sticky on desktop */}
          <div className="md:sticky md:top-8 md:h-fit">
            <SimulationControls
              config={config}
              onChange={setConfig}
              onSimulate={handleSimulate}
              isSimulating={isSimulating}
            />
          </div>

          {/* Results section - spans 2 columns on desktop */}
          {results && (
            <div className="md:col-span-2 space-y-8 animate-fade-in-up">
              {/* Rest of the results section remains the same */}
              <div className="bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-700 backdrop-blur-sm">
                {/* Stats grid - 1 column on mobile, 2 on tablet and up */}
                <h2 className="text-xl font-semibold mb-4 text-gray-100">
                  Simulation Results
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  {/* Stats boxes */}
                  <div className="bg-gray-700/50 p-3 md:p-4 rounded-lg hover:bg-gray-700 transition-colors duration-300 animate-stagger-1">
                    <p className="text-xs md:text-sm text-gray-400">
                      Total Energy
                    </p>
                    <p className="text-xl md:text-2xl font-bold text-blue-400">
                      <AnimatedNumber
                        value={results.totalEnergyConsumed}
                        formatter={(v) =>
                          `${Math.round(v).toLocaleString()} kWh`
                        }
                      />
                    </p>
                  </div>
                  <div className="bg-gray-700/50 p-3 md:p-4 rounded-lg hover:bg-gray-700 transition-colors duration-300 animate-stagger-2">
                    <p className="text-xs md:text-sm text-gray-400">
                      Max Power
                    </p>
                    <p className="text-xl md:text-2xl font-bold text-blue-400">
                      <AnimatedNumber
                        value={results.actualMaxPower}
                        formatter={(v) =>
                          `${Math.round(v).toLocaleString()} kW`
                        }
                      />
                    </p>
                  </div>
                  <div className="bg-gray-700/50 p-3 md:p-4 rounded-lg hover:bg-gray-700 transition-colors duration-300 animate-stagger-3">
                    <p className="text-xs md:text-sm text-gray-400">
                      Theoretical Max
                    </p>
                    <p className="text-xl md:text-2xl font-bold text-blue-400">
                      <AnimatedNumber
                        value={results.theoreticalMaxPower}
                        formatter={(v) => `${Math.round(v)} kW`}
                      />
                    </p>
                  </div>
                  <div className="bg-gray-700/50 p-3 md:p-4 rounded-lg hover:bg-gray-700 transition-colors duration-300 animate-stagger-4">
                    <p className="text-xs md:text-sm text-gray-400">
                      Concurrency
                    </p>
                    <p className="text-xl md:text-2xl font-bold text-blue-400">
                      <AnimatedNumber
                        value={results.concurrencyFactor * 100}
                        formatter={(v) => `${v.toFixed(1)}%`}
                      />
                    </p>
                  </div>
                </div>
              </div>

              {/* Charts section */}
              <div className="bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-700 animate-slide-in overflow-x-auto">
                <h2 className="text-xl font-semibold mb-4 text-gray-100">
                  Daily Power Demand
                </h2>
                <div className="min-w-[300px]">
                  <Charts.DailyPowerChart
                    data={results.hourlyPowerDemand.map((power, hour) => ({
                      hour,
                      power,
                    }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8">
                <div className="bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-700 animate-stagger-1 overflow-x-auto">
                  <h2 className="text-xl font-semibold mb-4 text-gray-100">
                    Monthly Charging Events
                  </h2>
                  <div className="min-w-[300px]">
                    <Charts.TimeScaleChart
                      data={results.monthlyChargingEvents}
                      timeScale="monthly"
                      title="Charging Events per Month"
                    />
                  </div>
                </div>

                <div className="bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-700 animate-stagger-2 overflow-x-auto">
                  <h2 className="text-xl font-semibold mb-4 text-gray-100">
                    Daily Charging Events
                  </h2>
                  <div className="text-sm text-gray-400 mb-2">
                    Total Events:{" "}
                    {results.dailyChargingEvents.reduce((a, b) => a + b, 0)}
                  </div>
                  <div className="min-w-[300px]">
                    <Charts.TimeScaleChart
                      data={results.dailyChargingEvents}
                      timeScale="daily"
                      title="Charging Events per Day"
                    />
                  </div>
                </div>

                <div className="bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-700 animate-stagger-3 overflow-x-auto">
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
                  <div className="min-w-[300px]">
                    <Charts.TimeScaleChart
                      data={results.hourlyChargingEvents}
                      timeScale="hourly"
                      title="Events by Hour of Day"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
