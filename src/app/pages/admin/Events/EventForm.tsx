import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import dayjs from "dayjs";
import { useSearch } from "@tanstack/react-router";
import { toast } from "react-toastify";
import { ArrowLeft, ImagePlus } from "lucide-react";

import useGetHook from "@/app/hook/useGet";
import usePostHook from "@/app/hook/usePost";
import { useNavigate } from "@/lib/router-compat";
import type { AdminEventItem } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const eventFormSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().min(1, "Description is required."),
  start_date: z.string().min(1, "Start date is required."),
  end_date: z.string().min(1, "End date is required."),
  location: z.string().min(1, "Location is required."),
  organizer: z.string().min(1, "Organizer is required."),
  image: z.instanceof(File).optional(),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

const toDateInputValue = (value?: string | null) => {
  if (!value) return "";
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format("YYYY-MM-DD") : "";
};

const EventFormPage = () => {
  const search = useSearch({ strict: false }) as { id?: string };
  const editId = search?.id ? String(search.id) : undefined;
  const isEditing = Boolean(editId);

  const navigate = useNavigate();
  const query = useGetHook<AdminEventItem[]>("admin/events");
  const { handlePost, isLoading } = usePostHook();

  const event = (query.data?.data ?? []).find(
    (item) => String(item.id) === String(editId),
  );

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      start_date: "",
      end_date: "",
      location: "",
      organizer: "",
      image: undefined,
    },
  });

  useEffect(() => {
    if (event) {
      form.reset({
        title: event.title ?? "",
        description: event.description ?? "",
        start_date: toDateInputValue(event.start_date),
        end_date: toDateInputValue(event.end_date),
        location: event.location ?? "",
        organizer: event.organizer ?? "",
        image: undefined,
      });
    }
    setPreviewUrl(null);
  }, [event, form]);

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

  const onSubmit = (values: EventFormValues) => {
    if (!isEditing && !(values.image instanceof File)) {
      form.setError("image", { message: "An image is required." });
      return;
    }

    const payload = new FormData();
    if (isEditing && editId) {
      payload.append("event_id", editId);
    }
    payload.append("title", values.title);
    payload.append("description", values.description);
    payload.append("start_date", values.start_date);
    payload.append("end_date", values.end_date);
    payload.append("location", values.location);
    payload.append("organizer", values.organizer);
    if (values.image instanceof File) {
      payload.append("image", values.image);
    }

    handlePost(
      isEditing ? "admin/event/update" : "admin/event/post",
      payload,
      undefined,
      () => {
        toast.success(isEditing ? "Event updated successfully" : "Event created successfully");
        navigate("/admin/events/");
      },
    );
  };

  return (
    <div className="mx-2 min-h-[70vh] rounded-md bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            aria-label="Back to events"
            onClick={() => navigate("/admin/events/")}
            className="size-9 border-[#015907]/30 text-[#015907] hover:bg-[#015907]/5"
          >
            <ArrowLeft aria-hidden="true" />
          </Button>
          <h1 className="text-xl font-semibold text-[#075b2f]">
            {isEditing ? "Edit Event" : "Add Event"}
          </h1>
        </div>
      </div>

      <div className="mx-auto mt-6 max-w-3xl">
        {query.isLoading && isEditing && !event ? (
          <div className="text-sm text-muted-foreground">Loading event…</div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Inauguration of the New Executive Committee"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={5}
                        placeholder="Describe the event..."
                        className="border-none h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Abuja, Nigeria" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="organizer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organizer</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. CREN" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormDescription className="text-xs">
                      {isEditing
                        ? "Leave unchanged to keep the current image."
                        : "PNG, JPG or WEBP."}
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
                        {isEditing && event?.image && (
                          <img
                            src={event.image}
                            alt={event.title ?? "Current event image"}
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
                              {isEditing
                                ? event?.image
                                  ? "Replace image"
                                  : "Upload an image"
                                : "Click to upload an event image"}
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/events/")}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="min-w-28 bg-[#015907] text-white hover:bg-[#015907]/90"
                >
                  {isLoading ? "Saving..." : isEditing ? "Save Changes" : "Create Event"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
};

export default EventFormPage;
