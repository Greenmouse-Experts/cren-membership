// @ts-nocheck
import React from "react";
import { useState } from "react";
import usePostHook from "../../hook/usePost";
import { toast } from "react-toastify";

const EditSubscription = ({ item, refetch, close }) => {
  const [loading, setLoading] = useState(false);
  console.log(item.item);
  const [bank, setBank] = useState("");
  const [amt, setAmt] = useState(Number(item.amount));
  const { handlePost } = usePostHook();
  const onSuccess = () => {
    setLoading(false);
    toast.success("Subscrition amount updated");
    refetch();
    close();
  };
  const handleSubmit = async () => {
    setLoading(true);
    const fd = new FormData();
    fd.append("subscription_id", item.id);
    fd.append("amount", amt);
    fd.append("bank", bank);
    handlePost(`admin/subscription`, fd, `multipart/form-data`, onSuccess);
  };
  return (
    <>
      <div>
        <div className="flex flex-col">
          <label className="text-lg font-medium">Bank Details</label>
          <textarea
            type="text"
            value={bank}
            className="border border-gray-400 w-full mt-2 p-2 rounded"
            onChange={(e) => setBank(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-lg font-medium">Amount</label>
          <input
            type="number"
            value={amt}
            className="border border-gray-400 w-full mt-2 p-2 rounded"
            onChange={(e) => setAmt(e.target.value)}
          />
        </div>
        <div className="mt-8">
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full py-3 bg-[#015907] font-semibold text-lg rounded text-white"
          >
            {loading ? `Updating...` : `Update`}
          </button>
        </div>
      </div>
    </>
  );
};

export default EditSubscription;
