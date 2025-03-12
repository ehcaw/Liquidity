import { ProfileFormSchema } from "@/utils/zod/form";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Database } from "@/types/db";
import useFetch from "@/hooks/useFetch";

type State = Database["public"]["Tables"]["states"]["Row"];
export type FormValues = z.infer<typeof ProfileFormSchema>;

interface IProfileFormProps {
  user: FormValues;
}

const ProfileForm: React.FC<IProfileFormProps> = ({ user }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [updateduUser] = useState<FormValues>(user);
  const [states, setStates] = useState<State["code"][]>([]);
  const { fetchData } = useFetch();
  const form = useForm<FormValues>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: updateduUser,
  });

  useEffect(() => {
    fetchData<State[]>("/api/states")
      .then((data) => {
        setStates(data?.map((state) => state.code) || []);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const onSave = async (data: FormValues) => {
    setIsSaving(true);

    fetchData("/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(() => {
        toast("Profile updated");
      })
      .catch((error) => {
        toast("Error: " + error);
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    disabled
                    placeholder="john.doe@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="1234567890" {...field} maxLength={10} />
                </FormControl>
                <FormDescription>
                  Enter a 10-digit phone number without spaces or dashes
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main St" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="New York" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="zipcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zipcode</FormLabel>
                  <FormControl>
                    <Input placeholder="12345" {...field} maxLength={5} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ProfileForm;
