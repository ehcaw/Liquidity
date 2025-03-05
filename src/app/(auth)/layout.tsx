import { Card } from "@/components/ui/card";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto py-10 space-y-10">
      <Card className="w-full max-w-2xl mx-auto">{children}</Card>
    </div>
  );
}
