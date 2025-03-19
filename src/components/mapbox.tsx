"use client";
import { useRef, useEffect, useState, useCallback } from "react";
import { SearchBox } from "@mapbox/search-js-react";
import mapboxgl, { InteractionEvent } from "mapbox-gl";
import { Sun, Moon, ZoomIn, ZoomOut, Crosshair, Map, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import "mapbox-gl/dist/mapbox-gl.css";

export interface MapWithGeocoderProps {
  accessToken: string;
  initialCenter?: [number, number];
  initialZoom?: number;
  height?: number | string;
  width?: number | string;
  showControls?: boolean;
  className?: string;
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
  const [userLocation, setUserLocation] = useState<[number, number] | null>([
    initialCenter[0],
    initialCenter[1],
  ]);
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

  const getUserLocation = (): [number, number] => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          console.log(latitude);
          setUserLocation([longitude, latitude]);

          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo({
              center: userLocation || initialCenter,
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
          return [longitude, latitude];
        },
        (error) => {
          console.error("Error getting user location:", error);
          return [initialCenter[0], initialCenter[1]];
        },
      );
    }
    return [initialCenter[0], initialCenter[1]];
  };

  const handleZoom = useCallback((direction: "in" | "out") => {
    if (!mapInstanceRef.current) return;

    const currentZoom = mapInstanceRef.current.getZoom();
    mapInstanceRef.current.zoomTo(
      direction === "in" ? currentZoom + 1 : currentZoom - 1,
    );
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    setUserLocation(getUserLocation());
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
        ? new mapboxgl.LngLat(userLocation[0], userLocation[1])
        : new mapboxgl.LngLat(initialCenter[0], initialCenter[1]),
      zoom: initialZoom,
      attributionControl: false,
      interactive: false,
    });
    mapInstanceRef.current.getCanvas().style.pointerEvents = "none";

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
      if (mapInstanceRef.current) {
        markerRef.current = new mapboxgl.Marker({ color: "#FF0000" })
          .setLngLat([lng, lat])
          .addTo(mapInstanceRef.current);
      } else {
        alert("Map instance not found");
      }
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
    setSelectedLocation({
      name: query,
      lng: lng,
      lat: lat,
    });
    if (markerRef.current) {
      markerRef.current.remove();
    }
    if (mapInstanceRef.current) {
      markerRef.current = new mapboxgl.Marker({ color: "#FF0000" })
        .setLngLat([lng, lat])
        .addTo(mapInstanceRef.current);
    } else {
      alert("Map instance not found");
    }
  };

  return (
    <Card className={`overflow-hidden shadow-lg rounded-lg ${className}`}>
      <div className="p-4 bg-gray-50 dark:bg-gray-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex-grow">
            <SearchBox
              accessToken={accessToken}
              mapboxgl={mapboxgl}
              map={mapInstanceRef.current ? mapInstanceRef.current : undefined}
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
            {/* <Button
              variant="outline"
              size="icon"
              onClick={getUserLocation}
              title="Get My Location"
            >
              <Crosshair size={18} />
            </Button> */}
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
          <div className="absolute bottom-4 right-4 z-10 w-72 bg-card rounded-lg border shadow-lg overflow-hidden">
            <div className="p-4 border-b">
              <button
                onClick={() => setSelectedLocation(null)}
                className="absolute top-3 right-3 h-6 w-6 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label="Close location details"
              >
                <X className="h-4 w-4" />
              </button>
              <h4 className="font-semibold text-md">
                {selectedLocation.name || "Selected Location"}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                Coordinates: {selectedLocation.lat.toFixed(6)},{" "}
                {selectedLocation.lng.toFixed(6)}
              </p>
            </div>

            <div className="p-3 bg-muted/30">
              <p className="text-sm font-medium mb-2">Open in Maps:</p>
              <div className="flex gap-3">
                <Link
                  href={`https://www.google.com/maps/search/?api=1&query=${selectedLocation.lat},${selectedLocation.lng}`}
                  target="_blank"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                >
                  <Map className="h-3.5 w-3.5" />
                  Google Maps
                </Link>
                <Link
                  href={`https://maps.apple.com/?q=${selectedLocation.lat},${selectedLocation.lng}`}
                  target="_blank"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                >
                  <Map className="h-3.5 w-3.5" />
                  Apple Maps
                </Link>
              </div>
            </div>
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
