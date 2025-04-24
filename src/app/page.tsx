import LandingPage from "@/components/landing";

export default function Home() {
  return (
    <div
      className="
        w-full              // Full width on mobile
        p-4                 // Base padding
        md:p-6             // More padding on medium screens
        flex
        flex-col           // Stack vertically on mobile
        md:flex-row        // Side by side on medium screens
        gap-4
        items-center
      "
    >
      <LandingPage />
    </div>
  );
}
