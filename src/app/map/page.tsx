import ClientMap from "@/components/client-map";

export default function MapPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Chase Bank Locations</h1>
      <ClientMap accessToken={process.env.MAPBOX_API_KEY || ""} />
    </div>
  );
}
