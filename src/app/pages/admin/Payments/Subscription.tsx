import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { Eye, Search, ShieldCheck } from "lucide-react";
import { toast } from "react-toastify";

import { formatAsNgnMoney } from "@/app/services/helpers";
import useGetHook from "@/app/hook/useGet";
import useModal from "@/app/hook/useModal";
import usePostHook from "@/app/hook/usePost";
import ReusableModal from "@/app/components/ReusableModal";
import ReceiptModal from "./ReceiptModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { MemberPaymentTransaction } from "@/types/api";

const statusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    success: "Success",
    confirmed: "Confirmed",
    pending: "Pending",
    failed: "Failed",
  };
  return labels[status] ?? status;
};

const statusBadgeClasses = (status: string): string => {
  switch (status) {
    case "success":
    case "confirmed":
      return "text-green-600";
    case "pending":
      return "text-yellow-600";
    default:
      return "text-red-600";
  }
};

const statusBadgeBg = (status: string): string => {
  switch (status) {
    case "success":
    case "confirmed":
      return "bg-green-600/10";
    case "pending":
      return "bg-yellow-600/10";
    default:
      return "bg-red-600/10";
  }
};

const formatDate = (value?: string | number | null): string => {
  if (!value) return "—";
  const parsed = dayjs(String(value));
  return parsed.isValid() ? parsed.format("DD/MM/YYYY") : "—";
};

/**
 * Subscription transactions return the member under `payer`; older payloads used `user`.
 * Fall back so both shapes render.
 */
const payerOf = (item: MemberPaymentTransaction) => item.payer ?? item.user ?? null;

/** Display name for the payer row. */
const payerName = (item: MemberPaymentTransaction): string => {
  const payer = payerOf(item);
  if (!payer) return "—";
  return (
    payer.name_of_member_organization ||
    payer.name_of_representative ||
    `${payer.first_name ?? ""} ${payer.last_name ?? ""}`.trim() ||
    payer.email ||
    "—"
  );
};

const SubscriptionPayments = () => {
  const query = useGetHook<MemberPaymentTransaction[]>("admin/get/subscription/transactions");
  const { handlePost, isLoading: isBusy } = usePostHook();
  const { Modal: Verify, setShowModal: setShowVerify } = useModal();

  const [selected, setSelected] = useState<MemberPaymentTransaction | null>(null);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const transactions = useMemo(() => {
    const all = query.data?.data ?? [];
    const term = search.trim().toLowerCase();
    if (!term) return all;
    return all.filter((item) => {
      const payer = payerOf(item);
      return Boolean(
        item.ref_id?.toLowerCase().includes(term) ||
        payer?.name_of_member_organization?.toLowerCase().includes(term) ||
        payer?.name_of_representative?.toLowerCase().includes(term) ||
        payer?.email?.toLowerCase().includes(term) ||
        payer?.membership_id?.toLowerCase().includes(term) ||
        payer?.account_type?.toLowerCase().includes(term),
      );
    });
  }, [query.data, search]);

  const handleView = (image?: string | null) => {
    if (!image) {
      toast.info("No receipt uploaded for this transaction.");
      return;
    }
    setReceiptUrl(image);
  };

  const openVerify = (item: MemberPaymentTransaction) => {
    setSelected(item);
    setShowVerify(true);
  };

  const onSuccess = () => {
    toast.success("Member subscription verified successfully");
    query.refetch();
    setShowVerify(false);
  };

  const handleVerify = () => {
    const userId = selected?.payer?.id ?? selected?.user_id;
    if (userId === undefined || userId === null) {
      toast.error("This transaction has no member attached to verify.");
      return;
    }
    handlePost(
      "admin/member/subscribe",
      { user_id: Number(userId) },
      "application/json",
      onSuccess,
    );
  };

  return (
    <>
      <div className="mx-2 min-h-[70vh] rounded-md bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-[#075b2f]">Subscription Payments</h1>
            <p className="mt-1 text-sm text-[#62705f]">
              Verify members' manual subscription payments by reviewing their receipts.
            </p>
          </div>
          <div className="relative w-full sm:w-80">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search subscription payments..."
              className="pl-9"
              aria-label="Search subscription payments"
            />
          </div>
        </div>

        <div className="mt-6">
          {query.isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-12 w-full" />
              ))}
            </div>
          ) : query.isError ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="font-semibold text-[#075b2f]">Something went wrong</p>
              <p className="mt-1 text-sm text-[#62705f]">
                {query.error instanceof Error ? query.error.message : ""} Failed to load
                subscription transactions. Please try again.
              </p>
              <Button
                variant="outline"
                onClick={() => query.refetch()}
                className="mt-4 border-[#015907] text-[#015907] hover:bg-[#015907]/5"
              >
                Try Again
              </Button>
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-[#075b2f] font-semibold">
                {search ? "No transactions match your search" : "No subscription payments yet"}
              </p>
              <p className="mt-1 text-sm text-[#62705f]">
                {search ? "Try a different search term." : "Members' payments will appear here."}
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-md border border-black/10">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#f7faf6] hover:bg-[#f7faf6]">
                    <TableHead className="whitespace-nowrap px-4 py-3">S/N</TableHead>
                    <TableHead className="whitespace-nowrap px-4 py-3">Reference ID</TableHead>
                    <TableHead className="whitespace-nowrap px-4 py-3">Paid By</TableHead>
                    <TableHead className="whitespace-nowrap px-4 py-3">Account Type</TableHead>
                    <TableHead className="whitespace-nowrap px-4 py-3">Amount</TableHead>
                    <TableHead className="whitespace-nowrap px-4 py-3">Status</TableHead>
                    <TableHead className="whitespace-nowrap px-4 py-3">Date</TableHead>
                    <TableHead className="whitespace-nowrap px-4 py-3">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((item, index) => {
                    const payer = payerOf(item);
                    const name = payerName(item);
                    return (
                      <TableRow key={item.id ?? index}>
                        <TableCell className="whitespace-nowrap px-4 py-4">{index + 1}</TableCell>
                        <TableCell className="max-w-[220px] truncate px-4 py-4" title={item.ref_id}>
                          {item.ref_id}
                        </TableCell>
                        <TableCell className="whitespace-nowrap px-4 py-4">
                          <div className="flex flex-col">
                            <span>{name}</span>
                            {payer?.name_of_representative &&
                              payer.name_of_representative !== name && (
                                <span className="text-sm text-muted-foreground">
                                  {payer.name_of_representative}
                                </span>
                              )}
                            {payer?.membership_id && (
                              <span className="text-xs text-muted-foreground">
                                {payer.membership_id}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap px-4 py-4">
                          {payer?.account_type ?? "—"}
                        </TableCell>
                        <TableCell className="whitespace-nowrap px-4 py-4">
                          {formatAsNgnMoney(Number(item.amount))}
                        </TableCell>
                        <TableCell className="whitespace-nowrap px-4 py-4">
                          <span
                            className={`rounded-md px-2 py-0.5 text-xs font-semibold capitalize ${statusBadgeClasses(item.status)} ${statusBadgeBg(item.status)}`}
                          >
                            {statusLabel(item.status)}
                          </span>
                        </TableCell>
                        <TableCell className="whitespace-nowrap px-4 py-4">
                          {formatDate(item.paid_at ?? item.created_at)}
                        </TableCell>
                        <TableCell className="whitespace-nowrap px-4 py-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="View receipt"
                              onClick={() => handleView(item.receipt)}
                              className="h-8 w-8 text-blue-700 hover:bg-blue-700/10"
                            >
                              <Eye className="!size-4" />
                            </Button>
                            <Button
                              variant="link"
                              size="sm"
                              onClick={() => openVerify(item)}
                              className="h-auto gap-1 p-0 text-[#015907]"
                            >
                              <ShieldCheck aria-hidden="true" className="size-4" />
                              Verify
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {receiptUrl && <ReceiptModal item={receiptUrl} close={() => setReceiptUrl(null)} />}

      <Verify title="" noHead>
        <ReusableModal
          title="Are you sure you want to verify this transaction?"
          cancelTitle="No, cancel"
          actionTitle="Yes, verify"
          closeModal={() => setShowVerify(false)}
          action={handleVerify}
          isBusy={isBusy}
        />
      </Verify>
    </>
  );
};

export default SubscriptionPayments;
