import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { Eye, Search, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

import useModal from "@/app/hook/useModal";
import useGetHook from "@/app/hook/useGet";
import usePostHook from "@/app/hook/usePost";
import ReusableModal from "@/app/components/ReusableModal";
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
import type { ContactMessage } from "@/types/api";

const AdminMessages = () => {
  const query = useGetHook<ContactMessage[]>("admin/frontend/contact-us");
  const { handlePost, isLoading: isDeleting } = usePostHook();

  const { Modal: Delete, setShowModal: setShowDelete } = useModal();
  const { Modal: View, setShowModal: setShowView } = useModal();

  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [search, setSearch] = useState("");

  const messages = query.data?.data ?? [];

  const filteredMessages = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return messages;
    return messages.filter((item) => {
      const name = item.name?.toLowerCase() ?? "";
      const email = item.email?.toLowerCase() ?? "";
      const subject = item.subject?.toLowerCase() ?? "";
      return name.includes(term) || email.includes(term) || subject.includes(term);
    });
  }, [messages, search]);

  const openView = (item: ContactMessage) => {
    setSelected(item);
    setShowView(true);
  };

  const openDelete = (item: ContactMessage) => {
    setSelected(item);
    setShowDelete(true);
  };

  const handleDelete = () => {
    if (!selected?.id) return;
    handlePost(
      "admin/frontend/delete/contact-us",
      {
        contact_id: selected.id,
      },
      "application/json",
      () => {
        query.refetch();
        toast.success("Message deleted successfully");
        setShowDelete(false);
      },
    );
  };

  return (
    <>
      <div className="mx-2 min-h-[70vh] rounded-md bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-[#075b2f]">Contact Us Messages</h1>
            <p className="mt-1 text-sm text-[#62705f]">
              Review and delete messages submitted through the website contact form.
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search messages..."
              className="pl-9"
              aria-label="Search messages"
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
                Failed to load the messages. Please try again.
              </p>
              <Button
                variant="outline"
                onClick={() => query.refetch()}
                className="mt-4 border-[#015907] text-[#015907] hover:bg-[#015907]/5"
              >
                Try Again
              </Button>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="font-semibold text-[#075b2f]">
                {messages.length === 0 ? "No messages yet" : "No matching messages"}
              </p>
              <p className="mt-1 text-sm text-[#62705f]">
                {messages.length === 0
                  ? "Messages sent through the contact form will appear here."
                  : "Try a different search term."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-md border border-black/10">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#f7faf6] hover:bg-[#f7faf6]">
                    <TableHead className="whitespace-nowrap px-4 py-3">S/N</TableHead>
                    <TableHead className="whitespace-nowrap px-4 py-3">Name</TableHead>
                    <TableHead className="whitespace-nowrap px-4 py-3">Email</TableHead>
                    <TableHead className="whitespace-nowrap px-4 py-3">Phone</TableHead>
                    <TableHead className="whitespace-nowrap px-4 py-3">Subject</TableHead>
                    <TableHead className="whitespace-nowrap px-4 py-3">Date Sent</TableHead>
                    <TableHead className="whitespace-nowrap px-4 py-3">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMessages.map((item, index) => (
                    <TableRow key={item.id ?? index}>
                      <TableCell className="whitespace-nowrap px-4 py-4">{index + 1}</TableCell>
                      <TableCell className="px-4 py-4 font-semibold text-[#013a73]">
                        {item.name}
                      </TableCell>
                      <TableCell className="whitespace-nowrap px-4 py-4">{item.email}</TableCell>
                      <TableCell className="whitespace-nowrap px-4 py-4">{item.phone}</TableCell>
                      <TableCell className="px-4 py-4 text-[#023b82]">{item.subject}</TableCell>
                      <TableCell className="whitespace-nowrap px-4 py-4">
                        {item.created_at ? dayjs(item.created_at).format("DD MMM YYYY") : "—"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap px-4 py-4">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`View message from ${item.name ?? "sender"}`}
                            onClick={() => openView(item)}
                            className="h-8 w-8 text-[#015907] hover:bg-[#015907]/10"
                          >
                            <Eye className="!size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Delete message from ${item.name ?? "sender"}`}
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

      <View noHead={false} title={selected?.name ?? "Message Details"}>
        <div className="max-h-[520px] overflow-y-auto pr-1 no-scrollbar">
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="mt-0.5 font-semibold text-[#075b2f]">{selected?.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="mt-0.5 font-semibold">{selected?.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="mt-0.5 font-semibold">{selected?.phone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date sent</p>
              <p className="mt-0.5 font-semibold">
                {selected?.created_at
                  ? dayjs(selected.created_at).format("DD MMM YYYY")
                  : "—"}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">Subject</p>
            <p className="mt-0.5 font-semibold">{selected?.subject}</p>
          </div>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">Message</p>
            <p className="mt-0.5 leading-[1.7] text-[#3e4a40] whitespace-pre-line">
              {selected?.description}
            </p>
          </div>
        </div>
      </View>

      <Delete title="" noHead>
        <ReusableModal
          title={`Are you sure you want to delete this message${selected?.name ? ` from "${selected.name}"` : ""}?`}
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

export default AdminMessages;
