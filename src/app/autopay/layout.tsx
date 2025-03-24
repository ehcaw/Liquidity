import Page from "@/components/templates/Page";
import React from "react";

export default function AutoPayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Page>{children}</Page>;
}