import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import dayjs from "dayjs";
import { toast } from "react-toastify";

import useGetHook from "@/app/hook/useGet";
import usePostHook from "@/app/hook/usePost";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { DueCategory, DueItem } from "@/types/api";

const duesFormSchema = z
  .object({
    payment_category_id: z.string().min(1, "Please select a dues category."),
    description: z.string().min(1, "Description is required."),
    amount: z.coerce.number({ invalid_type_error: "Amount is required." }).positive("Amount must be greater than zero."),
    start_date: z.string().min(1, "Start date is required."),
    end_date: z.string().min(1, "End date is required."),
  })
  .refine(
    ({ start_date, end_date }) =>
      !start_date || !end_date || dayjs(end_date).isAfter(dayjs(start_date)),
    {
      message: "End date must be after the start date.",
      path: ["end_date"],
    },
  );

type DuesFormValues = z.infer<typeof duesFormSchema>;

/** Converts "DD/MM/YYYY" (as returned by the API) into an <input type="date"> value. */
const toInputDate = (value?: string): string => {
  if (!value) return "";
  return value.includes("/") ? value.split("/").reverse().join("-") : value;
};

const EditDues = ({
  item,
  close,
  refetch,
}: {
  item: DueItem | null;
  close: () => void;
  refetch: () => void;
}) => {
  const { handlePost } = usePostHook();
  const categoryQuery = useGetHook<DueCategory[]>("admin/category");
  const categories = categoryQuery.data?.data ?? [];

  const form = useForm<DuesFormValues>({
    resolver: zodResolver(duesFormSchema),
    defaultValues: {
      payment_category_id: String(
        item?.payment_category?.id ?? item?.category?.id ?? "",
      ),
      description: item?.description ?? "",
      amount: item?.amount !== undefined ? Number(item.amount) : 0,
      start_date: toInputDate(item?.start_date),
      end_date: toInputDate(item?.end_date),
    },
  });

  const onSuccess = () => {
    toast.success("Dues updated successfully");
    refetch();
    close();
  };

  const onSubmit = (values: DuesFormValues) => {
    const payload = {
      due_id: item?.id,
      description: values.description,
      payment_category_id: Number(values.payment_category_id),
      amount: values.amount,
      start_date: dayjs(values.start_date).format("DD/MM/YYYY"),
      end_date: dayjs(values.end_date).format("DD/MM/YYYY"),
    };
    handlePost("admin/dues/update", payload, "application/json", onSuccess);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="payment_category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dues Category</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={String(category.id)} value={String(category.id)}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" min={0} step="0.01" {...field} />
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
                <FormLabel>Start Date</FormLabel>
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
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full bg-[#015907] text-white"
        >
          {form.formState.isSubmitting ? "Submitting..." : "Update"}
        </Button>
      </form>
    </Form>
  );
};

export default EditDues;
