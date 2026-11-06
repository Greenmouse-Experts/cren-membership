import { Pencil } from "lucide-react";

import type { GalleryItem } from "@/types/api";

interface ViewGalleryProps {
  item: GalleryItem | null;
  openEdit?: () => void;
}

export default function ViewGallery({ item, openEdit }: ViewGalleryProps) {
  return (
    <div className="mb-2">
      <div className="flex justify-end">
        {openEdit && (
          <button
            type="button"
            onClick={openEdit}
            className="mb-1 flex items-center gap-x-1.5 rounded-md px-2 py-1 text-[0.82rem] font-semibold text-[#015907] transition-colors hover:bg-[#015907]/10"
          >
            <Pencil aria-hidden="true" className="size-3.5" />
            Edit
          </button>
        )}
      </div>

      <div className="max-h-[520px] overflow-y-auto no-scrollbar">
        {item?.image ? (
          <img
            src={item.image}
            alt={item.title ?? "Gallery image"}
            className="w-full rounded-md"
          />
        ) : (
          <div className="flex h-56 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
            No image available
          </div>
        )}
        {item?.title && <p className="mt-4 font-semibold text-[#075b2f]">{item.title}</p>}
        <p className="mt-3 text-[0.85rem] leading-[1.7] text-muted-foreground">{item?.content}</p>
      </div>
    </div>
  );
}
