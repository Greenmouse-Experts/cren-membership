// @ts-nocheck
import React from "react";
import { useState } from "react";
import usePostHook from "../../../hook/usePost";
import { toast } from "react-toastify";
import useGetHook from "../../../hook/useGet";
import dayjs from "dayjs";

const AddDues = ({ close, refetch }) => {
  const { data } = useGetHook(`admin/category`);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [accNo, setAccNo] = useState("");
  const [amt, setAmt] = useState("");
  const [sDate, setSDate] = useState("");
  const [eDate, setEDate] = useState("");
  const { handlePost } = usePostHook();
  const onSuccess = () => {
    setLoading(false);
    refetch();
    toast.success("Dues added successfully");
    close();
  };
  const handleSubmit = async () => {
    setLoading(true);
    const payload = {
      description: name,
      payment_category_id: accNo,
      amount: amt,
      start_date: dayjs(sDate).format("DD/MM/YYYY"),
      end_date: dayjs(eDate).format("DD/MM/YYYY"),
    };
    handlePost(`admin/dues/post`, payload, `application/json`, onSuccess);
  };
  return (
    <>
      <div className="">
        <div>
          <label className="text-lg font-medium">Dues Category</label>
          <div className="border border-gray-400 rounded mt-2">
            <select className="w-full py-3 p-2 rounded" onChange={(e) => setAccNo(e.target.value)}>
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
          <input
            type="text"
            className="border border-gray-400 w-full mt-2 p-2 rounded"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mt-4">
          <label className="text-lg font-medium">Amount</label>
          <input
            type="number"
            className="border border-gray-400 w-full mt-2 p-2 rounded"
            onChange={(e) => setAmt(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <label className="text-lg font-medium">Start Date</label>
          <input
            type="date"
            className="border border-gray-400 w-full mt-2 p-2 rounded"
            onChange={(e) => setSDate(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <label className="text-lg font-medium">End Date</label>
          <input
            type="date"
            className="border border-gray-400 w-full mt-2 p-2 rounded"
            onChange={(e) => setEDate(e.target.value)}
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
      </div>
    </>
  );
};

export default AddDues;
