import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import type { BankDetails } from "@/types/api";

const categoryFormSchema = z.object({
  name: z.string().min(1, "Category name is required."),
  bank_id: z.string().min(1, "Please select a bank account."),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

const AddDuesCategory = ({ close, refetch }: { close: () => void; refetch: () => void }) => {
  const { handlePost } = usePostHook();
  const bankQuery = useGetHook<BankDetails[]>("admin/banks");
  const banks = bankQuery.data?.data ?? [];

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      bank_id: "",
    },
  });

  const onSuccess = () => {
    toast.success("Dues category added successfully");
    refetch();
    close();
  };

  const onSubmit = (values: CategoryFormValues) => {
    const payload = {
      name: values.name,
      bank_id: Number(values.bank_id),
    };
    handlePost("admin/category/post", payload, "application/json", onSuccess);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bank_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Selected Bank</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a bank account" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {banks.map((bank) => (
                    <SelectItem key={String(bank.id)} value={String(bank.id)}>
                      {bank.bank_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full bg-[#015907] text-white"
        >
          {form.formState.isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
};

export default AddDuesCategory;
