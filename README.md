# Lab-2: React + Leaflet Map Project

This project is a simple interactive map built with React and Leaflet.  
Users can add markers, enter notes, view a list, and reset the map.

## Setup

1. Clone the repo:
git clone https://github.com/emi343rc/Lab-2.git
cd Lab-2

2. Install dependencies:
npm install


3. Start the development server:
npm run dev


4. Open `http://localhost:5173` in your browser.

## How to Use

- Click **Collect** and then click on the map to add locations.
- Enter a name and optional notes.
- Click **Done** to stop adding markers.
- Click **Reset** to clear all markers.

## Challenges Solved

- Leaflet CSS loading issues (fixed via CDN and container height adjustments)
- Infinite map panning (fixed with `maxBounds` and `maxBoundsViscosity`)
- Marker icons with Vite (fixed using `import.meta.url`)