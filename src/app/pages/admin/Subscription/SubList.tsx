import { useState } from "react";
import { Pencil, Plus } from "lucide-react";

import useModal from "@/app/hook/useModal";
import useGetHook from "@/app/hook/useGet";
import AddSubscription from "@/app/admin/Subscription/AddSubscription";
import EditSubModal from "@/app/admin/Payments/EditSub";
import { formatAsNgnMoney } from "@/app/services/helpers";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { SubscriptionItem } from "@/types/api";

const AdminSubList = () => {
  const query = useGetHook<SubscriptionItem[]>("admin/subscription");

  const { Modal, setShowModal } = useModal();
  const { Modal: Edit, setShowModal: setShowEdit } = useModal();
  const [selected, setSelected] = useState<SubscriptionItem | null>(null);

  const subscriptions = query.data?.data ?? [];

  const openEdit = (item: SubscriptionItem) => {
    setSelected(item);
    setShowEdit(true);
  };

  return (
    <>
      <div className="mx-2 min-h-[70vh] rounded-md bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-[#075b2f]">Subscription List</h1>
            <p className="mt-1 text-sm text-[#62705f]">
              Add, edit and manage subscription plan information for members.
            </p>
          </div>
          <Button onClick={() => setShowModal(true)} className="gap-2 bg-[#015907] text-white">
            <Plus aria-hidden="true" />
            Add
          </Button>
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
                subscription plans. Please try again.
              </p>
              <Button
                variant="outline"
                onClick={() => query.refetch()}
                className="mt-4 border-[#015907] text-[#015907] hover:bg-[#015907]/5"
              >
                Try Again
              </Button>
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="font-semibold text-[#075b2f]">No subscription plans yet</p>
              <p className="mt-1 text-sm text-[#62705f]">
                Click “Add” to create the first subscription plan.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-md border border-black/10">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#f7faf6] hover:bg-[#f7faf6]">
                    <TableHead className="whitespace-nowrap px-4 py-3">S/N</TableHead>
                    <TableHead className="whitespace-nowrap px-4 py-3">Plan</TableHead>
                    <TableHead className="whitespace-nowrap px-4 py-3">Bank</TableHead>
                    <TableHead className="whitespace-nowrap px-4 py-3">Amount</TableHead>
                    <TableHead className="whitespace-nowrap px-4 py-3">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.map((item, index) => (
                    <TableRow key={item.id ?? index}>
                      <TableCell className="whitespace-nowrap px-4 py-4">{index + 1}</TableCell>
                      <TableCell className="whitespace-nowrap px-4 py-4">
                        {item.plan_name ?? item.type ?? "—"}
                      </TableCell>
                      <TableCell className="max-w-[320px] px-4 py-4">{item.bank ?? "—"}</TableCell>
                      <TableCell className="whitespace-nowrap px-4 py-4">
                        {formatAsNgnMoney(Number(item.amount))}
                      </TableCell>
                      <TableCell className="whitespace-nowrap px-4 py-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Edit ${item.plan_name ?? item.type ?? "subscription plan"}`}
                          onClick={() => openEdit(item)}
                          className="h-8 w-8 text-[#015907] hover:bg-[#015907]/10"
                        >
                          <Pencil className="!size-4" />
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

      <Modal noHead={false} title="Add Subscription">
        <AddSubscription close={() => setShowModal(false)} refetch={query.refetch} />
      </Modal>

      <Edit noHead={false} title={`Edit ${selected?.plan_name ?? selected?.type ?? "Subscription"}`}>
        <EditSubModal
          item={selected}
          close={() => setShowEdit(false)}
          refetch={query.refetch}
        />
      </Edit>
    </>
  );
};

export default AdminSubList;
