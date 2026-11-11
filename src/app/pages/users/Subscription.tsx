import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import { usePaystackPayment } from "react-paystack";
import { BadgeCheck, Calendar, Landmark, Loader2, RefreshCcw, Wallet } from "lucide-react";
import { FiUploadCloud } from "react-icons/fi";
import { RiSecurePaymentFill } from "react-icons/ri";

import useGetHook from "@/app/hook/useGet";
import usePostHook from "@/app/hook/usePost";
import useAuthStore, { normalizeSubscribed } from "@/store/auth-store";
import { formatAsNgnMoney } from "@/app/services/helpers";
import type { ApiResponse, MemberSubscription, SubscriptionItem } from "@/types/api";

import PageLoader from "@/components/layout/PageLoader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

const PAYSTACK_PUBLIC_KEY = "pk_test_fe7139f1b8c79eb8d80205804553a52a55bcf8f5";

/* ------------------------------------------------------------------ */
/* Paystack online payment per plan                                    */
/* ------------------------------------------------------------------ */

interface PaystackPlanPayProps {
  plan: SubscriptionItem;
  onVerify: (reference: string, subscriptionId: string | number) => void;
}

const PaystackPlanPay: React.FC<PaystackPlanPayProps> = ({ plan, onVerify }) => {
  const email = typeof window !== "undefined" ? localStorage.getItem("igbo_email") || "" : "";

  const config = {
    reference: new Date().getTime().toString(),
    email: email || "member@example.com",
    amount: Math.round(Number(plan.amount || 0) * 100),
    publicKey: PAYSTACK_PUBLIC_KEY,
  };

  const initializePayment = usePaystackPayment(config);

  return (
    <Button
      size="sm"
      className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 cursor-pointer shadow-sm"
      onClick={() =>
        initializePayment({
          onSuccess: (reference: { reference: string }) => {
            onVerify(reference.reference, plan.id);
          },
          onClose: () => toast.info("Payment window closed"),
        })
      }
    >
      <RiSecurePaymentFill className="h-4 w-4" />
      Pay Online
    </Button>
  );
};

/* ------------------------------------------------------------------ */
/* Manual receipt upload per plan                                      */
/* ------------------------------------------------------------------ */

const receiptSchema = z.object({
  receipt: z
    .any()
    .refine((val) => val && val.length > 0, "Payment receipt file is required")
    .refine(
      (val) =>
        val &&
        val[0] &&
        ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"].includes(
          val[0].type,
        ),
      "File must be an image (JPEG, PNG, WEBP) or PDF",
    ),
});

interface ReceiptFormValues {
  receipt?: FileList;
}

const ManualReceiptForm: React.FC<{
  plan: SubscriptionItem | null;
  refetch: () => void;
  close: () => void;
}> = ({ plan, refetch, close }) => {
  const { handlePost, isPending } = usePostHook();

  const form = useForm<ReceiptFormValues>({
    resolver: zodResolver(receiptSchema) as never,
  });

  const onSubmit = async (values: ReceiptFormValues) => {
    const file = values.receipt?.[0];
    if (!file || !plan?.id) {
      toast.error("Please select a valid receipt file");
      return;
    }

    const formData = new FormData();
    formData.append("subscription_id", String(plan.id));
    formData.append("receipt", file);

    await handlePost("member/subscription/upload/manual/receipt", formData, undefined, () => {
      toast.success("Receipt uploaded successfully — pending admin confirmation");
      refetch();
      close();
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-2">
        <FormField
          control={form.control}
          name="receipt"
          render={({ field: { value: _value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>Payment Receipt</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={(e) => onChange(e.target.files)}
                  {...fieldProps}
                  className="cursor-pointer file:cursor-pointer file:text-primary file:font-semibold"
                />
              </FormControl>
              <FormDescription>
                Upload bank transfer receipt for &ldquo;{plan?.type || "Membership"}
                Subscription&rdquo;.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={close} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending} className="min-w-32">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <FiUploadCloud className="mr-2 h-4 w-4" />
                Upload Receipt
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

/* ------------------------------------------------------------------ */
/* Formatting helpers                                                  */
/* ------------------------------------------------------------------ */

const formatDate = (value?: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
};

const planTitle = (plan: SubscriptionItem | null) =>
  plan?.plan_name || plan?.type || "Membership Subscription";

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const SubscriptionPage: React.FC = () => {
  const {
    data: plansResp,
    isLoading,
    refetch,
    query,
  } = useGetHook<ApiResponse<SubscriptionItem[]>>("member/subscription");

  const { data: currentResp, refetch: refetchCurrent } = useGetHook<MemberSubscription>(
    "member/subscription/current",
  );

  const subscription = useAuthStore((s) => s.subscription);
  const setSubscription = useAuthStore((s) => s.setSubscription);
  const setSubscribed = useAuthStore((s) => s.setSubscribed);

  // Keep the persistent store in sync with the freshest API data.
  useEffect(() => {
    const data = currentResp?.data;
    if (!data || data.isSubscribed === undefined) return;
    setSubscription({
      isSubscribed: data.isSubscribed,
      transaction: data.transaction ?? null,
      plan: data.plan ?? null,
    });
    setSubscribed(normalizeSubscribed(data.isSubscribed));
  }, [currentResp, setSubscription, setSubscribed]);

  const [selectedPlan, setSelectedPlan] = useState<SubscriptionItem | null>(null);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [verifiedId, setVerifiedId] = useState<string | number | null>(null);

  const { handlePost } = usePostHook();

  const plans: SubscriptionItem[] = useMemo(() => {
    if (!plansResp?.data || !Array.isArray(plansResp.data)) return [];
    return plansResp.data;
  }, [plansResp]);

  // Prefer the latest API response; fall back to the persisted store.
  const current: MemberSubscription = useMemo(
    () =>
      currentResp?.data?.isSubscribed !== undefined
        ? currentResp.data
        : (subscription ?? { isSubscribed: false, transaction: null, plan: null }),
    [currentResp, subscription],
  );

  const isSubscribed = normalizeSubscribed(current.isSubscribed);
  const activePlan = current.plan ?? null;
  const transaction = current.transaction ?? null;

  const refreshAll = () => {
    refetch();
    refetchCurrent();
  };

  const handleVerifyPayment = (reference: string, subscriptionId: string | number) => {
    setVerifiedId(subscriptionId);
    const payload = {
      subscription_id: subscriptionId,
      ref_id: reference,
    };
    handlePost("member/subscription/payment", payload, "application/json", () => {
      refreshAll();
      toast.success("Subscription payment verified successfully!");
    });
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6">
      {/* Current subscription summary */}
      <Card className="shadow-sm border-base-200">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">Subscription</CardTitle>
            <CardDescription>
              Manage your CREN membership subscription — pay online or upload a manual transfer
              receipt.
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshAll}
            className="gap-2 self-start sm:self-auto cursor-pointer"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent className="pt-2">
          {activePlan ? (
            <div className="rounded-lg border bg-white p-5">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg">{planTitle(activePlan)}</h3>
                    <Badge
                      className={
                        isSubscribed
                          ? "bg-emerald-100 text-emerald-800 border-transparent"
                          : "bg-amber-100 text-amber-800 border-transparent"
                      }
                    >
                      {isSubscribed ? "Subscribed" : "Payment pending"}
                    </Badge>
                  </div>
                  {activePlan.description && (
                    <p className="text-sm text-muted-foreground max-w-xl">
                      {activePlan.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-x-6 gap-y-1.5 pt-1 text-sm text-muted-foreground">
                    {isSubscribed && transaction?.paid_at && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        Paid {formatDate(transaction.paid_at)}
                      </span>
                    )}
                    {activePlan.bank && (
                      <span className="flex items-center gap-1.5">
                        <Landmark className="h-3.5 w-3.5" />
                        {activePlan.bank}
                      </span>
                    )}
                    {transaction?.ref_id && (
                      <span className="flex items-center gap-1.5">
                        <Wallet className="h-3.5 w-3.5" />
                        Ref: {transaction.ref_id}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-foreground">
                    {formatAsNgnMoney(activePlan.amount)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Subscription amount</p>
                  {transaction?.status && (
                    <p className="text-xs capitalize text-muted-foreground mt-1">
                      Status: {transaction.status}
                    </p>
                  )}
                </div>
              </div>
              {isSubscribed && transaction && (
                <p className="mt-4 border-t pt-3 text-xs text-muted-foreground">
                  Last payment {formatDateTime(transaction.paid_at ?? transaction.created_at)}
                  {transaction.channel ? ` via ${transaction.channel}` : ""}
                </p>
              )}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed bg-muted/30 p-6 text-center">
              <Wallet className="h-10 w-10 stroke-1 text-muted-foreground/60 mx-auto mb-2" />
              <p className="font-semibold text-foreground">No subscription on record yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Pick a plan below to subscribe and unlock all CREN member services.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available plans */}
      <Card className="shadow-sm border-base-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Available Plans</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <PageLoader
            query={query}
            emptyState={{
              title: "No Plans Available",
              description: "There are no subscription plans configured at this time.",
            }}
          >
            {() =>
              plans.length === 0 ? (
                <div className="min-h-[20vh] flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                  <Wallet className="h-12 w-12 stroke-1 mb-3 text-muted-foreground/60" />
                  <p className="font-semibold text-lg text-foreground">No Plans Found</p>
                  <p className="text-sm max-w-sm mt-1">
                    No subscription plans are currently published for members.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {plans.map((plan, index) => {
                    // Compare against the current plan regardless of the subscribed flag so the
                    // active plan never offers a duplicate payment action.
                    const isCurrent =
                      activePlan !== null && String(activePlan.id) === String(plan.id);
                    const isVerifyingThis =
                      verifiedId !== null && String(verifiedId) === String(plan.id);
                    return (
                      <div
                        key={plan.id ?? index}
                        className={
                          isCurrent
                            ? "rounded-lg border-2 border-primary/40 bg-primary/[0.02] p-5 flex flex-col justify-between gap-4"
                            : "rounded-lg border bg-white p-5 flex flex-col justify-between gap-4 hover:shadow-md transition-shadow"
                        }
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="font-normal">
                              {plan.plan_name || plan.type || "Membership"}
                            </Badge>
                            {isCurrent && (
                              <Badge className="bg-emerald-100 text-emerald-800 border-transparent">
                                Current
                              </Badge>
                            )}
                          </div>
                          <p className="text-2xl font-bold text-foreground">
                            {formatAsNgnMoney(plan.amount)}
                          </p>
                          {plan.description && (
                            <p className="text-sm text-muted-foreground line-clamp-3">
                              {plan.description}
                            </p>
                          )}
                          {plan.bank && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                              <Landmark className="h-3.5 w-3.5" />
                              {plan.bank}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 pt-2">
                          {isCurrent ? (
                            <p className="flex items-center gap-1.5 text-sm font-medium text-emerald-700">
                              <BadgeCheck className="h-4 w-4" />
                              Your active plan
                            </p>
                          ) : (
                            <>
                              <PaystackPlanPay plan={plan} onVerify={handleVerifyPayment} />
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1.5 cursor-pointer"
                                disabled={isVerifyingThis}
                                onClick={() => {
                                  setSelectedPlan(plan);
                                  setReceiptOpen(true);
                                }}
                              >
                                <FiUploadCloud className="h-4 w-4" />
                                Upload Receipt
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            }
          </PageLoader>
        </CardContent>
      </Card>

      <Dialog
        open={receiptOpen}
        onOpenChange={(open: boolean) => {
          setReceiptOpen(open);
          if (!open) setSelectedPlan(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Subscription Receipt</DialogTitle>
            <DialogDescription>
              Paid via bank transfer? Upload your deposit slip so admins can confirm your
              subscription.
            </DialogDescription>
          </DialogHeader>
          <ManualReceiptForm
            plan={selectedPlan}
            refetch={refreshAll}
            close={() => {
              setReceiptOpen(false);
              setSelectedPlan(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionPage;
