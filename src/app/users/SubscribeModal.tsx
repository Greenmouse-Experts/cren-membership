import React, { useState } from "react";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import useGetHook from "../hook/useGet";
import usePostHook from "../hook/usePost";
import useAuthStore from "@/store/auth-store";
import { formatAsNgnMoney } from "../services/helpers";
import type { MemberSubscription } from "@/types/api";
import LoaderSmall from "../components/LoaderSmall";
import { Button } from "@/components/ui/button";

const SubscribeModal = () => {
  const { data } = useGetHook<MemberSubscription>("member/subscription");
  const fname = useAuthStore((s) => s.user?.name) || localStorage.getItem("fName");
  const setSubscribed = useAuthStore((s) => s.setSubscribed);
  const [receipt, setReceipt] = useState<File | null>(null);

  const { handlePost, isPending } = usePostHook();

  const isSuccess = () => {
    // Keep legacy inline-storage keys in sync, plus the persistent store.
    localStorage.setItem("igbo_sub", "1");
    setSubscribed(true);
    toast.success("Subscription receipt uploaded — pending admin confirmation");
    window.location.reload();
  };

  const handleSubmit = () => {
    if (!receipt) {
      toast.error("Please select a receipt file to upload");
      return;
    }
    if (!data?.data?.id) {
      toast.error("Subscription plan could not be loaded. Please refresh.");
      return;
    }

    // Endpoint contract: multipart/form-data with `receipt` (file) + `subscription_id`.
    const formData = new FormData();
    formData.append("subscription_id", String(data.data.id));
    formData.append("receipt", receipt);

    handlePost("member/subscription/upload/manual/receipt", formData, undefined, isSuccess);
  };

  return (
    <div className="fixed flex justify-center items-center h-screen w-full top-0 left-0 bg-[#00000066]">
      <div className="w-11/12 lg:w-5/12 bg-white">
        {!data ? (
          <div>
            {" "}
            <LoaderSmall />
          </div>
        ) : (
          <div className="p-5 flex flex-col items-center gap-4">
            <p className="font-bold text-2xl text-center">Welcome to CREN</p>
            <p className="mt-8 text-center px-3">
              Hello {fname}, we are glad to have you on CREN, Please pay the sum of{" "}
              {formatAsNgnMoney(data?.data?.amount ?? 0)} to {data?.data.bank} in order gain access
              to all services available on CREN.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <div className="flex flex-col">
                <label>Click to upload payment receipt</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={(e) => setReceipt(e.target.files?.[0] ?? null)}
                />
              </div>
              <Button
                onClick={handleSubmit}
                disabled={isPending}
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 cursor-pointer"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscribeModal;
