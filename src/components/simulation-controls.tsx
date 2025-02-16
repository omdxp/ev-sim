import type { SimulationConfig } from "@/types";
import { useCallback } from "react";

type Props = {
  config: SimulationConfig;
  onChange: (config: SimulationConfig) => void;
  onSimulate: () => void;
  isSimulating: boolean;
};

export default function SimulationControls({
  config,
  onChange,
  onSimulate,
  isSimulating,
}: Props) {
  const handleSliderChange = useCallback(
    (value: number, field: keyof SimulationConfig) => {
      onChange({ ...config, [field]: value });
    },
    [config, onChange]
  );

  return (
    <div className="space-y-6 p-6 bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-700">
      <div className="space-y-6">
        <div className="slider-group">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-300">
              Number of Charge Points
            </label>
            <span className="text-blue-400 font-medium">
              {config.numChargers}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="50"
            step="1"
            value={config.numChargers}
            onChange={(e) => handleSliderChange(+e.target.value, "numChargers")}
            className="slider-input"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1</span>
            <span>25</span>
            <span>50</span>
          </div>
        </div>

        <div className="slider-group">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-300">
              Arrival Rate Multiplier
            </label>
            <span className="text-blue-400 font-medium">
              {config.arrivalMultiplier}%
            </span>
          </div>
          <input
            type="range"
            min="20"
            max="200"
            step="10"
            value={config.arrivalMultiplier}
            onChange={(e) =>
              handleSliderChange(+e.target.value / 100, "arrivalMultiplier")
            }
            className="slider-input"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>20%</span>
            <span>100%</span>
            <span>200%</span>
          </div>
        </div>

        <div className="slider-group">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-300">
              Consumption Rate
            </label>
            <span className="text-blue-400 font-medium">
              {config.consumptionRate} kWh/100km
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="30"
            step="1"
            value={config.consumptionRate}
            onChange={(e) =>
              handleSliderChange(+e.target.value, "consumptionRate")
            }
            className="slider-input"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Efficient</span>
            <span>Average</span>
            <span>Heavy</span>
          </div>
        </div>

        <div className="slider-group">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-300">
              Charging Power
            </label>
            <span className="text-blue-400 font-medium">
              {config.chargingPower} kW
            </span>
          </div>
          <input
            type="range"
            min="3"
            max="22"
            step="1"
            value={config.chargingPower}
            onChange={(e) =>
              handleSliderChange(+e.target.value, "chargingPower")
            }
            className="slider-input"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Slow</span>
            <span>Standard</span>
            <span>Fast</span>
          </div>
        </div>

        {/* DST Toggle */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-300">
            Daylight Saving Time
          </label>
          <button
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
              config.useDST ? "bg-blue-600" : "bg-gray-600"
            }`}
            onClick={() => onChange({ ...config, useDST: !config.useDST })}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                config.useDST ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Random Seed Input */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-300">
              Random Seed
            </label>
            <button
              className="text-xs text-gray-400 hover:text-gray-300"
              onClick={() => onChange({ ...config, randomSeed: undefined })}
            >
              Clear
            </button>
          </div>
          <div className="flex gap-2">
            <input
              className="w-full bg-gray-700 border-gray-600 rounded-md text-sm text-gray-200 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
              type="number"
              value={config.randomSeed ?? ""}
              onChange={(e) => {
                const value =
                  e.target.value === "" ? undefined : +e.target.value;
                onChange({ ...config, randomSeed: value });
              }}
              placeholder="Random seed (optional)"
            />
          </div>
          <p className="text-xs text-gray-500">
            Set a seed for reproducible results
          </p>
        </div>
      </div>

      <button
        className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
          isSimulating
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20"
        } text-white`}
        onClick={onSimulate}
        disabled={isSimulating}
      >
        {isSimulating ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Simulating...
          </span>
        ) : (
          "Run Simulation"
        )}
      </button>
    </div>
  );
}
