import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { Check, Copy, Landmark, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

import useGetHook from "@/app/hook/useGet";
import usePostHook from "@/app/hook/usePost";
import AddBanksModal from "@/app/admin/Dues/Banks/AddBanks";
import EditBanksModal from "@/app/admin/Dues/Banks/EditBanks";
import { Badge } from "@/components/ui/badge";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { BankAccount } from "@/types/api";

const formatDate = (value?: string | number | null): string => {
  if (!value) return "—";
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format("DD MMM YYYY") : String(value);
};

export default function AdminSubscriptionBanks() {
  const query = useGetHook<BankAccount[]>("admin/banks");
  const { handlePost, isLoading: isDeleting } = usePostHook();

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<BankAccount | null>(null);
  const [copiedId, setCopiedId] = useState<string | number | null>(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const banks = useMemo(() => query.data?.data ?? [], [query.data]);

  const filteredBanks = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return banks;
    return banks.filter((b) => {
      const bankName = (b.bank_name ?? "").toLowerCase();
      const accountName = (b.account_name ?? "").toLowerCase();
      const accountNumber = (b.account_number ?? "").toLowerCase();
      return bankName.includes(term) || accountName.includes(term) || accountNumber.includes(term);
    });
  }, [banks, search]);

  const openEdit = (item: BankAccount) => {
    setSelected(item);
    setIsEditOpen(true);
  };

  const openDelete = (item: BankAccount) => {
    setSelected(item);
    setIsDeleteOpen(true);
  };

  const copyAccountNumber = (accNo: string, id: string | number) => {
    navigator.clipboard.writeText(accNo);
    setCopiedId(id);
    toast.success("Account number copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const onDeleted = () => {
    query.refetch();
    toast.success("Bank account deleted successfully");
    setIsDeleteOpen(false);
    setSelected(null);
  };

  const handleDelete = () => {
    if (!selected?.id) return;
    handlePost("admin/bank/delete", { bank_id: selected.id }, "application/json", onDeleted);
  };

  return (
    <div className="mx-2 min-h-[75vh] space-y-6">
      {/* Top Header Card */}
      <div className="rounded-xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#075b2f]/10 text-[#075b2f]">
                <Landmark className="h-5 w-5" />
              </span>
              <h1 className="text-xl font-semibold tracking-tight text-[#075b2f] sm:text-2xl">
                Subscription Banks
              </h1>
            </div>
            <p className="mt-1 text-sm text-[#62705f]">
              Add, edit and manage bank accounts used for receiving subscription payments from CREN
              members.
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
                placeholder="Search by bank or account..."
                className="pl-9"
                aria-label="Search bank accounts"
              />
            </div>
            <Button
              onClick={() => setIsAddOpen(true)}
              className="gap-2 bg-[#015907] text-white hover:bg-[#015907]/90 shadow-sm"
            >
              <Plus className="size-4" />
              Add Bank Account
            </Button>
          </div>
        </div>

        {/* Content Table / States */}
        <div className="mt-6">
          {query.isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-14 w-full" />
              ))}
            </div>
          ) : query.isError ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="font-semibold text-[#075b2f]">Unable to load bank accounts</p>
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
          ) : filteredBanks.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-[#075b2f]">
                <Landmark className="h-6 w-6" />
              </div>
              <p className="mt-3 font-semibold text-[#075b2f]">
                {search ? "No bank accounts match your search" : "No bank accounts registered yet"}
              </p>
              <p className="mt-1 max-w-sm text-sm text-[#62705f]">
                {search
                  ? "Try checking for typos or searching by another keyword."
                  : "Add your first bank account to enable manual bank transfers for membership subscriptions."}
              </p>
              {!search && (
                <Button
                  onClick={() => setIsAddOpen(true)}
                  className="mt-4 gap-2 bg-[#015907] text-white hover:bg-[#015907]/90"
                >
                  <Plus className="size-4" />
                  Add Bank Account
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
                      Bank Name
                    </TableHead>
                    <TableHead className="whitespace-nowrap px-4 py-3 font-semibold">
                      Account Name
                    </TableHead>
                    <TableHead className="whitespace-nowrap px-4 py-3 font-semibold">
                      Account Number
                    </TableHead>
                    <TableHead className="whitespace-nowrap px-4 py-3 font-semibold">
                      Status
                    </TableHead>
                    <TableHead className="whitespace-nowrap px-4 py-3 font-semibold">
                      Date Added
                    </TableHead>
                    <TableHead className="whitespace-nowrap px-4 py-3 text-right font-semibold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBanks.map((item, index) => (
                    <TableRow key={item.id ?? index} className="hover:bg-gray-50/60">
                      <TableCell className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                        {index + 1}
                      </TableCell>
                      <TableCell className="whitespace-nowrap px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#075b2f]/10 text-[#075b2f]">
                            <Landmark className="h-4 w-4" />
                          </span>
                          <span className="font-medium text-gray-900">{item.bank_name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-700">
                        {item.account_name}
                      </TableCell>
                      <TableCell className="whitespace-nowrap px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm tracking-wider text-gray-900">
                            {item.account_number}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-gray-400 hover:text-gray-700"
                            title="Copy account number"
                            onClick={() => copyAccountNumber(item.account_number, item.id)}
                          >
                            {copiedId === item.id ? (
                              <Check className="size-3.5 text-green-600" />
                            ) : (
                              <Copy className="size-3.5" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap px-4 py-4">
                        <Badge
                          variant="outline"
                          className="border-emerald-200 bg-emerald-50 text-emerald-700 font-medium"
                        >
                          {item.status || "Active"}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                        {formatDate(item.created_at)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Edit ${item.bank_name}`}
                            onClick={() => openEdit(item)}
                            className="h-8 w-8 text-[#015907] hover:bg-[#015907]/10"
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Delete ${item.bank_name}`}
                            onClick={() => openDelete(item)}
                            className="h-8 w-8 text-red-600 hover:bg-red-600/10"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {/* Add Bank Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#075b2f]">Add Bank Account</DialogTitle>
            <DialogDescription>
              Enter the bank information where members can transfer subscription payments.
            </DialogDescription>
          </DialogHeader>
          <AddBanksModal close={() => setIsAddOpen(false)} refetch={() => query.refetch()} />
        </DialogContent>
      </Dialog>

      {/* Edit Bank Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#075b2f]">Edit Bank Account</DialogTitle>
            <DialogDescription>
              Update bank account details used for member subscriptions.
            </DialogDescription>
          </DialogHeader>
          <EditBanksModal
            item={selected}
            close={() => {
              setIsEditOpen(false);
              setSelected(null);
            }}
            refetch={() => query.refetch()}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this bank account?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove {selected?.bank_name} ({selected?.account_number}) from the list of
              available bank accounts for subscription collections.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Yes, delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
