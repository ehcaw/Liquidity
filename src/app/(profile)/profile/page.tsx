"use client";

import { useEffect, useState } from "react";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Database } from "@/types/db";
import useFetch from "@/hooks/useFetch";
import { Badge } from "@/components/ui/badge";
import ProfileForm, { FormValues } from "@/app/(profile)/profile/ProfileForm";

type User = Database["public"]["Tables"]["users"]["Row"];

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const { fetchData } = useFetch();

  useEffect(() => {
    fetchData<User>("/api/profile").then((data) => {
      setUser(data);
    }).catch((error) => {
      console.error(error);
    });
  }, []);

  const formUser: FormValues = {
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    street: user?.street || "",
    city: user?.city || "",
    state: user?.state || "",
    zipcode: user?.zipcode || "",
  }

  return (
    <>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>
              Update your personal information below
            </CardDescription>
          </div>
          <div className="flex space-x-3 items-center">
            <Badge variant={"default"}>{user?.created_at.split("T")[0] || "Created At"}</Badge>
            <Badge variant={"default"}>{user?.status || "Status"}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {
          user ? <ProfileForm user={formUser} /> : <div>Loading...</div>
        }
      </CardContent>
    </>
  );
}
