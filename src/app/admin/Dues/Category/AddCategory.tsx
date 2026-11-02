// @ts-nocheck
import React from "react";
import { useState } from "react";
import usePostHook from "../../../hook/usePost";
import { toast } from "react-toastify";
import useGetHook from "../../../hook/useGet";

const AddDuesCategory = ({ close, refetch }) => {
  const { data } = useGetHook(`admin/banks`);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [accNo, setAccNo] = useState("");
  const { handlePost } = usePostHook();
  const onSuccess = () => {
    setLoading(false);
    refetch();
    toast.success("Dues Category added successfully");
    close();
  };
  const handleSubmit = async () => {
    setLoading(true);
    const fd = new FormData();
    fd.append("name", name);
    fd.append("bank_id", accNo);
    handlePost(`admin/category/post`, fd, `multipart/form-data`, onSuccess);
  };
  return (
    <>
      <div>
        <label className="text-lg font-medium">Category Name</label>
        <input
          type="text"
          className="border border-gray-400 w-full mt-2 p-2 rounded"
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mt-4">
        <label className="text-lg font-medium">Selected Bank</label>
        <div className="border border-gray-400 rounded mt-2">
          <select
            className="w-full py-3 p-2 rounded"
            onChange={(e) => setAccNo(e.target.value)}
          >
            <option value={""}></option>
            {data?.data.map((item, i) => (
              <option value={item.id} key={i}>
                {item.account_name}
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

export default AddDuesCategory;
