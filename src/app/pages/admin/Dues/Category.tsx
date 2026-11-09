import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

import useModal from "@/app/hook/useModal";
import useGetHook from "@/app/hook/useGet";
import usePostHook from "@/app/hook/usePost";
import ReusableModal from "@/app/components/ReusableModal";
import AddDuesCategory from "@/app/admin/Dues/Category/AddCategory";
import EditDuesCategory from "@/app/admin/Dues/Category/EditCategory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DueCategory } from "@/types/api";

const formatDate = (value?: string | number | null): string => {
  if (!value) return "—";
  const parsed = dayjs(String(value));
  return parsed.isValid() ? parsed.format("DD/MM/YYYY") : "—";
};

const statusBadgeVariant = (status?: DueCategory["status"]) => {
  switch (status) {
    case "Active":
      return "default";
    case "Pending":
      return "secondary";
    default:
      return "outline";
  }
};

const AdminDuesCategory = () => {
  const query = useGetHook<DueCategory[]>("admin/category");
  const { handlePost, isLoading: isDeleting } = usePostHook();

  const { Modal: Delete, setShowModal: setShowDelete } = useModal();
  const { Modal: Edit, setShowModal: setShowEdit } = useModal();
  const { Modal, setShowModal } = useModal();
  const [selected, setSelected] = useState<DueCategory | null>(null);
  const [search, setSearch] = useState("");

  const categories = query.data?.data ?? [];

  const filteredCategories = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return categories;
    return categories.filter((item) => {
      const name = item.name?.toLowerCase() ?? "";
      const status = item.status?.toLowerCase() ?? "";
      return name.includes(term) || status.includes(term);
    });
  }, [categories, search]);

  const openEdit = (item: DueCategory) => {
    setSelected(item);
    setShowEdit(true);
  };

  const openDelete = (item: DueCategory) => {
    setSelected(item);
    setShowDelete(true);
  };

  const onDeleted = () => {
    query.refetch();
    toast.success("Category deleted successfully");
    setShowDelete(false);
  };

  const handleDelete = () => {
    if (selected?.id === undefined || selected?.id === null || selected?.id === "") return;
    handlePost(
      "admin/category/delete",
      { category_id: selected.id },
      "application/json",
      onDeleted,
    );
  };

  return (
    <>
      <div className="mx-2 min-h-[70vh] rounded-md bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-[#075b2f]">Dues Category</h1>
            <p className="mt-1 text-sm text-[#62705f]">
              Add, edit and delete dues categories used by members for their payments.
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
                placeholder="Search categories..."
                className="pl-9"
                aria-label="Search dues categories"
              />
            </div>
            <Button onClick={() => setShowModal(true)} className="gap-2 bg-[#015907] text-white">
              <Plus aria-hidden="true" />
              Add Category
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
                {query.error instanceof Error ? query.error.message : ""} Failed to load categories.
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
          ) : filteredCategories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-[#075b2f] font-semibold">
                {search ? "No categories match your search" : "No categories yet"}
              </p>
              <p className="mt-1 text-sm text-[#62705f]">
                {search
                  ? "Try a different search term."
                  : "Click “Add Category” to create the first one."}
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-md border border-black/10">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#f7faf6] hover:bg-[#f7faf6]">
                    <TableHead className="whitespace-nowrap px-4 py-3">S/N</TableHead>
                    <TableHead className="whitespace-nowrap px-4 py-3">Category Name</TableHead>
                    <TableHead className="whitespace-nowrap px-4 py-3">Status</TableHead>
                    <TableHead className="whitespace-nowrap px-4 py-3">Created At</TableHead>
                    <TableHead className="whitespace-nowrap px-4 py-3">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map((item, index) => (
                    <TableRow key={item.id ?? index}>
                      <TableCell className="whitespace-nowrap px-4 py-4">{index + 1}</TableCell>
                      <TableCell className="whitespace-nowrap px-4 py-4">{item.name}</TableCell>
                      <TableCell className="whitespace-nowrap px-4 py-4">
                        <Badge variant={statusBadgeVariant(item.status)}>
                          {item.status ?? "—"}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap px-4 py-4">
                        {formatDate(item.created_at)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap px-4 py-4">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Edit ${item.name}`}
                            onClick={() => openEdit(item)}
                            className="text-[#015907] hover:bg-[#015907]/10 h-8 w-8"
                          >
                            <Pencil className="!size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Delete ${item.name}`}
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

      <Modal title="Add Category" noHead={false}>
        <AddDuesCategory close={() => setShowModal(false)} refetch={query.refetch} />
      </Modal>

      <Edit title={selected?.name} noHead={false}>
        <EditDuesCategory
          item={selected}
          close={() => setShowEdit(false)}
          refetch={query.refetch}
        />
      </Edit>

      <Delete title="" noHead>
        <ReusableModal
          title="Are you sure you want to delete this category?"
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

export default AdminDuesCategory;
