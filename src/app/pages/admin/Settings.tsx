import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import { Camera, CheckCircle2, KeyRound, Loader2, Mail, Phone, Shield, User } from "lucide-react";

import useGetHook from "../../hook/useGet";
import usePostHook from "../../hook/usePost";
import ChangePassword from "../../admin/Settings/ChangePassword";
import type { Member } from "@/types/api";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

const profileFormSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone_number: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function SettingsPage() {
  const { data: user, isLoading: loadingProfile, refetch } = useGetHook<Member>("admin/profile");
  const { handlePost } = usePostHook();

  const [preview, setPreview] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
    },
  });

  useEffect(() => {
    if (user?.data) {
      form.reset({
        first_name: user.data.first_name || "",
        last_name: user.data.last_name || "",
        email: user.data.email || "",
        phone_number: user.data.phone_number || "",
      });

      if (user.data.avatar) {
        localStorage.setItem("igbo_member_avatar", user.data.avatar);
      }
    }
  }, [user, form]);

  const onUpdateSuccess = () => {
    toast.success("Profile updated successfully");
    refetch();
  };

  const onSubmit = (values: ProfileFormValues) => {
    const payload = {
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      phone_number: values.phone_number || "",
    };
    handlePost("admin/profile/update", payload, "application/json", onUpdateSuccess);
  };

  const changeProfileImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    const payload = new FormData();
    payload.append("avatar", file);

    handlePost("admin/profile/upload/profile-picture", payload, undefined, () => {
      toast.success("Profile picture updated successfully");
      setIsUploadingPhoto(false);
      refetch();
    });
  };

  const profile = user?.data;
  const initials =
    `${profile?.first_name?.[0] ?? ""}${profile?.last_name?.[0] ?? ""}`.trim().toUpperCase() ||
    profile?.username?.slice(0, 2).toUpperCase() ||
    "AD";

  return (
    <div className="mx-2 min-h-[75vh] space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-2 rounded-xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#075b2f]/10 text-[#075b2f]">
            <Shield className="h-5 w-5" />
          </span>
          <h1 className="text-xl font-semibold tracking-tight text-[#075b2f] sm:text-2xl">
            Admin Profile & Settings
          </h1>
        </div>
        <p className="text-sm text-[#62705f]">
          Manage your administrator account credentials, personal information, and portal security.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Avatar & Quick Info */}
        <Card className="border-black/5 shadow-sm lg:col-span-1">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-lg text-[#075b2f]">Profile Picture</CardTitle>
            <CardDescription>Click the camera icon to upload a new avatar</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center pt-2 pb-6">
            <div className="relative group">
              <Avatar className="h-36 w-36 border-4 border-white shadow-lg ring-2 ring-black/5">
                <AvatarImage
                  src={preview ?? profile?.avatar ?? undefined}
                  alt={profile?.first_name || "Admin"}
                  className="object-cover"
                />
                <AvatarFallback className="bg-[#075b2f]/10 text-2xl font-bold text-[#075b2f]">
                  {initials}
                </AvatarFallback>
              </Avatar>

              {/* Upload Overlay Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingPhoto}
                className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full bg-[#015907] text-white shadow-md transition hover:bg-[#015907]/90 hover:scale-105 focus:outline-none"
                aria-label="Upload profile picture"
              >
                {isUploadingPhoto ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={changeProfileImage}
                className="hidden"
              />
            </div>

            <div className="mt-5 text-center space-y-1">
              <h2 className="text-lg font-semibold text-gray-900">
                {loadingProfile ? (
                  <Skeleton className="h-6 w-32 mx-auto" />
                ) : (
                  `${profile?.first_name || "Admin"} ${profile?.last_name || ""}`.trim()
                )}
              </h2>
              <p className="text-sm text-muted-foreground">{profile?.email || "—"}</p>
              <div className="pt-2">
                <Badge
                  variant="outline"
                  className="border-emerald-200 bg-emerald-50 text-emerald-700"
                >
                  {profile?.account_type || "Administrator"}
                </Badge>
              </div>
            </div>

            <div className="w-full mt-6 pt-6 border-t border-gray-100 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Account Status</span>
                <span className="inline-flex items-center gap-1 font-medium text-emerald-600">
                  <CheckCircle2 className="size-3.5" />
                  {profile?.status || "Active"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Username</span>
                <span className="font-mono text-gray-700">{profile?.username || "—"}</span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="pt-0">
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2 border-[#075b2f]/20 text-[#075b2f] hover:bg-[#075b2f]/5"
              onClick={() => setIsPasswordModalOpen(true)}
            >
              <KeyRound className="size-4" />
              Change Password
            </Button>
          </CardFooter>
        </Card>

        {/* Right Column: Profile Form */}
        <Card className="border-black/5 shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg text-[#075b2f]">Account Details</CardTitle>
            <CardDescription>
              Update your contact details and administrator profile information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingProfile ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1.5">
                            <User className="size-4 text-[#075b2f]" />
                            First Name
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Enter first name" {...field} />
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
                          <FormLabel className="flex items-center gap-1.5">
                            <User className="size-4 text-[#075b2f]" />
                            Last Name
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Enter last name" {...field} />
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
                        <FormLabel className="flex items-center gap-1.5">
                          <Mail className="size-4 text-[#075b2f]" />
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="admin@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5">
                          <Phone className="size-4 text-[#075b2f]" />
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 08012345678" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <Button
                      type="submit"
                      disabled={form.formState.isSubmitting}
                      className="bg-[#015907] text-white hover:bg-[#015907]/90 min-w-36 gap-2"
                    >
                      {form.formState.isSubmitting ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Saving Changes...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Change Password Dialog */}
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#075b2f]">Change Password</DialogTitle>
            <DialogDescription>
              Ensure your new password contains at least 6 characters.
            </DialogDescription>
          </DialogHeader>
          <ChangePassword close={() => setIsPasswordModalOpen(false)} refetch={refetch} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
