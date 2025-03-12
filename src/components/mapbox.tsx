"use client";
import { useRef, useEffect, useState, useCallback } from "react";
import { SearchBox } from "@mapbox/search-js-react";
import mapboxgl from "mapbox-gl";
import { Sun, Moon, ZoomIn, ZoomOut, Crosshair } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export interface MapWithGeocoderProps {
  accessToken: string;
  initialCenter?: [number, number];
  initialZoom?: number;
  height?: number | string;
  width?: number | string;
  showControls?: boolean;
  className?: string;
}

function validateCoordinates(coords: [number, number]): [number, number] {
  const [lng, lat] = coords;

  // Ensure longitude is between -180 and 180
  if (lng < -180 || lng > 180) {
    console.error(`Invalid longitude: ${lng}`);
    return [-122, 37]; // Default to San Francisco
  }

  // Ensure latitude is between -90 and 90
  if (lat < -90 || lat > 90) {
    console.error(`Invalid latitude: ${lat}`);
    return [-122, 37]; // Default to San Francisco
  }

  return [lng, lat];
}

export default function MapWithGeocoder({
  accessToken,
  initialCenter = [-121.888138, 37.334789],
  initialZoom = 9,
  height = 500,
  width = "100%",
  showControls = true,
  className = "",
}: MapWithGeocoderProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null,
  );
  const [selectedLocation, setSelectedLocation] = useState<{
    lng: number;
    lat: number;
    name?: string;
  } | null>(null);

  const toggleMapStyle = useCallback(() => {
    if (!mapInstanceRef.current) return;

    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);

    mapInstanceRef.current.setStyle(
      newDarkMode
        ? "mapbox://styles/mapbox/dark-v11"
        : "mapbox://styles/mapbox/streets-v11",
    );
  }, [darkMode]);

  const getUserLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setUserLocation([longitude, latitude]);

          if (mapInstanceRef.current) {
            const validCoords = validateCoordinates([longitude, latitude]);
            mapInstanceRef.current.flyTo({
              center: validCoords,
              zoom: 14,
              essential: true,
            });

            // Add a marker for user's location
            if (markerRef.current) {
              markerRef.current.remove();
            }

            markerRef.current = new mapboxgl.Marker({
              color: "#0077FF",
              scale: 1.5,
            })
              .setLngLat([longitude, latitude])
              .addTo(mapInstanceRef.current);
          }
        },
        (error) => {
          console.error("Error getting user location:", error);
        },
      );
    }
  }, []);

  const handleZoom = useCallback((direction: "in" | "out") => {
    if (!mapInstanceRef.current) return;

    const currentZoom = mapInstanceRef.current.getZoom();
    mapInstanceRef.current.zoomTo(
      direction === "in" ? currentZoom + 1 : currentZoom - 1,
    );
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = accessToken;

    mapInstanceRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: darkMode
        ? "mapbox://styles/mapbox/navigation-night-v1"
        : "mapbox://styles/mapbox/navigation-day-v1",
      center: userLocation
        ? new mapboxgl.LngLat(userLocation[1], userLocation[0])
        : new mapboxgl.LngLat(initialCenter[1], initialCenter[0]),
      zoom: initialZoom,
      attributionControl: false,
    });

    // Add navigation control
    if (showControls) {
      mapInstanceRef.current.addControl(
        new mapboxgl.NavigationControl(),
        "bottom-right",
      );

      mapInstanceRef.current.addControl(
        new mapboxgl.AttributionControl({
          compact: true,
        }),
        "bottom-left",
      );
    }

    mapInstanceRef.current.on("load", () => {
      setMapLoaded(true);
    });

    // Add click handler to get coordinates
    mapInstanceRef.current.on("click", (e) => {
      const { lng, lat } = e.lngLat;

      setSelectedLocation({
        lng,
        lat,
      });

      if (markerRef.current) {
        markerRef.current.remove();
      }

      markerRef.current = new mapboxgl.Marker({ color: "#FF0000" })
        .setLngLat([lng, lat])
        .addTo(mapInstanceRef.current!);
    });

    // Cleanup on unmount
    return () => {
      mapInstanceRef.current?.remove();
    };
  }, [
    accessToken,
    darkMode,
    initialCenter,
    initialZoom,
    showControls,
    userLocation,
  ]);

  const handleSearchResult = (query: string, lng: number, lat: number) => {
    console.log(query);
    if (!query.toLowerCase().includes("chase")) {
      toast(
        "Cannot locate this location. Please select a different Chase location",
      );
      return;
    }
    mapInstanceRef.current?.flyTo({
      center: [lng, lat],
      zoom: 12,
    });
  };

  return (
    <Card className={`overflow-hidden shadow-lg rounded-lg ${className}`}>
      <div className="p-4 bg-gray-50 dark:bg-gray-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex-grow">
            <SearchBox
              accessToken={accessToken}
              mapboxgl={mapboxgl}
              value={inputValue}
              onChange={(value: string) => {
                setInputValue(value);
              }}
              onRetrieve={(res) =>
                handleSearchResult(
                  res.features[0].properties.name,
                  res.features[0].geometry.coordinates[0],
                  res.features[0].geometry.coordinates[1],
                )
              }
              options={{
                language: "en",
                country: "US",
              }}
              marker={false}
            />
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleMapStyle}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={getUserLocation}
              title="Get My Location"
            >
              <Crosshair size={18} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleZoom("in")}
              title="Zoom In"
            >
              <ZoomIn size={18} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleZoom("out")}
              title="Zoom Out"
            >
              <ZoomOut size={18} />
            </Button>
          </div>
        </div>

        {selectedLocation && (
          <div className="text-sm bg-white dark:bg-gray-700 p-2 rounded-md">
            <p className="font-medium">
              {selectedLocation.name || "Selected Location"}
            </p>
            <p className="text-gray-500 dark:text-gray-300">
              Lat: {selectedLocation.lat.toFixed(6)}, Lng:{" "}
              {selectedLocation.lng.toFixed(6)}
            </p>
          </div>
        )}
      </div>

      <div
        id="map-container"
        ref={mapContainerRef}
        style={{ height, width }}
        className="relative"
      />
    </Card>
  );
}
