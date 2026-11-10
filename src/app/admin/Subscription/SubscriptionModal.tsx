import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";

import useGetHook from "@/app/hook/useGet";
import usePostHook from "@/app/hook/usePost";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import type { BankAccount, SubscriptionItem } from "@/types/api";

const subscriptionFormSchema = z.object({
  plan_name: z.string().min(1, "Plan / Membership Tier is required."),
  amount: z.coerce
    .number({ invalid_type_error: "Amount is required." })
    .positive("Amount must be greater than zero."),
  bank: z.string().min(1, "Bank destination is required."),
  description: z.string().optional(),
});

export type SubscriptionFormValues = z.infer<typeof subscriptionFormSchema>;

interface SubscriptionModalProps {
  item?: SubscriptionItem | null;
  close: () => void;
  refetch: () => void;
}

/** Values posted to `POST /admin/subscription` (create) and `POST /admin/subscription/update` (edit). */
interface SubscriptionPayload {
  amount: number;
  bank: string;
  plan_name: string;
  description?: string;
  subscription_id?: number | string;
}
const COMMON_MEMBERSHIP_TIERS = [
  "Annual Subscription",
  "Individual Member",
  "Associate Member",
  "Corporate Member",
  "Fellow",
  "Student Member",
  "Partner",
];

export default function SubscriptionModal({ item, close, refetch }: SubscriptionModalProps) {
  const { handlePost } = usePostHook();
  const banksQuery = useGetHook<BankAccount[]>("admin/banks");
  const banks = banksQuery.data?.data ?? [];

  const isEditing = Boolean(item?.id);

  const form = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionFormSchema),
    defaultValues: {
      plan_name: item?.plan_name ?? item?.type ?? "",
      amount: item?.amount ? Number(item.amount) : ("" as unknown as number),
      bank: item?.bank ?? "",
      description: item?.description ?? "",
    },
  });

  useEffect(() => {
    if (item) {
      form.reset({
        plan_name: item.plan_name ?? item.type ?? "",
        amount: item.amount ? Number(item.amount) : ("" as unknown as number),
        bank: item.bank ?? "",
        description: item.description ?? "",
      });
    } else {
      form.reset({
        plan_name: "",
        amount: "" as unknown as number,
        bank: "",
        description: "",
      });
    }
  }, [item, form]);

  const onSuccess = () => {
    toast.success(
      isEditing ? "Subscription plan updated successfully" : "Subscription plan saved successfully",
    );
    refetch();
    close();
  };

  const onSubmit = (values: SubscriptionFormValues) => {
    const payload: SubscriptionPayload = {
      amount: values.amount,
      bank: values.bank,
      plan_name: values.plan_name,
      ...(values.description ? { description: values.description } : {}),
    };

    // Edits go to the dedicated update endpoint; creates go to the base endpoint.
    handlePost(
      isEditing ? "admin/subscription/update" : "admin/subscription",
      isEditing ? { ...payload, subscription_id: item?.id } : payload,
      "application/json",
      onSuccess,
    );
  };

  const handleBankSelect = (bankId: string) => {
    const selectedBank = banks.find((b) => String(b.id) === bankId);
    if (selectedBank) {
      const formatted = `${selectedBank.bank_name} - ${selectedBank.account_number} (${selectedBank.account_name})`;
      form.setValue("bank", formatted, { shouldValidate: true, shouldDirty: true });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="plan_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plan / Membership Tier</FormLabel>
              <div className="space-y-2">
                <FormControl>
                  <Input placeholder="e.g. Annual Subscription or Corporate Member" {...field} />
                </FormControl>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {COMMON_MEMBERSHIP_TIERS.map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => field.onChange(tier)}
                      className={`text-[11px] px-2 py-0.5 rounded-full border transition-colors ${
                        field.value === tier
                          ? "bg-[#015907] text-white border-[#015907]"
                          : "border-gray-200 text-gray-600 hover:border-[#015907] hover:text-[#015907]"
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount (NGN)</FormLabel>
              <FormControl>
                <Input type="number" inputMode="decimal" placeholder="e.g. 50000" {...field} />
              </FormControl>
              <FormDescription className="text-xs">
                Enter the subscription fee in Nigerian Naira (₦).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bank"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Bank Details for Payment</FormLabel>
                {banks.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    Select from active banks or type below
                  </span>
                )}
              </div>

              {banks.length > 0 && (
                <Select onValueChange={handleBankSelect}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose from registered bank accounts" />
                  </SelectTrigger>
                  <SelectContent>
                    {banks.map((b) => (
                      <SelectItem key={String(b.id)} value={String(b.id)}>
                        {b.bank_name} - {b.account_number} ({b.account_name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <FormControl>
                <Textarea
                  placeholder="e.g. Zenith Bank - 1029384756 (Council for Renewable Energy Nigeria)"
                  className="resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description / Notes (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Optional brief description of this plan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-3">
          <Button
            type="button"
            variant="outline"
            onClick={close}
            disabled={form.formState.isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="bg-[#015907] text-white hover:bg-[#015907]/90 min-w-28"
          >
            {form.formState.isSubmitting
              ? isEditing
                ? "Saving..."
                : "Adding..."
              : isEditing
                ? "Save Changes"
                : "Create Plan"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
