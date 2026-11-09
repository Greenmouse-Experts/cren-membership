import { useState } from "react";
import dayjs from "dayjs";
import { Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

import useModal from "@/app/hook/useModal";
import useGetHook from "@/app/hook/useGet";
import usePostHook from "@/app/hook/usePost";
import ReusableModal from "@/app/components/ReusableModal";
import AddGallery from "@/app/admin/Gallery/AddDGallery";
import EditGallery from "@/app/admin/Gallery/EditGallery";
import ViewGallery from "@/app/admin/Gallery/ViewGallery";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { GalleryItem } from "@/types/api";

/** The API returns gallery status in inconsistent shapes (1/0, "true", "published"). */
const isPublished = (item: GalleryItem) => {
  const { status } = item;
  if (typeof status === "boolean") return status;
  if (typeof status === "number") return status === 1;
  if (typeof status === "string") {
    return ["1", "true", "published", "active"].includes(status.trim().toLowerCase());
  }
  return false;
};

const GalleryPage = () => {
  const query = useGetHook<GalleryItem[]>("admin/frontend/gallery");
  const { handlePost, isLoading: isBusy } = usePostHook();

  const { Modal: Delete, setShowModal: setShowDelete } = useModal();
  const { Modal: Edit, setShowModal: setShowEdit } = useModal();
  const { Modal: View, setShowModal: setShowView } = useModal();
  const { Modal: Publish, setShowModal: setShowPublish } = useModal();
  const { Modal, setShowModal } = useModal();

  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const [publishAction, setPublishAction] = useState<"publish" | "unpublish">("publish");

  const galleryItems = query.data?.data ?? [];

  const openView = (item: GalleryItem) => {
    setSelected(item);
    setShowView(true);
  };

  const openEdit = () => {
    setShowView(false);
    setShowEdit(true);
  };

  const openEditFromCard = (item: GalleryItem) => {
    setSelected(item);
    setShowEdit(true);
  };

  const openDelete = (item: GalleryItem) => {
    setSelected(item);
    setShowDelete(true);
  };

  const openPublishToggle = (item: GalleryItem) => {
    setSelected(item);
    setPublishAction(isPublished(item) ? "unpublish" : "publish");
    setShowPublish(true);
  };

  const handleDelete = () => {
    if (!selected?.id) return;
    handlePost(
      "admin/frontend/delete/gallery",
      {
        gallery_id: selected.id,
      },
      "application/json",
      () => {
        query.refetch();
        toast.success("Gallery deleted successfully");
        setShowDelete(false);
      },
    );
  };

  const handlePublishToggle = () => {
    if (!selected?.id) return;
    handlePost(
      `admin/frontend/${publishAction}/gallery`,
      {
        gallery_id: selected.id,
      },
      "application/json",
      () => {
        query.refetch();
        toast.success(
          publishAction === "publish"
            ? "Gallery image published successfully"
            : "Gallery image unpublished successfully",
        );
        setShowPublish(false);
      },
    );
  };

  return (
    <>
      <div className="mx-2 min-h-[70vh] rounded-md bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-[#075b2f]">CREN Gallery</h1>
            <p className="mt-1 text-sm text-[#62705f]">
              Add, view, edit and delete images shown in the public website gallery.
            </p>
          </div>
          <Button onClick={() => setShowModal(true)} className="gap-2 bg-[#015907] text-white">
            <Plus aria-hidden="true" />
            Add
          </Button>
        </div>

        <div className="mt-6">
          {query.isLoading ? (
            <div className="grid grid-cols-[repeat(auto-fill,_minmax(22.5rem,_1fr))] gap-8">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-72 w-full rounded-lg" />
              ))}
            </div>
          ) : query.isError ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="font-semibold text-[#075b2f]">Something went wrong</p>
              <p className="mt-1 text-sm text-[#62705f]">
                {query.error instanceof Error ? query.error.message : ""} Failed to load the
                gallery. Please try again.
              </p>
              <Button
                variant="outline"
                onClick={() => query.refetch()}
                className="mt-4 border-[#015907] text-[#015907] hover:bg-[#015907]/5"
              >
                Try Again
              </Button>
            </div>
          ) : galleryItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="font-semibold text-[#075b2f]">No gallery images yet</p>
              <p className="mt-1 text-sm text-[#62705f]">
                Click “Add” to upload the first gallery image.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-8">
              {galleryItems.map((item, index) => (
                <article
                  key={item.id ?? index}
                  className="group cursor-pointer rounded-lg border border-black/10 bg-white shadow-[0_18px_36px_-30px_rgba(7,91,47,0.55)] transition-transform duration-150 hover:-translate-y-0.5"
                  onClick={() => openView(item)}
                >
                  <h6 className="px-4 pt-4 text-center text-[1.05rem] font-semibold capitalize text-[#075b2f]">
                    {item.title}
                  </h6>
                  <div className="relative mt-3">
                    <img
                      src={item.image ?? ""}
                      alt={item.title ?? "Gallery image"}
                      loading="lazy"
                      className="w-full object-cover"
                    />
                    <div
                      className="absolute right-3  flex items-center gap-1 rounded-md bg-white/95 p-1.5 shadow-sm bottom-0"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <Badge
                        className={
                          isPublished(item)
                            ? "border border-transparent bg-[#075b2f]/10 text-[#075b2f]"
                            : "border border-transparent bg-amber-500/15 text-amber-700"
                        }
                      >
                        {isPublished(item) ? "Published" : "Draft"}
                      </Badge>
                      <span className="px-1 text-[0.72rem] text-[#5f6a62]">
                        {dayjs(item.created_at).format("DD MMM YYYY")}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={
                          isPublished(item)
                            ? `Unpublish ${item.title ?? "gallery image"}`
                            : `Publish ${item.title ?? "gallery image"}`
                        }
                        title={isPublished(item) ? "Unpublish" : "Publish"}
                        onClick={() => openPublishToggle(item)}
                        className="hidden h-7 w-7 text-[#015907] hover:bg-[#015907]/10 group-hover:inline-flex"
                      >
                        {isPublished(item) ? (
                          <EyeOff className="!size-3.5" />
                        ) : (
                          <Eye className="!size-3.5" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Edit ${item.title ?? "gallery image"}`}
                        onClick={() => openEditFromCard(item)}
                        className="hidden h-7 w-7 text-[#015907] hover:bg-[#015907]/10 group-hover:inline-flex"
                      >
                        <Pencil className="!size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Delete ${item.title ?? "gallery image"}`}
                        onClick={() => openDelete(item)}
                        className="hidden h-7 w-7 text-red-600 hover:bg-red-600/10 group-hover:inline-flex"
                      >
                        <Trash2 className="!size-3.5" />
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal noHead={false} title="Add Gallery">
        <AddGallery close={() => setShowModal(false)} refetch={query.refetch} />
      </Modal>

      <View noHead={false} title={selected?.title ?? "View Gallery"}>
        <ViewGallery
          item={selected}
          openEdit={() => {
            openEdit();
          }}
        />
      </View>

      <Edit noHead={false} title="Edit Gallery">
        <EditGallery item={selected} refetch={query.refetch} close={() => setShowEdit(false)} />
      </Edit>

      <Delete title="" noHead>
        <ReusableModal
          title="Are you sure you want to delete this gallery image?"
          cancelTitle="No, cancel"
          actionTitle="Yes, delete"
          closeModal={() => setShowDelete(false)}
          action={handleDelete}
          isBusy={isBusy}
        />
      </Delete>

      <Publish title="" noHead>
        <ReusableModal
          title={`Are you sure you want to ${publishAction}${selected?.title ? ` "${selected.title}"` : " this gallery image"}?`}
          cancelTitle="No, cancel"
          actionTitle={publishAction === "publish" ? "Yes, publish" : "Yes, unpublish"}
          closeModal={() => setShowPublish(false)}
          action={handlePublishToggle}
          isBusy={isBusy}
        />
      </Publish>
    </>
  );
};

export default GalleryPage;
