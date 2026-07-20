"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-client";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required").max(60),
  email: z.string().email(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "Demo User", email: "demo@example.com" },
  });

  const onSubmit = async (values: ProfileForm) => {
    try {
      await api.patch("/users/me", { name: values.name });
      toast.success("Profile updated");
    } catch {
      toast.error("Could not update your profile");
    }
  };

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-6 py-10">
      <Link href="/chat" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to chat
      </Link>
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle>Your details</CardTitle>
          <CardDescription>This information is visible only to you.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex items-center gap-4">
            <Avatar className="h-16 w-16 text-lg">
              <AvatarFallback>D</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm">
              Change photo
            </Button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="name">
                Name
              </label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="email">
                Email
              </label>
              <Input id="email" type="email" disabled {...register("email")} />
              <p className="text-xs text-muted-foreground">Contact support to change your email.</p>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="accent" disabled={!isDirty || isSubmitting}>
                {isSubmitting ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
