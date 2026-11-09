import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { ImagePlus } from "lucide-react";

import usePostHook from "@/app/hook/usePost";
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
  image: z.instanceof(File, { message: "An image is required." }),
});

type GalleryFormValues = z.infer<typeof galleryFormSchema>;

interface AddGalleryProps {
  close: () => void;
  refetch: () => void;
}

export default function AddGallery({ close, refetch }: AddGalleryProps) {
  const { handlePost, isLoading } = usePostHook();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<GalleryFormValues>({
    resolver: zodResolver(galleryFormSchema),
    defaultValues: { title: "", image: undefined as unknown as File },
  });

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
    const payload = new FormData();
    payload.append("title", values.title);
    payload.append("image", values.image);
    const data = {
      title: values.title,
      image: values.image,
    };
    handlePost("admin/frontend/add/gallery", data, () => {
      toast.success("Gallery added successfully");
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
              {previewUrl ? (
                <div className="flex items-center gap-3">
                  <img
                    src={previewUrl}
                    alt="Selected image preview"
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
                <FormControl>
                  <label
                    tabIndex={0}
                    className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-input bg-muted/30 px-6 py-8 text-center transition-colors hover:border-[#015907] hover:bg-[#015907]/5"
                  >
                    <ImagePlus aria-hidden="true" className="size-7 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Click to upload a gallery image
                    </span>
                    <Input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(event) => field.onChange(event.target.files?.[0])}
                    />
                  </label>
                </FormControl>
              )}
              <FormDescription className="text-xs">PNG, JPG or WEBP.</FormDescription>
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
            {isLoading ? "Uploading..." : "Add Image"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
