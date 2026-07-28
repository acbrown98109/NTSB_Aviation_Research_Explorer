import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import type { Investigation } from '@/types';
import { useAllInvestigations } from '@/hooks/useInvestigations';
import { Card } from '@/components/common/Card';
import { RunwayCategoryBadge } from '@/components/common/Badge';
import { LoadingScreen } from '@/components/common/Spinner';
import { formatDateShort, formatSubType } from '@/utils/format';

import 'leaflet/dist/leaflet.css';

function getMarkerColor(inv: Investigation): string {
  if (inv.runwayIncursion?.category === 'A') return '#ef4444';
  if (inv.runwayIncursion?.category === 'B') return '#f59e0b';
  if (inv.subType === 'near_midair_collision') return '#a855f7';
  if (inv.severity === 'fatal') return '#dc2626';
  return '#0063a6';
}

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 8, { animate: true });
  }, [lat, lng, map]);
  return null;
}

export function MapPage() {
  const { data: investigations = [], isLoading } = useAllInvestigations();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Investigation | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  const withCoords = investigations.filter((i) => i.location.coordinates);

  const filtered = withCoords.filter((inv) => {
    if (filterType === 'all') return true;
    if (filterType === 'runway_incursion') return inv.subType === 'runway_incursion';
    if (filterType === 'near_midair') return inv.subType === 'near_midair_collision';
    if (filterType === 'cat_a') return inv.runwayIncursion?.category === 'A';
    if (filterType === 'lifr') return inv.weather.flightCategory === 'LIFR';
    return true;
  });

  if (isLoading) return <LoadingScreen label="Loading map data…" />;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: '#003b75' }}>Investigation Map</h1>
        <p className="text-sm text-[#666666]">
          Geographic distribution of {filtered.length} aviation safety events
        </p>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 flex-wrap">
        {[
          { value: 'all', label: 'All Events' },
          { value: 'runway_incursion', label: 'Runway Incursions' },
          { value: 'cat_a', label: 'Category A' },
          { value: 'near_midair', label: 'Near Midair' },
          { value: 'lifr', label: 'LIFR Conditions' },
        ].map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilterType(value)}
            className={`px-3 py-1.5 text-xs font-medium border transition-all ${
              filterType === value
                ? 'bg-[#e1f0fa] text-[#003b75] border-[#0063a6]'
                : 'border-[#e0e0e0] text-[#666666] hover:text-[#333333] hover:bg-[#f5f7f9]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-4 flex-wrap">
        {[
          { color: '#ef4444', label: 'Category A' },
          { color: '#f59e0b', label: 'Category B' },
          { color: '#a855f7', label: 'Near Midair' },
          { color: '#0063a6', label: 'Other' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-xs text-[#666666]">{label}</span>
          </div>
        ))}
      </div>

      {/* Map */}
      <div className="overflow-hidden border border-[#e0e0e0]" style={{ height: 500 }}>
        <MapContainer
          center={[39.5, -98.35]}
          zoom={4}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          {selected?.location.coordinates && (
            <RecenterMap
              lat={selected.location.coordinates.lat}
              lng={selected.location.coordinates.lng}
            />
          )}

          {filtered.map((inv) => {
            if (!inv.location.coordinates) return null;
            const color = getMarkerColor(inv);

            return (
              <CircleMarker
                key={inv.id}
                center={[inv.location.coordinates.lat, inv.location.coordinates.lng]}
                radius={inv.runwayIncursion?.category === 'A' ? 10 : 7}
                pathOptions={{
                  color,
                  fillColor: color,
                  fillOpacity: 0.8,
                  weight: 2,
                }}
                eventHandlers={{
                  click: () => setSelected(inv),
                }}
              >
                <Popup>
                  <div className="p-1">
                    <div className="font-mono font-bold text-sm text-blue-700">{inv.id}</div>
                    <div className="text-xs text-gray-700 mt-1">
                      {inv.location.airport ?? `${inv.location.city}, ${inv.location.stateAbbr}`}
                    </div>
                    <div className="text-xs text-gray-500">{formatDateShort(inv.eventDate)}</div>
                    <div className="text-xs mt-1">{formatSubType(inv.subType)}</div>
                    {inv.runwayIncursion && (
                      <div className="text-xs font-bold text-red-600">
                        Category {inv.runwayIncursion.category} Runway Incursion
                      </div>
                    )}
                    <button
                      onClick={() => navigate(`/investigations/${inv.id}`)}
                      className="mt-2 text-xs text-blue-600 hover:underline font-medium"
                    >
                      View investigation →
                    </button>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>

      {/* Selected investigation panel */}
      {selected && (
        <div>
          <Card padding="md">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-bold text-[#0063a6]">{selected.id}</span>
                  {selected.runwayIncursion && (
                    <RunwayCategoryBadge category={selected.runwayIncursion.category} />
                  )}
                </div>
                <p className="text-sm text-[#444444] mb-1">{selected.synopsis}</p>
                <p className="text-xs text-[#666666]">
                  {selected.location.airport ?? `${selected.location.city}, ${selected.location.stateAbbr}`}
                  {' · '}
                  {formatDateShort(selected.eventDate)}
                  {' · '}
                  {selected.weather.flightCategory}
                </p>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => navigate(`/investigations/${selected.id}`)}
                  className="text-xs text-[#0063a6] hover:text-[#003b75] font-medium"
                >
                  View detail →
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="text-xs text-[#888888] hover:text-[#333333]"
                >
                  ✕
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
