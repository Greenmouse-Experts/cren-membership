import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";

import usePostHook from "@/app/hook/usePost";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const bankFormSchema = z.object({
  bank_name: z.string().min(1, "Bank name is required."),
  account_name: z.string().min(1, "Account name is required."),
  account_number: z
    .string()
    .min(1, "Account number is required.")
    .regex(/^\d+$/, "Account number must contain digits only."),
});

type BankFormValues = z.infer<typeof bankFormSchema>;

const AddBanksModal = ({ close, refetch }: { close: () => void; refetch: () => void }) => {
  const { handlePost } = usePostHook();

  const form = useForm<BankFormValues>({
    resolver: zodResolver(bankFormSchema),
    defaultValues: {
      bank_name: "",
      account_name: "",
      account_number: "",
    },
  });

  const onSuccess = () => {
    toast.success("Bank account added successfully");
    refetch();
    close();
  };

  const onSubmit = (values: BankFormValues) => {
    handlePost("admin/bank/post", values, "application/json", onSuccess);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="bank_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bank Name</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="account_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Name</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="account_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Number</FormLabel>
              <FormControl>
                <Input type="text" inputMode="numeric" {...field} />
              </FormControl>
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

export default AddBanksModal;
