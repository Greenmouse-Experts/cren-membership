import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

import useModal from "@/app/hook/useModal";
import useGetHook from "@/app/hook/useGet";
import usePostHook from "@/app/hook/usePost";
import ReusableModal from "@/app/components/ReusableModal";
import AddBanksModal from "@/app/admin/Dues/Banks/AddBanks";
import EditBanksModal from "@/app/admin/Dues/Banks/EditBanks";
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
import type { BankDetails } from "@/types/api";

const formatDate = (value?: string | number | null): string => {
  if (!value) return "—";
  const parsed = dayjs(String(value));
  return parsed.isValid() ? parsed.format("DD/MM/YYYY") : "—";
};

const AdminBanks = () => {
  const query = useGetHook<BankDetails[]>("admin/banks");
  const { handlePost, isLoading: isDeleting } = usePostHook();

  const { Modal: Delete, setShowModal: setShowDelete } = useModal();
  const { Modal: Edit, setShowModal: setShowEdit } = useModal();
  const { Modal, setShowModal } = useModal();
  const [selected, setSelected] = useState<BankDetails | null>(null);
  const [search, setSearch] = useState("");

  const banks = query.data?.data ?? [];

  const filteredBanks = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return banks;
    return banks.filter((item) => {
      const bankName = item.bank_name?.toLowerCase() ?? "";
      const accountName = item.account_name?.toLowerCase() ?? "";
      const accountNumber = item.account_number?.toLowerCase() ?? "";
      return (
        bankName.includes(term) || accountName.includes(term) || accountNumber.includes(term)
      );
    });
  }, [banks, search]);

  const openEdit = (item: BankDetails) => {
    setSelected(item);
    setShowEdit(true);
  };

  const openDelete = (item: BankDetails) => {
    setSelected(item);
    setShowDelete(true);
  };

  const onDeleted = () => {
    query.refetch();
    toast.success("Bank account deleted successfully");
    setShowDelete(false);
  };

  const handleDelete = () => {
    if (selected?.id === undefined || selected?.id === null || selected?.id === "") return;
    handlePost("admin/bank/delete", { bank_id: selected.id }, "application/json", onDeleted);
  };

  return (
    <>
      <div className="mx-2 min-h-[70vh] rounded-md bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-[#075b2f]">Available Banks</h1>
            <p className="mt-1 text-sm text-[#62705f]">
              Add, edit and delete bank accounts used for collection of dues.
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
                placeholder="Search banks..."
                className="pl-9"
                aria-label="Search bank accounts"
              />
            </div>
            <Button
              onClick={() => setShowModal(true)}
              className="gap-2 bg-[#015907] text-white"
            >
              <Plus aria-hidden="true" />
              Add Bank Account
            </Button>
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
                {query.error instanceof Error ? query.error.message : ""} Failed to load bank
                accounts. Please try again.
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
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-[#075b2f] font-semibold">
                {search ? "No bank accounts match your search" : "No bank accounts yet"}
              </p>
              <p className="mt-1 text-sm text-[#62705f]">
                {search
                  ? "Try a different search term."
                  : "Click “Add Bank Account” to create the first one."}
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-md border border-black/10">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#f7faf6] hover:bg-[#f7faf6]">
                    <TableHead className="whitespace-nowrap px-4 py-3">S/N</TableHead>
                    <TableHead className="whitespace-nowrap px-4 py-3">Bank Name</TableHead>
                    <TableHead className="whitespace-nowrap px-4 py-3">Account Name</TableHead>
                    <TableHead className="whitespace-nowrap px-4 py-3">Account Number</TableHead>
                    <TableHead className="whitespace-nowrap px-4 py-3">Created At</TableHead>
                    <TableHead className="whitespace-nowrap px-4 py-3">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBanks.map((item, index) => (
                    <TableRow key={item.id ?? index}>
                      <TableCell className="whitespace-nowrap px-4 py-4">{index + 1}</TableCell>
                      <TableCell className="whitespace-nowrap px-4 py-4">
                        {item.bank_name ?? "—"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap px-4 py-4">
                        {item.account_name ?? "—"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap px-4 py-4">
                        {item.account_number ?? "—"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap px-4 py-4">
                        {formatDate(item.created_at)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap px-4 py-4">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Edit ${item.bank_name ?? "bank account"}`}
                            onClick={() => openEdit(item)}
                            className="text-[#015907] hover:bg-[#015907]/10 h-8 w-8"
                          >
                            <Pencil className="!size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Delete ${item.bank_name ?? "bank account"}`}
                            onClick={() => openDelete(item)}
                            className="h-8 w-8 text-red-600 hover:bg-red-600/10"
                          >
                            <Trash2 className="!size-4" />
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

      <Modal title="Add Bank Account" noHead={false}>
        <AddBanksModal close={() => setShowModal(false)} refetch={query.refetch} />
      </Modal>

      <Edit title={selected?.account_name} noHead={false}>
        <EditBanksModal item={selected} close={() => setShowEdit(false)} refetch={query.refetch} />
      </Edit>

      <Delete title="" noHead>
        <ReusableModal
          title="Are you sure you want to delete this account?"
          cancelTitle="No, cancel"
          actionTitle="Yes, delete"
          closeModal={() => setShowDelete(false)}
          action={handleDelete}
          isBusy={isDeleting}
        />
      </Delete>
    </>
  );
};

export default AdminBanks;
