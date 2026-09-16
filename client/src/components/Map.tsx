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

function getMapsScriptUrl() {
  if (!API_KEY) {
    return null;
  }

  return `${MAPS_PROXY_URL}/maps/api/js?key=${API_KEY}&v=weekly&libraries=marker,places,geocoding,geometry`;
}

function loadMapScript() {
  return new Promise<void>((resolve, reject) => {
    const scriptUrl = getMapsScriptUrl();
    if (!scriptUrl) {
      reject(new Error("Google Maps API key is missing"));
      return;
    }

    const script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.onload = () => {
      script.remove();
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
  const points = markers.length > 0 ? markers : [{ id: "center", title: "Campo Comprido", lat: initialCenter.lat, lng: initialCenter.lng }];
  const lats = points.map((point) => point.lat);
  const lngs = points.map((point) => point.lng);
  const minLat = Math.min(...lats, initialCenter.lat) - 0.002;
  const maxLat = Math.max(...lats, initialCenter.lat) + 0.002;
  const minLng = Math.min(...lngs, initialCenter.lng) - 0.002;
  const maxLng = Math.max(...lngs, initialCenter.lng) + 0.002;
  const latSpan = maxLat - minLat || 0.01;
  const lngSpan = maxLng - minLng || 0.01;

  const toPosition = (lat: number, lng: number) => ({
    left: `${Math.min(95, Math.max(5, ((lng - minLng) / lngSpan) * 100))}%`,
    top: `${Math.min(92, Math.max(8, (1 - (lat - minLat) / latSpan) * 100))}%`,
  });

  return (
    <div className={cn("relative w-full h-[500px] overflow-hidden bg-[oklch(0.91_0.03_95)]", className)}>
      <div className="absolute inset-0 opacity-90">
        <div className="absolute left-[-8%] top-[18%] h-3 w-[118%] rotate-[-7deg] rounded-full bg-[oklch(0.76_0.06_75)]" />
        <div className="absolute left-[-12%] top-[48%] h-3 w-[124%] rotate-[5deg] rounded-full bg-[oklch(0.78_0.06_75)]" />
        <div className="absolute left-[16%] top-[-10%] h-[125%] w-3 rotate-[19deg] rounded-full bg-[oklch(0.80_0.05_80)]" />
        <div className="absolute left-[62%] top-[-10%] h-[125%] w-3 rotate-[-14deg] rounded-full bg-[oklch(0.80_0.05_80)]" />
        <div className="absolute left-[3%] top-[72%] h-2 w-[96%] rotate-[-3deg] rounded-full bg-white/70" />
        <div className="absolute left-[34%] top-[5%] h-[88%] w-2 rotate-[4deg] rounded-full bg-white/70" />
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,oklch(0.82_0.08_150)_0,transparent_24%),radial-gradient(circle_at_78%_72%,oklch(0.78_0.08_150)_0,transparent_22%)] opacity-40" />

      <div className="absolute right-4 top-4 rounded-lg border border-border bg-card/90 px-3 py-2 text-right shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Campo Comprido</p>
        <p className="text-sm font-medium text-foreground">Mapa local interativo</p>
      </div>

      <div className="absolute bottom-4 left-4 rounded-lg border border-border bg-card/90 px-3 py-2 text-xs text-muted-foreground shadow-sm">
        Pins aproximados por endereço
      </div>

      <span className="absolute left-[12%] top-[15%] rounded bg-card/75 px-2 py-1 text-[11px] font-medium text-muted-foreground">Eduardo Sprada</span>
      <span className="absolute right-[10%] top-[48%] rounded bg-card/75 px-2 py-1 text-[11px] font-medium text-muted-foreground">Renato Polatti</span>
      <span className="absolute left-[36%] bottom-[16%] rounded bg-card/75 px-2 py-1 text-[11px] font-medium text-muted-foreground">João Falarz</span>

      {markers.map((marker, index) => {
        const position = toPosition(marker.lat, marker.lng);
        return (
          <button
            key={marker.id}
            type="button"
            onClick={marker.onClick}
            className="group absolute z-10 -translate-x-1/2 -translate-y-full focus:outline-none"
            style={position}
            aria-label={marker.title}
          >
            <span className="block h-7 w-7 rounded-full border-2 border-white bg-[oklch(0.72_0.12_40)] shadow-lg transition-transform group-hover:scale-110">
              <span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
            </span>
            <span className="absolute left-1/2 top-[-3.25rem] hidden w-44 -translate-x-1/2 rounded-lg border border-border bg-card px-3 py-2 text-left shadow-xl group-hover:block group-focus:block">
              <span className="block truncate text-xs font-semibold text-foreground">{marker.title}</span>
              {marker.subtitle && <span className="block truncate text-[11px] text-muted-foreground">{marker.subtitle}</span>}
            </span>
            <span className="sr-only">{index + 1}</span>
          </button>
        );
      })}
    </div>
  );
}

export function MapView({
  className,
  initialCenter = { lat: 37.7749, lng: -122.4194 },
  initialZoom = 12,
  onMapReady,
  fallbackMarkers = [],
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const [error, setError] = useState(false);

  const init = usePersistFn(async () => {
    try {
      await loadMapScript();
    } catch (error) {
      console.warn("Google Maps unavailable in this environment:", error instanceof Error ? error.message : error);
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
    return <LocalMap className={className} initialCenter={initialCenter} markers={fallbackMarkers} />;
  }

  return (
    <div ref={mapContainer} className={cn("w-full h-[500px]", className)} />
  );
}
