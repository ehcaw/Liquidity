import Page from "@/components/templates/Page";
import React from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return <Page>{children}</Page>;
};

export default DashboardLayout;
