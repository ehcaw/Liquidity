import ClientMap from "@/components/client-map";
import { isAuthenticated } from "@/utils/isAuthenticated";

export default async function MapPage() {
  // You would replace this with your actual environment variable or config
  const mapboxAccessToken = process.env.MAPBOX_API_KEY || "";

  await isAuthenticated();

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Our Branches</h1>
        <p className="text-muted-foreground">
          Come to our branches and experience the best financial services.
        </p>
      </div>

      <div className="card rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6"></div>
        <div className="p-6 pt-0">
          <ClientMap accessToken={mapboxAccessToken} />
        </div>
      </div>
    </div>
  );
}
