"use client";
import dynamic from "next/dynamic";

// Import the type but not the actual component (for TS only)
import type { MapWithGeocoderProps } from "@/components/mapbox";

// This avoids running the actual import on the server
const MapWithGeocoder = dynamic(() => import("@/components/mapbox"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full flex items-center justify-center bg-gray-100 rounded-lg">
      Loading map...
    </div>
  ),
});

interface ClientMapProps {
  accessToken: string;
}

export default function ClientMap({ accessToken }: ClientMapProps) {
  return (
    <MapWithGeocoder
      accessToken={accessToken}
      initialCenter={[-121.875329832, 37.334665328]}
      initialZoom={12}
    />
  );
}
