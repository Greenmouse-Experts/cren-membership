// @ts-nocheck
import React, { useState } from "react";
import { toast } from "react-toastify";
import usePostHook from "../hook/usePost";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ChangePasswordProps {
  close?: () => void;
  refetch?: () => void;
}

const ChangePassword = ({ close, refetch }: ChangePasswordProps) => {
  const [loading, setLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const { handlePost } = usePostHook();

  const onSuccess = () => {
    setLoading(false);
    toast.success("Password changed successfully");
    if (refetch) refetch();
    if (close) close();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !newPassword2) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (newPassword !== newPassword2) {
      toast.error("New password and confirmation do not match");
      return;
    }

    setLoading(true);
    const payload = {
      old_password: oldPassword,
      new_password: newPassword,
      new_password_confirmation: newPassword2,
    };
    handlePost("member/profile/update/password", payload, "application/json", onSuccess);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      <div className="space-y-2">
        <Label htmlFor="old_password">Current Password</Label>
        <Input
          id="old_password"
          type="password"
          placeholder="Enter current password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="new_password">New Password</Label>
        <Input
          id="new_password"
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="new_password_confirmation">Confirm New Password</Label>
        <Input
          id="new_password_confirmation"
          type="password"
          placeholder="Confirm new password"
          value={newPassword2}
          onChange={(e) => setNewPassword2(e.target.value)}
        />
      </div>

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
  );
};

export default ChangePassword;
