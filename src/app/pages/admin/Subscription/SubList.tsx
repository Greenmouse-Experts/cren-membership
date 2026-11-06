import { useMemo, useState } from "react";
import {
  Banknote,
  Building2,
  CheckCircle2,
  CreditCard,
  Pencil,
  Plus,
  Repeat,
  Search,
} from "lucide-react";

import useGetHook from "@/app/hook/useGet";
import { formatAsNgnMoney } from "@/app/services/helpers";
import SubscriptionModal from "@/app/admin/Subscription/SubscriptionModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { SubscriptionItem } from "@/types/api";

export default function AdminSubscriptionList() {
  const query = useGetHook<SubscriptionItem[] | SubscriptionItem>("admin/subscription");

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<SubscriptionItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Normalize API data which could be an array, a single object, or undefined
  const subscriptions = useMemo<SubscriptionItem[]>(() => {
    const raw = query.data?.data;
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    if (typeof raw === "object") {
      const candidate = raw as Partial<SubscriptionItem>;
      if (
        candidate.id !== undefined ||
        candidate.amount !== undefined ||
        candidate.type ||
        candidate.bank
      ) {
        return [candidate as SubscriptionItem];
      }
    }
    return [];
  }, [query.data]);

  const filteredSubscriptions = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return subscriptions;
    return subscriptions.filter((sub) => {
      const type = (sub.type ?? "").toLowerCase();
      const bank = (sub.bank ?? "").toLowerCase();
      const desc = (sub.description ?? "").toLowerCase();
      return type.includes(term) || bank.includes(term) || desc.includes(term);
    });
  }, [subscriptions, search]);

  const handleOpenAdd = () => {
    setSelected(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: SubscriptionItem) => {
    setSelected(item);
    setIsModalOpen(true);
  };

  return (
    <div className="mx-2 min-h-[75vh] space-y-6">
      {/* Top Banner & Info Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-black/5 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Configured Plans
            </CardTitle>
            <Repeat className="h-4 w-4 text-[#075b2f]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{subscriptions.length}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Active membership tiers and fee schedules
            </p>
          </CardContent>
        </Card>

        <Card className="border-black/5 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Billing Currency
            </CardTitle>
            <Banknote className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">NGN (₦)</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Standard local currency for member onboarding
            </p>
          </CardContent>
        </Card>

        <Card className="border-black/5 shadow-sm sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Payment Gateway
            </CardTitle>
            <CreditCard className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">Bank Transfer / Paystack</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Integrated online verification and receipt upload
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <div className="rounded-xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#075b2f]/10 text-[#075b2f]">
                <Repeat className="h-5 w-5" />
              </span>
              <h1 className="text-xl font-semibold tracking-tight text-[#075b2f] sm:text-2xl">
                Subscription Plans
              </h1>
            </div>
            <p className="mt-1 text-sm text-[#62705f]">
              Configure membership tiers, subscription fees, and bank destinations for member
              registration.
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
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search plans or banks..."
                className="pl-9"
                aria-label="Search plans"
              />
            </div>
            <Button
              onClick={handleOpenAdd}
              className="gap-2 bg-[#015907] text-white hover:bg-[#015907]/90 shadow-sm"
            >
              <Plus className="size-4" />
              Set Subscription Plan
            </Button>
          </div>
        </div>

        {/* Content Table / States */}
        <div className="mt-6">
          {query.isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-14 w-full" />
              ))}
            </div>
          ) : query.isError ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="font-semibold text-[#075b2f]">Unable to load subscription plans</p>
              <p className="mt-1 text-sm text-[#62705f]">
                {query.error instanceof Error ? query.error.message : "A network error occurred."}{" "}
                Please try again.
              </p>
              <Button
                variant="outline"
                onClick={() => query.refetch()}
                className="mt-4 border-[#015907] text-[#015907] hover:bg-[#015907]/5"
              >
                Try Again
              </Button>
            </div>
          ) : filteredSubscriptions.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-[#075b2f]">
                <Repeat className="h-6 w-6" />
              </div>
              <p className="mt-3 font-semibold text-[#075b2f]">
                {search
                  ? "No subscription plans match your search"
                  : "No subscription plans configured yet"}
              </p>
              <p className="mt-1 max-w-md text-sm text-[#62705f]">
                {search
                  ? "Try checking for typos or searching by another keyword."
                  : "Set your initial membership subscription fee and designated bank account for members."}
              </p>
              {!search && (
                <Button
                  onClick={handleOpenAdd}
                  className="mt-4 gap-2 bg-[#015907] text-white hover:bg-[#015907]/90"
                >
                  <Plus className="size-4" />
                  Set Subscription Plan
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-black/10">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#f7faf6] hover:bg-[#f7faf6]">
                    <TableHead className="w-16 whitespace-nowrap px-4 py-3 font-semibold">
                      S/N
                    </TableHead>
                    <TableHead className="whitespace-nowrap px-4 py-3 font-semibold">
                      Plan / Membership Tier
                    </TableHead>
                    <TableHead className="whitespace-nowrap px-4 py-3 font-semibold">
                      Amount
                    </TableHead>
                    <TableHead className="whitespace-nowrap px-4 py-3 font-semibold">
                      Bank Destination
                    </TableHead>
                    <TableHead className="whitespace-nowrap px-4 py-3 font-semibold">
                      Description
                    </TableHead>
                    <TableHead className="whitespace-nowrap px-4 py-3 font-semibold">
                      Status
                    </TableHead>
                    <TableHead className="whitespace-nowrap px-4 py-3 text-right font-semibold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscriptions.map((item, index) => (
                    <TableRow key={item.id ?? index} className="hover:bg-gray-50/60">
                      <TableCell className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                        {index + 1}
                      </TableCell>
                      <TableCell className="whitespace-nowrap px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#075b2f]/10 text-[#075b2f]">
                            <Building2 className="h-4 w-4" />
                          </span>
                          <span className="font-semibold text-gray-900">
                            {item.type || "General Membership"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap px-4 py-4">
                        <span className="text-base font-bold text-[#075b2f]">
                          {formatAsNgnMoney(Number(item.amount || 0))}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-[320px] px-4 py-4">
                        <p className="line-clamp-2 text-sm text-gray-700">{item.bank || "—"}</p>
                      </TableCell>
                      <TableCell className="max-w-[240px] px-4 py-4 text-sm text-gray-500">
                        {item.description || "—"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap px-4 py-4">
                        <Badge
                          variant="outline"
                          className="border-emerald-200 bg-emerald-50 text-emerald-700 font-medium"
                        >
                          {item.status || "Active"}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap px-4 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1.5 text-[#015907] hover:bg-[#015907]/10"
                          onClick={() => handleOpenEdit(item)}
                        >
                          <Pencil className="size-3.5" />
                          Edit Plan
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {/* Subscription Modal for Add / Edit */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[#075b2f]">
              {selected ? "Edit Subscription Plan" : "Set Subscription Plan"}
            </DialogTitle>
            <DialogDescription>
              {selected
                ? "Update subscription fee and payment details for this membership plan."
                : "Configure a new membership tier subscription and destination bank account."}
            </DialogDescription>
          </DialogHeader>
          <SubscriptionModal
            item={selected}
            close={() => {
              setIsModalOpen(false);
              setSelected(null);
            }}
            refetch={() => query.refetch()}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
