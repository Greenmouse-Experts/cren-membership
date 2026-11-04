import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import useGetHook from "../../hook/useGet";
import usePostHook from "../../hook/usePost";
import { toast } from "react-toastify";
import ChangePassword from "../../users/ChangePassword";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Camera,
  Building2,
  Mail,
  Phone,
  User,
  MapPin,
  KeyRound,
  Loader2,
  CheckCircle2,
} from "lucide-react";

const profileFormSchema = z.object({
  name_of_member_organization: z.string().min(1, "Organization name is required"),
  name_of_representative: z.string().min(1, "Representative name is required"),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  phone_number: z.string().min(1, "Phone number is required"),
  address: z.string(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const MembersSetting = () => {
  const { data: user, isLoading: loadingProfile, refetch } = useGetHook("member/profile");

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { handlePost } = usePostHook();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name_of_member_organization: "",
      name_of_representative: "",
      username: "",
      email: "",
      phone_number: "",
      address: "",
    },
  });

  useEffect(() => {
    if (user?.data) {
      form.reset({
        name_of_member_organization: user.data.name_of_member_organization || "",
        name_of_representative: user.data.name_of_representative || "",
        username: user.data.username || "",
        email: user.data.email || "",
        phone_number: user.data.phone_number || "",
        address: user.data.address || "",
      });

      if (user.data.avatar) {
        localStorage.setItem("igbo_member_avatar", user.data.avatar);
      }
    }
  }, [user, form]);

  const onSuccess = () => {
    toast.success("Profile updated successfully");
    setLoading(false);
    refetch();
  };

  const changeProfileImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsBusy(true);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    const formData = new FormData();
    formData.append("avatar", file);

    handlePost("member/profile/upload/profile-picture", formData, "multipart/form-data", () => {
      toast.success("Profile picture updated successfully");
      setIsBusy(false);
      refetch();
    });
  };

  const onSubmit = (values: ProfileFormValues) => {
    setLoading(true);
    handlePost("member/profile/update", values, "application/json", onSuccess);
  };

  const currentOrgName = form.watch("name_of_member_organization");
  const currentRep = form.watch("name_of_representative");
  const currentEmail = form.watch("email");
  const currentAvatar = preview || user?.data?.avatar;

  const initials = (currentOrgName || currentRep || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (loadingProfile && !user) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 w-full space-y-6">
        <Skeleton className="h-8 w-48" />
        <Card>
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center space-x-6">
              <Skeleton className="h-28 w-28 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Member Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your organization information and profile settings.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setIsPasswordModalOpen(true)}
          className="self-start sm:self-auto gap-2"
        >
          <KeyRound className="h-4 w-4" />
          Change Password
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="shadow-sm">
            <CardHeader className="pb-4 border-b">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="relative group">
                  <Avatar className="h-28 w-28 border-2 border-border shadow-md">
                    <AvatarImage src={currentAvatar} alt="Profile" className="object-cover" />
                    <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 h-9 w-9 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer disabled:opacity-50"
                    title="Upload profile picture"
                  >
                    {isBusy ? (
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

                <div className="text-center sm:text-left space-y-1">
                  <CardTitle className="text-xl">
                    {currentOrgName || currentRep || "Organization Member"}
                  </CardTitle>
                  <CardDescription className="flex items-center justify-center sm:justify-start gap-2">
                    <Mail className="h-3.5 w-3.5" />
                    {currentEmail || "No email provided"}
                  </CardDescription>
                  <p className="text-xs text-muted-foreground pt-1">
                    Click the camera icon to upload a new profile image (PNG, JPG, max 5MB).
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name_of_member_organization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        Name of Organization
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter organization name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name_of_representative"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        Name of Representative
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter representative's name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        Username
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter email address" {...field} />
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
                      <FormLabel className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="Enter phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        Address
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter full address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>

            <CardFooter className="flex justify-end gap-3 pt-4 border-t bg-muted/20">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={loading || isBusy}
              >
                Reset
              </Button>
              <Button type="submit" disabled={loading || isBusy} className="gap-2">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>

      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and a new secure password.
            </DialogDescription>
          </DialogHeader>
          <ChangePassword close={() => setIsPasswordModalOpen(false)} refetch={refetch} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MembersSetting;
