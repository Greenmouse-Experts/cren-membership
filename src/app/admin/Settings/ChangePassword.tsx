import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import { Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";

import usePostHook from "@/app/hook/usePost";
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

export default function ChangePassword({ close, refetch }: ChangePasswordProps) {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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
    toast.success("Password changed successfully");
    form.reset();
    if (refetch) refetch();
    if (close) close();
  };

  const onSubmit = (values: PasswordFormValues) => {
    handlePost("admin/profile/update/password", values, "application/json", onSuccess);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-1">
        <FormField
          control={form.control}
          name="old_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showOld ? "text" : "password"}
                    placeholder="Enter your current password"
                    className="pr-10"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowOld(!showOld)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    aria-label={showOld ? "Hide password" : "Show password"}
                  >
                    {showOld ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
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
                <div className="relative">
                  <Input
                    type={showNew ? "text" : "password"}
                    placeholder="Enter minimum 6 characters"
                    className="pr-10"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    aria-label={showNew ? "Hide password" : "Show password"}
                  >
                    {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
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
                <div className="relative">
                  <Input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Repeat new password"
                    className="pr-10"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                  >
                    {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-3">
          {close && (
            <Button
              type="button"
              variant="outline"
              onClick={close}
              disabled={form.formState.isSubmitting}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="bg-[#015907] text-white hover:bg-[#015907]/90 min-w-36 gap-2"
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <KeyRound className="size-4" />
                Change Password
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
