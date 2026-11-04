import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import { Loader2, UploadCloud } from "lucide-react";
import usePostHook from "../hook/usePost";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const uploadReceiptSchema = z.object({
  receipt: z
    .any()
    .refine((val) => val && val.length > 0, "Payment receipt file is required")
    .refine((val) => val && val[0] && val[0].size > 0, "Receipt file cannot be empty")
    .refine(
      (val) =>
        val &&
        val[0] &&
        ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"].includes(
          val[0].type,
        ),
      "File must be an image (JPEG, PNG, WEBP) or PDF",
    ),
});

export interface UploadReceiptProps {
  id: string | number;
  refetch?: () => void;
  close: () => void;
}

interface FormValues {
  receipt?: FileList;
}

const UploadReceipt: React.FC<UploadReceiptProps> = ({ refetch, close, id }) => {
  const { handlePost, isPending } = usePostHook();

  const form = useForm<FormValues>({
    resolver: zodResolver(uploadReceiptSchema) as any,
  });

  const onSubmit = async (values: FormValues) => {
    const file = values.receipt?.[0];
    if (!file) {
      toast.error("Please select a valid receipt file");
      return;
    }

    const formData = new FormData();
    formData.append("due_id", String(id));
    formData.append("receipt", file);

    await handlePost("member/upload/manual/receipt", formData, undefined, () => {
      toast.success("Receipt uploaded successfully");
      if (refetch) refetch();
      close();
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="receipt"
          render={({ field: { value: _value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>Payment Receipt</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={(e) => {
                    onChange(e.target.files);
                  }}
                  {...fieldProps}
                  className="cursor-pointer file:cursor-pointer file:text-primary file:font-semibold"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={close} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending} className="min-w-28">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <UploadCloud className="mr-2 h-4 w-4" />
                Upload Receipt
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UploadReceipt;
