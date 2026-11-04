// @ts-nocheck
import React from "react";
import { useState } from "react";
import usePostHook from "../../../hook/usePost";
import { toast } from "react-toastify";

const AddBanksModal = ({ close, refetch }) => {
  const [loading, setLoading] = useState(false);
  const [accName, setAccName] = useState("");
  const [accNo, setAccNo] = useState("");
  const [bankName, setBankName] = useState("");
  const { handlePost } = usePostHook();
  const onSuccess = () => {
    setLoading(false);
    refetch();
    toast.success("Bank account added successfully");
    close();
  };
  const handleSubmit = async () => {
    setLoading(true);
    const payload = {
      account_name: accName,
      account_number: accNo,
      bank_name: bankName,
    };
    handlePost(`admin/bank/post`, payload, `application/json`, onSuccess);
  };
  return (
    <>
      <div>
        <label className="text-lg font-medium">Bank Name</label>
        <input
          type="text"
          className="border border-gray-400 w-full mt-2 p-2 rounded"
          onChange={(e) => setBankName(e.target.value)}
        />
      </div>
      <div className="mt-4">
        <label className="text-lg font-medium">Account Name</label>
        <input
          type="text"
          className="border border-gray-400 w-full mt-2 p-2 rounded"
          onChange={(e) => setAccName(e.target.value)}
        />
      </div>
      <div className="mt-4">
        <label className="text-lg font-medium">Account Number</label>
        <input
          type="text"
          className="border border-gray-400 w-full mt-2 p-2 rounded"
          onChange={(e) => setAccNo(e.target.value)}
        />
      </div>
      <div className="mt-8">
        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full py-3 bg-[#015907] font-semibold text-lg rounded text-white"
        >
          {loading ? `Submiting...` : `Submit`}
        </button>
      </div>
    </>
  );
};

export default AddBanksModal;
