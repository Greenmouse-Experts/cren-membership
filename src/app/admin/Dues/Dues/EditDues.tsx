// @ts-nocheck
import React from "react";
import { useState } from "react";
import usePostHook from "../../../hook/usePost";
import { toast } from "react-toastify";
import useGetHook from "../../../hook/useGet";
import dayjs from "dayjs";

const EditDues = ({ item, close, refetch }) => {
  const { data } = useGetHook(`admin/category`);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(item.description || "");
  const [accNo, setAccNo] = useState(item.category.id || "");
  const [amt, setAmt] = useState(Number(item.amount) || "");
  const [sDate, setSDate] = useState(item.start_date || "");
  const [eDate, setEDate] = useState(item.end_date || "");
  const { handlePost } = usePostHook();
  const onSuccess = () => {
    setLoading(false);
    refetch();
    toast.success("Dues added successfully");
    close();
  };
  const handleSubmit = async () => {
    setLoading(true);
    const fd = new FormData();
    fd.append("description", name);
    fd.append("payment_category_id", accNo);
    fd.append("payment_category_id", accNo);
    fd.append("amount", amt);
    fd.append("due_id", item.id);
    fd.append("start_date", dayjs(sDate).format("DD/MM/YYYY"));
    fd.append("end_date", dayjs(eDate).format("DD/MM/YYYY"));
    handlePost(`admin/dues/update`, fd, `multipart/form-data`, onSuccess);
  };
  return (
    <>
      <div className="">
        <div>
          <label className="text-lg font-medium">Dues Category</label>
          <div className="border border-gray-400 rounded mt-2">
            <select
              className="w-full py-3 p-2 rounded"
              value={accNo}
              onChange={(e) => setAccNo(e.target.value)}
            >
              <option value={""}></option>
              {data?.data.map((item, i) => (
                <option value={item.id} key={i}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label className="text-lg font-medium">Description</label>
          <textarea
            value={name}
            className="border border-gray-400 w-full mt-2 p-2 rounded"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <label className="text-lg font-medium">Amount</label>
          <input
            type="number"
            value={amt}
            className="border border-gray-400 w-full mt-2 p-2 rounded"
            onChange={(e) => setAmt(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-x-4">
          <div className="mt-4">
            <label className="text-lg font-medium">Start Date</label>
            <input
              type="date"
              value={sDate}
              className="border border-gray-400 w-full mt-2 p-2 rounded"
              onChange={(e) => setSDate(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <label className="text-lg font-medium">End Date</label>
            <input
              type="date"
              value={eDate}
              className="border border-gray-400 w-full mt-2 p-2 rounded"
              onChange={(e) => setEDate(e.target.value)}
            />
          </div>
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

export default EditDues;
