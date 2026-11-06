import { toast } from "react-toastify";

import usePostHook from "@/app/hook/usePost";
import { Button } from "@/components/ui/button";
import type { MemberPaymentTransaction } from "@/types/api";

const ConfirmDuesPayment = ({
  item,
  close,
  refetch,
}: {
  item: MemberPaymentTransaction | null;
  close: () => void;
  refetch: () => void;
}) => {
  const { handlePost, isLoading: loading } = usePostHook();

  const onSuccess = () => {
    toast.success("Dues payment updated successfully");
    refetch();
    close();
  };

  const handleUpdate = () => {
    if (item?.id === undefined || item.id === null || item.id === "") return;
    const payload = {
      transaction_id: item.id,
      status: "success",
    };
    handlePost("admin/dues/update/transaction", payload, "application/json", onSuccess);
  };

  return (
    <div className="space-y-4">
      {item?.receipt ? (
        <a
          href={item.receipt}
          target="_blank"
          rel="noopener noreferrer"
          className="block max-h-[50vh] overflow-y-auto rounded-md border border-black/10"
        >
          <img src={item.receipt} alt="Payment receipt" className="w-full object-contain" />
        </a>
      ) : (
        <p className="py-6 text-center text-sm text-muted-foreground">
          No receipt was uploaded for this transaction.
        </p>
      )}

      <Button
        type="button"
        disabled={loading}
        onClick={handleUpdate}
        className="w-full bg-[#015907] text-white"
      >
        {loading ? "Confirming..." : "Confirm Payment"}
      </Button>
    </div>
  );
};

export default ConfirmDuesPayment;
