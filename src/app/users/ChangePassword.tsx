import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import usePostHook from "../hook/usePost";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";

const passwordFormSchema = z
  .object({
    old_password: z.string().min(1, "Current password is required"),
    new_password: z.string().min(6, "New password must be at least 6 characters"),
    new_password_confirmation: z.string().min(1, "Password confirmation is required"),
  })
  .refine((data) => data.new_password === data.new_password_confirmation, {
    message: "New password and confirmation do not match",
    path: ["new_password_confirmation"],
  });

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

interface ChangePasswordProps {
  close?: () => void;
  refetch?: () => void;
}

const ChangePassword = ({ close, refetch }: ChangePasswordProps) => {
  const [loading, setLoading] = useState(false);
  const { handlePost } = usePostHook();

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      old_password: "",
      new_password: "",
      new_password_confirmation: "",
    },
  });

  const onSuccess = () => {
    setLoading(false);
    toast.success("Password changed successfully");
    form.reset();
    if (refetch) refetch();
    if (close) close();
  };

  const onSubmit = (values: PasswordFormValues) => {
    setLoading(true);
    handlePost("member/profile/update/password", values, "application/json", onSuccess);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
        <FormField
          control={form.control}
          name="old_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter current password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="new_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter new password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="new_password_confirmation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Confirm new password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-4 flex justify-end gap-2">
          {close && (
            <Button type="button" variant="outline" onClick={close} disabled={loading}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={loading} className="gap-2">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ChangePassword;
