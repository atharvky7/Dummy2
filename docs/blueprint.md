# **App Name**: TwinSight

## Core Features:

- Real-time Data Visualization: Display real-time sensor data on a map, including metrics like temperature, pressure, and flow rate. The map utilizes Leaflet.js to render various interactive layers.
- Historical Data Replay: Replay historical sensor data over a 24-hour period using a timeline slider.
- Scenario Analysis: Allow users to toggle a 'Green Scenario Mode' to simulate the impact of sustainability initiatives such as retrofitting or carbon offsetting projects.
- Predictive Maintenance: Use a tool, powered by generative AI, that identifies potential equipment failures based on historical trends and anomaly detection.
- 3D Site Model Integration: Display a 3D model of the infrastructure, with interactive elements representing different sensors.
- Alerting System: Trigger alerts when sensor readings exceed predefined thresholds.
- Database Integration: Store and retrieve data from a PostgreSQL database hosted on Google Cloud SQL. Include tables for sensor readings, equipment metadata, and user preferences.

## Style Guidelines:

- Primary color: Emerald green (#34D399) to evoke sustainability and freshness.
- Background color: Light grey (#F9FAFA) to provide a clean, neutral backdrop.
- Accent color: Teal (#2DD4BF) for interactive elements and highlights.
- Body and headline font: 'Inter' for a modern, neutral, and readable style (sans-serif).
- Use crisp, minimalist icons from a set like Phosphor or Remix Icon.
- Maintain a clean, card-based layout with clear visual hierarchy.  Ensure the panels on the right don't overlap content in the map or 3D model view.
- Use subtle animations, such as marker scaling or data transitions, to enhance interactivity and provide feedback.