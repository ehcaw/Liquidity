import Page from "@/components/templates/Page";
import { Card } from "@/components/ui/card";
import React from "react";

export default function ProfileLayout({
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
