// @ts-nocheck
import React from "react";
import { useState } from "react";
import usePostHook from "../../../hook/usePost";
import { toast } from "react-toastify";
import useGetHook from "../../../hook/useGet";

const EditDuesCategory = ({ item, close, refetch }) => {
  const { data } = useGetHook(`admin/banks`);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(item.name || "");
  const [accNo, setAccNo] = useState(item.bank.id || "");
  const { handlePost } = usePostHook();
  const onSuccess = () => {
    setLoading(false);
    refetch();
    toast.success("Dues Category added successfully");
    close();
  };
  const handleSubmit = async () => {
    setLoading(true);
    const payload = {
      name,
      bank_id: accNo,
      category_id: item.id,
    };
    handlePost(`admin/category/update`, payload, `application/json`, onSuccess);
  };
  return (
    <>
      <div>
        <label className="text-lg font-medium">Category Name</label>
        <input
          type="text"
          className="border border-gray-400 w-full mt-2 p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mt-4">
        <label className="text-lg font-medium">Selected Bank</label>
        <div className="border border-gray-400 rounded mt-2">
          <select
            className="w-full py-3 p-2 rounded"
            value={accNo}
            onChange={(e) => setAccNo(e.target.value)}
          >
            <option value={""}></option>
            {data?.data.map((item, i) => (
              <option value={item.id} key={i}>
                {item.bank_name}
              </option>
            ))}
          </select>
        </div>
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

export default EditDuesCategory;
