import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { ImagePlus } from "lucide-react";

import usePostHook from "@/app/hook/usePost";
import type { GalleryItem } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const galleryFormSchema = z.object({
  title: z.string().min(1, "Title is required."),
  image: z.instanceof(File).optional(),
});

type GalleryFormValues = z.infer<typeof galleryFormSchema>;

interface EditGalleryProps {
  item: GalleryItem | null;
  refetch: () => void;
  close: () => void;
}

export default function EditGallery({ item, refetch, close }: EditGalleryProps) {
  const { handlePost, isLoading } = usePostHook();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<GalleryFormValues>({
    resolver: zodResolver(galleryFormSchema),
    defaultValues: {
      title: item?.title ?? "",
      image: undefined,
    },
  });

  useEffect(() => {
    if (item) {
      form.reset({ title: item.title ?? "", image: undefined });
    } else {
      form.reset({ title: "", image: undefined });
    }
    setPreviewUrl(null);
  }, [item, form]);

  useEffect(() => {
    const image = form.watch("image");
    if (!(image instanceof File)) {
      setPreviewUrl(null);
      return undefined;
    }
    const objectUrl = URL.createObjectURL(image);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [form.watch("image"), form]);

  const onSubmit = (values: GalleryFormValues) => {
    if (!item?.id) return;

    const payload = new FormData();
    payload.append("gallery_id", String(item.id));
    payload.append("title", values.title);
    if (values.image instanceof File) {
      payload.append("image", values.image);
    }

    handlePost("admin/frontend/update/gallery", payload, undefined, () => {
      toast.success("Gallery updated successfully");
      refetch();
      close();
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Energy Awards 2026" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormDescription className="text-xs">
                Leave unchanged to keep the current image.
              </FormDescription>

              {previewUrl ? (
                <div className="flex items-center gap-3">
                  <img
                    src={previewUrl}
                    alt="New image preview"
                    className="h-20 w-28 rounded-md object-cover"
                  />
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      className="w-full cursor-pointer"
                      onChange={(event) => field.onChange(event.target.files?.[0])}
                    />
                  </FormControl>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  {item?.image && (
                    <img
                      src={item.image}
                      alt={item.title ?? "Current gallery image"}
                      className="h-20 w-28 rounded-md object-cover"
                    />
                  )}
                  <FormControl>
                    <label
                      tabIndex={0}
                      className="flex flex-1 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-input bg-muted/30 px-6 py-6 text-center transition-colors hover:border-[#015907] hover:bg-[#015907]/5"
                    >
                      <ImagePlus aria-hidden="true" className="size-6 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">
                        {item?.image ? "Replace image" : "Upload an image"}
                      </span>
                      <Input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(event) => field.onChange(event.target.files?.[0])}
                      />
                    </label>
                  </FormControl>
                </div>
              )}
              {form.formState.errors.image?.message && (
                <FormMessage>{form.formState.errors.image.message}</FormMessage>
              )}
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-3">
          <Button type="button" variant="outline" onClick={close} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="min-w-28 bg-[#015907] text-white hover:bg-[#015907]/90"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
