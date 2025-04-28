"use client";
import dynamic from "next/dynamic";
import "mapbox-gl/dist/mapbox-gl.css";
// This avoids running the actual import on the server
const MapWithGeocoder = dynamic(() => import("@/components/mapbox"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full flex items-center justify-center bg-muted rounded-lg">
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-sm text-muted-foreground">Loading map...</p>
      </div>
    </div>
  ),
});

interface ClientMapProps {
  accessToken: string;
}

export default function ClientMap({ accessToken }: ClientMapProps) {
  return (
    <div className="rounded-lg overflow-hidden border">
      <MapWithGeocoder
        accessToken={accessToken}
        initialCenter={[-121.875329832, 37.334665328]}
        initialZoom={12}
      />
    </div>
  );
}
