/**
 * GOOGLE MAPS FRONTEND INTEGRATION - ESSENTIAL GUIDE
 *
 * USAGE FROM PARENT COMPONENT:
 * ======
 *
 * const mapRef = useRef<google.maps.Map | null>(null);
 *
 * <MapView
 *   initialCenter={{ lat: 40.7128, lng: -74.0060 }}
 *   initialZoom={15}
 *   onMapReady={(map) => {
 *     mapRef.current = map; // Store to control map from parent anytime, google map itself is in charge of the re-rendering, not react state.
 * </MapView>
 *
 * ======
 * Available Libraries and Core Features:
 * -------------------------------
 * 📍 MARKER (from `marker` library)
 * - Attaches to map using { map, position }
 * new google.maps.marker.AdvancedMarkerElement({
 *   map,
 *   position: { lat: 37.7749, lng: -122.4194 },
 *   title: "San Francisco",
 * });
 *
 * -------------------------------
 * 🏢 PLACES (from `places` library)
 * - Does not attach directly to map; use data with your map manually.
 * const place = new google.maps.places.Place({ id: PLACE_ID });
 * await place.fetchFields({ fields: ["displayName", "location"] });
 * map.setCenter(place.location);
 * new google.maps.marker.AdvancedMarkerElement({ map, position: place.location });
 *
 * -------------------------------
 * 🧭 GEOCODER (from `geocoding` library)
 * - Standalone service; manually apply results to map.
 * const geocoder = new google.maps.Geocoder();
 * geocoder.geocode({ address: "New York" }, (results, status) => {
 *   if (status === "OK" && results[0]) {
 *     map.setCenter(results[0].geometry.location);
 *     new google.maps.marker.AdvancedMarkerElement({
 *       map,
 *       position: results[0].geometry.location,
 *     });
 *   }
 * });
 *
 * -------------------------------
 * 📐 GEOMETRY (from `geometry` library)
 * - Pure utility functions; not attached to map.
 * const dist = google.maps.geometry.spherical.computeDistanceBetween(p1, p2);
 *
 * -------------------------------
 * 🛣️ ROUTES (from `routes` library)
 * - Combines DirectionsService (standalone) + DirectionsRenderer (map-attached)
 * const directionsService = new google.maps.DirectionsService();
 * const directionsRenderer = new google.maps.DirectionsRenderer({ map });
 * directionsService.route(
 *   { origin, destination, travelMode: "DRIVING" },
 *   (res, status) => status === "OK" && directionsRenderer.setDirections(res)
 * );
 *
 * -------------------------------
 * 🌦️ MAP LAYERS (attach directly to map)
 * - new google.maps.TrafficLayer().setMap(map);
 * - new google.maps.TransitLayer().setMap(map);
 * - new google.maps.BicyclingLayer().setMap(map);
 *
 * -------------------------------
 * ✅ SUMMARY
 * - “map-attached” → AdvancedMarkerElement, DirectionsRenderer, Layers.
 * - “standalone” → Geocoder, DirectionsService, DistanceMatrixService, ElevationService.
 * - “data-only” → Place, Geometry utilities.
 */

/// <reference types="@types/google.maps" />

import { useEffect, useRef, useState } from "react";
import { usePersistFn } from "@/hooks/usePersistFn";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    google?: typeof google;
  }
}

// In development, use local proxy to bypass origin restrictions on localhost.
// In production, use the forge API directly.
const IS_DEV = import.meta.env.DEV;
const API_KEY = import.meta.env.VITE_FRONTEND_FORGE_API_KEY;
const MAPS_PROXY_URL = IS_DEV
  ? "/forge-maps"
  : `${import.meta.env.VITE_FRONTEND_FORGE_API_URL || "https://forge.manus.ai"}/v1/maps/proxy`;

function loadMapScript() {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `${MAPS_PROXY_URL}/maps/api/js?key=${API_KEY}&v=weekly&libraries=marker,places,geocoding,geometry`;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.onload = () => {
      script.remove(); // Clean up immediately
      resolve();
    };
    script.onerror = () => {
      script.remove();
      reject(new Error("Failed to load Google Maps script"));
    };
    document.head.appendChild(script);
  });
}

interface MapViewProps {
  className?: string;
  initialCenter?: google.maps.LatLngLiteral;
  initialZoom?: number;
  onMapReady?: (map: google.maps.Map) => void;
  fallbackMarkers?: LocalMapMarker[];
}

export interface LocalMapMarker {
  id: string | number;
  title: string;
  subtitle?: string;
  lat: number;
  lng: number;
  onClick?: () => void;
}

function LocalMap({
  className,
  initialCenter,
  markers = [],
}: {
  className?: string;
  initialCenter: google.maps.LatLngLiteral;
  markers?: LocalMapMarker[];
}) {
  const delta = 0.025;
  const bbox = [
    initialCenter.lng - delta,
    initialCenter.lat - delta,
    initialCenter.lng + delta,
    initialCenter.lat + delta,
  ].join(",");
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${initialCenter.lat}%2C${initialCenter.lng}`;

  return (
    <div className={cn("relative w-full h-[500px] overflow-hidden bg-muted", className)}>
      <iframe
        title="Mapa geográfico de Campo Comprido"
        src={mapUrl}
        className="h-full w-full border-0"
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
      {markers.length > 0 && (
        <div className="absolute bottom-3 left-3 max-h-36 w-64 overflow-y-auto rounded-lg bg-card/95 p-2 shadow-lg">
          <p className="mb-1 text-xs font-semibold">{markers.length} locais na seleção</p>
          {markers.slice(0, 8).map((marker) => (
            <button
              type="button"
              key={marker.id}
              onClick={() => {
                marker.onClick?.();
                window.open(`https://www.openstreetmap.org/?mlat=${marker.lat}&mlon=${marker.lng}#map=17/${marker.lat}/${marker.lng}`, "_blank", "noopener,noreferrer");
              }}
              className="block w-full truncate rounded px-2 py-1 text-left text-xs hover:bg-muted"
            >
              {marker.title}
            </button>
          ))}
        </div>
      )}
      <span className="absolute right-3 top-3 rounded bg-card/95 px-2 py-1 text-xs shadow">© OpenStreetMap</span>
    </div>
  );
}

export function MapView({
  className,
  initialCenter = { lat: 37.7749, lng: -122.4194 },
  initialZoom = 12,
  onMapReady,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const [error, setError] = useState(false);

  const init = usePersistFn(async () => {
    try {
      await loadMapScript();
    } catch {
      setError(true);
      return;
    }
    if (!mapContainer.current) {
      console.error("Map container not found");
      setError(true);
      return;
    }
    if (!window.google?.maps) {
      setError(true);
      return;
    }
    map.current = new window.google.maps.Map(mapContainer.current, {
      zoom: initialZoom,
      center: initialCenter,
      mapTypeControl: true,
      fullscreenControl: true,
      zoomControl: true,
      streetViewControl: true,
      mapId: "DEMO_MAP_ID",
    });
    if (onMapReady) {
      onMapReady(map.current);
    }
  });

  useEffect(() => {
    init();
  }, [init]);

  if (error) {
    return (
      <div className={cn("w-full h-[500px] flex items-center justify-center bg-muted", className)}>
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">O mapa não pôde ser carregado.</p>
          <p className="text-xs text-muted-foreground/60">Verifique sua conexão e recarregue a página.</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={mapContainer} className={cn("w-full h-[500px]", className)} />
  );
}
