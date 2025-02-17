# EV Charging Point Simulator

This project consists of two parts:
1. A simulation script for EV charging patterns
2. An interactive web application to visualize and configure the simulation

## Problem Overview

The simulator models EV charging behavior based on:
- Hourly arrival probabilities from real-world data
- Different charging demands (range requirements)
- Variable number of charging points and power levels
- Concurrency patterns throughout the day

## Development Modes

This project supports two development modes:

### Full Simulation Mode (main branch)
The complete simulation with all calculations and real-world modeling.

```bash
git checkout main
npm install
npm run dev
```

### Quick Preview Mode (mockups branch)
Uses pre-calculated mockup data for faster development and UI testing:

```bash
git checkout mockups
npm install
npm run dev
```

## Script Solution

The script calculates:
- Maximum power demand
- Energy consumption
- Concurrency factors
- Charging event distributions

### Running the Script

```bash
# Install dependencies
npm install

# Run the simulation script
npm run simulate
```

## Web Application

Interactive visualization with features:
- Real-time simulation configuration
- Multiple charger type support (11kW, 22kW, 50kW)
- Dynamic charts and statistics
- Concurrency analysis per charger type

### Running the Web App

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Visit `http://localhost:3000` to access the application.

## Features

- 📊 Interactive charts
- 🔄 Real-time updates
- 📱 Responsive design
- 🎛️ Multiple charger configurations
- 📈 Detailed statistics
- 🌙 Dark mode optimized

## Tech Stack

- TypeScript
- Next.js
- TailwindCSS
- Recharts
- Node.js

## Configuration

The simulation can be configured with:
- Number and type of charging points
- Arrival rate multiplier (20% - 200%)
- Consumption rate (10 - 30 kWh/100km)
- Different charging powers (3kW - 22kW)

## Results Analysis

The application provides:
- Total energy consumption
- Maximum power demand
- Concurrency factors
- Hourly, daily, and monthly patterns
- Per-charger type statistics

## Local Development

```bash
# Install dependencies
npm install

# Start development
npm run dev
