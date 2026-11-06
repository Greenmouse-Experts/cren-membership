import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { Search, ShieldCheck } from "lucide-react";

import { formatAsNgnMoney } from "@/app/services/helpers";
import useGetHook from "@/app/hook/useGet";
import useModal from "@/app/hook/useModal";
import ConfirmDuesPayment from "@/app/admin/Dues/Dues/CofirmDues";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { MemberPaymentTransaction } from "@/types/api";

const statusBadgeClasses = (status: string): string => {
  switch (status) {
    case "success":
    case "confirmed":
      return "text-green-600";
    case "pending":
      return "text-orange-600";
    default:
      return "text-red-600";
  }
};

/** Formats "YYYY-MM-DD", "DD/MM/YYYY" or unix-ish strings safely. */
const formatDate = (value?: string | number | null): string => {
  if (!value) return "—";
  const parsed = dayjs(String(value));
  return parsed.isValid() ? parsed.format("DD/MM/YYYY") : "—";
};

const statusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    success: "Success",
    confirmed: "Confirmed",
    pending: "Pending",
    failed: "Failed",
  };
  return labels[status] ?? status;
};

const STATUS_OPTIONS = ["success", "pending", "failed", "confirmed"] as const;
const STATUS_ALL = "all";

const DuesPayments = () => {
  const query = useGetHook<MemberPaymentTransaction[]>("admin/dues/all/payments");
  const { Modal, setShowModal } = useModal();
  const [selected, setSelected] = useState<MemberPaymentTransaction | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>(STATUS_ALL);
  const [search, setSearch] = useState("");

  const payments = useMemo(() => {
    const all = query.data?.data ?? [];
    const term = search.trim().toLowerCase();
    return all.filter((item) => {
      const matchesStatus = statusFilter === STATUS_ALL ? true : item.status === statusFilter;
      const matchesSearch =
        !term ||
        item.ref_id?.toLowerCase().includes(term) ||
        item.user?.name_of_member_organization?.toLowerCase().includes(term) ||
        item.user?.name_of_representative?.toLowerCase().includes(term);
      return matchesStatus && matchesSearch;
    });
  }, [query.data, statusFilter, search]);

  const confirmModal = (item: MemberPaymentTransaction) => {
    setSelected(item);
    setShowModal(true);
  };

  return (
    <>
      <div className="mx-2 min-h-[70vh] rounded-md bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-[#075b2f]">Dues Payments</h1>
            <p className="mt-1 text-sm text-[#62705f]">
              Review and confirm dues payments made by members.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-64">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search payments..."
                className="pl-9"
                aria-label="Search dues payments"
              />
            </div>
            <Select onValueChange={setStatusFilter} value={statusFilter}>
              <SelectTrigger className="w-full sm:w-52" aria-label="Filter payments by status">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={STATUS_ALL}>All Payments</SelectItem>
                {STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {statusLabel(status)} Payments
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                {query.error instanceof Error ? query.error.message : ""} Failed to load dues
                payments. Please try again.
              </p>
              <Button
                variant="outline"
                onClick={() => query.refetch()}
                className="mt-4 border-[#015907] text-[#015907] hover:bg-[#015907]/5"
              >
                Try Again
              </Button>
            </div>
          ) : payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-[#075b2f] font-semibold">No payments found</p>
              <p className="mt-1 text-sm text-[#62705f]">
                {search || statusFilter
                  ? "Try a different search term or status filter."
                  : "Members' dues payments will appear here."}
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
                    <TableHead className="whitespace-nowrap px-4 py-3">Amount</TableHead>
                    <TableHead className="whitespace-nowrap px-4 py-3">Status</TableHead>
                    <TableHead className="whitespace-nowrap px-4 py-3">Channel</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((item, index) => (
                    <TableRow key={item.id ?? index}>
                      <TableCell className="whitespace-nowrap px-4 py-4">{index + 1}</TableCell>
                      <TableCell className="max-w-[220px] truncate px-4 py-4" title={item.ref_id}>
                        {item.ref_id}
                      </TableCell>
                      <TableCell className="whitespace-nowrap px-4 py-4">
                        <div className="flex flex-col">
                          <span>{item.user?.name_of_member_organization ?? "—"}</span>
                          {item.user?.name_of_representative && (
                            <span className="text-sm text-muted-foreground">
                              {item.user.name_of_representative}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap px-4 py-4">
                        {formatAsNgnMoney(Number(item.amount))}
                      </TableCell>
                      <TableCell className="whitespace-nowrap px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${statusBadgeClasses(item.status)}`}>
                            {statusLabel(item.status)}
                          </span>
                          {item.status === "pending" && (
                            <Button
                              variant="link"
                              size="sm"
                              onClick={() => confirmModal(item)}
                              className="h-auto p-0 text-[#015907] underline"
                            >
                              <ShieldCheck aria-hidden="true" className="size-4" />
                              Confirm
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap px-4 py-4">
                        {item.channel ?? "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      <Modal title="Update Payment Status" noHead={false}>
        <ConfirmDuesPayment
          item={selected}
          refetch={query.refetch}
          close={() => setShowModal(false)}
        />
      </Modal>
    </>
  );
};

export default DuesPayments;
