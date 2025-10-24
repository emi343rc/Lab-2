import { useState } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvent
} from 'react-leaflet'
import L from 'leaflet'
import './App.css'

/**
 * Fix for marker icon paths when using Vite (works with ES module bundlers).
 * We use import.meta.url to build the file URLs for Leaflet's images.
 */
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href
})

/**
 * ClickHandler: listens for clicks on the map and prompts the user for info.
 * It uses useMapEvent from react-leaflet and calls onAddLocation when a place
 * should be added.
 */
function ClickHandler({ collecting, onAddLocation }) {
  useMapEvent('click', (e) => {
    if (!collecting) return

    const { lat, lng } = e.latlng

    // Prompt the user. If they cancel the first prompt, we treat as cancelled.
    const title = window.prompt('Name for this place? (e.g., "Home", "Vacation spot")', '')
    if (title === null) return // user cancelled entirely

    const notes = window.prompt('Any notes for this place? (years lived, favorite restaurant, etc.)', '')
    if (notes === null) {
      // If they cancel notes, treat as empty string rather than cancelling whole addition
      onAddLocation({ lat, lng, title: title.trim() || 'Untitled place', notes: '' })
    } else {
      onAddLocation({ lat, lng, title: title.trim() || 'Untitled place', notes: notes.trim() })
    }
  })

    return null
}

/**
 * MarkerList: shows the live list of places while collecting is active.
 */
function MarkerList({ locations }) {
  if (!locations.length) {
    return (
      <div className="marker-list empty">
        <strong>No places yet.</strong>
        <p>Click the map to add your first place.</p>
      </div>
    )
  }

  return (
    <div className="marker-list">
      <h3>Places (live)</h3>
      <ul>
        {locations.map(loc => (
          <li key={loc.id}>
            <div style={{ fontWeight: 700 }}>{loc.title}</div>
            <div style={{ fontSize: 13 }}>{loc.notes || <em>No notes</em>}</div>
            <div style={{ fontSize: 12, color: '#666' }}>{loc.lat.toFixed(5)}, {loc.lng.toFixed(5)}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}


/**
 * App: main component that contains the map and controls.
 */
export default function App() {
  // locations: array of { id, lat, lng, title, notes }
  const [locations, setLocations] = useState([])
  const [collecting, setCollecting] = useState(true)

  function addLocation({ lat, lng, title, notes }) {
    const newLoc = {
      id: Date.now() + Math.random(), // simple unique id
      lat,
      lng,
      title,
      notes
    }
    setLocations(prev => [...prev, newLoc])
  }

  function resetAll() {
    if (window.confirm('Reset will remove all saved locations. Continue?')) {
      setLocations([])
      setCollecting(true)
    }
  }

  return (
    <div
  style={{display: 'grid',gridTemplateColumns: '1fr 360px',gap: 12,height: '100vh',boxSizing: 'border-box',padding: 12,background: '#f0f0f0'}}>
      <div   style={{width: '100%',height: '100%',borderRadius: 8,overflow: 'hidden',boxShadow: '0 6px 18px rgba(0,0,0,0.06)'}}>
        <div style={{ height: '100%', width: '100%' }}>
          {/* MapContainer renders the map. Keep the ClickHandler inside so it has map context. */}
          <MapContainer center={[20, 0]}zoom={3}minZoom={2}maxZoom={18}worldCopyJump={false}maxBounds={[[-90, -180],[90, 180]]}maxBoundsViscosity={1.0}style={{height: '100%',width: '100%',background: '#d0e0ff',borderRadius: 8}}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* Handle clicks (only adds when collecting is true) */}
            <ClickHandler collecting={collecting} onAddLocation={addLocation} />

            {/* Render saved markers */}
            {locations.map(loc => (
              <Marker key={loc.id} position={[loc.lat, loc.lng]}>
                <Popup>
                  <div style={{ fontWeight: 700 }}>{loc.title}</div>
                  <div style={{ marginTop: 6 }}>{loc.notes || <em>No notes provided</em>}</div>
                  <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                    {loc.lat.toFixed(5)}, {loc.lng.toFixed(5)}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      <div style={{ width: 360, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setCollecting(true)} disabled={collecting}>Collect</button>
          <button onClick={() => setCollecting(false)} disabled={!collecting}>Done</button>
          <button onClick={resetAll}>Reset</button>
        </div>

        {collecting ? (
          <MarkerList locations={locations} />
        ) : (
          <div style={{ padding: 12, borderRadius: 8, background: '#fff' }}>
            <strong>Collection paused.</strong>
            <p>Markers remain on the map. Click <em>Collect</em> to continue adding.</p>
          </div>
        )}

        <div style={{ marginTop: 'auto', fontSize: 13, color: '#444' }}>
          <p><strong>How to use</strong></p>
          <ol style={{ paddingLeft: 18 }}>
            <li>While <em>Collect</em> is active, click anywhere on the map.</li>
            <li>Enter a name and notes when prompted.</li>
            <li>Click <em>Done</em> to stop adding (list will hide).</li>
            <li>Click any marker to see its info.</li>
            <li>Reset clears everything.</li>
          </ol>
        </div>
      </div>
    </div>
  )
}



