import { Card } from "@/components/ui/card";
import React from "react";
import Page from "@/components/templates/Page";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Page>
      <Card className="w-full max-w-2xl mx-auto">{children}</Card>
    </Page>
  );
}
