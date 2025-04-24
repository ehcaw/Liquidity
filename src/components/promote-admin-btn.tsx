'use client'

import React from "react";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/useFetch";
import { toast } from "sonner";

const PromoteAdminBtn = () => {
  const { fetchData } = useFetch();

  const handlePromoteAdmin = async () => {
    await fetchData("/api/admin/promote", {
      method: "PUT",
    })
      .then(() => {
        toast.success("Promoted admin successfully!");
      })
      .catch(() => {
        toast.error("Failed to promote admin");
      });
  };

  return (
    <div className="flex justify-end">
      <Button variant="outline" onClick={handlePromoteAdmin}>
        Promote Admin
      </Button>
    </div>
  );
};

export default PromoteAdminBtn;
