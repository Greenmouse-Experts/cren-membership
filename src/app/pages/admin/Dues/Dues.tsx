import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

import useModal from "@/app/hook/useModal";
import useGetHook from "@/app/hook/useGet";
import usePostHook from "@/app/hook/usePost";
import ReusableModal from "@/app/components/ReusableModal";
import AddDues from "@/app/admin/Dues/Dues/AddDues";
import EditDues from "@/app/admin/Dues/Dues/EditDues";
import { formatAsNgnMoney } from "@/app/services/helpers";
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
import type { DueItem } from "@/types/api";

/** Formats "DD/MM/YYYY" (or anything dayjs understands) into a readable date. */
const formatDate = (value?: string | number | null): string => {
  if (!value) return "—";
  const parsed = String(value).includes("/")
    ? dayjs(String(value).split("/").reverse().join("-"))
    : dayjs(String(value));
  return parsed.isValid() ? parsed.format("DD MMM YYYY") : String(value);
};

const statusBadgeVariant = (status?: string) => {
  switch (status) {
    case "Active":
      return "default";
    case "Pending":
      return "secondary";
    default:
      return "outline";
  }
};

const AdminDues = () => {
  const query = useGetHook<DueItem[]>("admin/dues");
  const { handlePost, isLoading: isDeleting } = usePostHook();

  const { Modal: Delete, setShowModal: setShowDelete } = useModal();
  const { Modal: Edit, setShowModal: setShowEdit } = useModal();
  const { Modal, setShowModal } = useModal();
  const [selected, setSelected] = useState<DueItem | null>(null);
  const [search, setSearch] = useState("");

  const dues = query.data?.data ?? [];

  const filteredDues = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return dues;
    return dues.filter((item) => {
      const description = item.description?.toLowerCase() ?? "";
      const category = (item.category?.name ?? item.payment_category?.name ?? "").toLowerCase();
      return description.includes(term) || category.includes(term);
    });
  }, [dues, search]);

  const openEdit = (item: DueItem) => {
    setSelected(item);
    setShowEdit(true);
  };

  const openDelete = (item: DueItem) => {
    setSelected(item);
    setShowDelete(true);
  };

  const onDeleted = () => {
    query.refetch();
    toast.success("Dues deleted successfully");
    setShowDelete(false);
  };

  const handleDelete = () => {
    if (!selected?.id) return;
    handlePost("admin/dues/delete", { due_id: selected.id }, "application/json", onDeleted);
  };

  return (
    <>
      <div className="mx-2 min-h-[70vh] rounded-md bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-[#075b2f]">Dues</h1>
            <p className="mt-1 text-sm text-[#62705f]">
              Add, edit and delete dues information for members.
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
                placeholder="Search dues..."
                className="pl-9"
                aria-label="Search dues"
              />
            </div>
            <Button onClick={() => setShowModal(true)} className="gap-2 bg-[#015907] text-white">
              <Plus aria-hidden="true" />
              Add Dues
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
                {query.error instanceof Error ? query.error.message : ""} Failed to load dues.
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
          ) : filteredDues.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="font-semibold text-[#075b2f]">
                {search ? "No dues match your search" : "No dues yet"}
              </p>
              <p className="mt-1 text-sm text-[#62705f]">
                {search
                  ? "Try a different search term."
                  : "Click “Add Dues” to create the first dues entry."}
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-md border border-black/10">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#f7faf6] hover:bg-[#f7faf6]">
                    <TableHead className="whitespace-nowrap px-4 py-3">S/N</TableHead>
                    <TableHead className="whitespace-nowrap px-4 py-3">Description</TableHead>
                    <TableHead className="whitespace-nowrap px-4 py-3">Category</TableHead>
                    <TableHead className="whitespace-nowrap px-4 py-3">Amount</TableHead>
                    <TableHead className="whitespace-nowrap px-4 py-3">Start Date</TableHead>
                    <TableHead className="whitespace-nowrap px-4 py-3">End Date</TableHead>
                    <TableHead className="whitespace-nowrap px-4 py-3">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDues.map((item, index) => (
                    <TableRow key={item.id ?? index}>
                      <TableCell className="whitespace-nowrap px-4 py-4">{index + 1}</TableCell>
                      <TableCell className="max-w-[280px] px-4 py-4">{item.description}</TableCell>
                      <TableCell className="whitespace-nowrap px-4 py-4">
                        <Badge variant="outline" className="border-[#015907]/20 text-[#015907]">
                          {item.category?.name ?? item.payment_category?.name ?? "—"}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap px-4 py-4">
                        {formatAsNgnMoney(Number(item.amount))}
                      </TableCell>
                      <TableCell className="whitespace-nowrap px-4 py-4">
                        {formatDate(item.start_date)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap px-4 py-4">
                        {formatDate(item.end_date)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap px-4 py-4">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Edit ${item.description}`}
                            onClick={() => openEdit(item)}
                            className="h-8 w-8 text-[#015907] hover:bg-[#015907]/10"
                          >
                            <Pencil className="!size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Delete ${item.description}`}
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

      <Modal title="Add Dues" noHead={false}>
        <AddDues close={() => setShowModal(false)} refetch={query.refetch} />
      </Modal>

      <Edit title={selected?.description} noHead={false}>
        <EditDues item={selected} close={() => setShowEdit(false)} refetch={query.refetch} />
      </Edit>

      <Delete title="" noHead>
        <ReusableModal
          title="Are you sure you want to delete this due?"
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

export default AdminDues;
