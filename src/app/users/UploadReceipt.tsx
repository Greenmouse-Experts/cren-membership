// @ts-nocheck
import React, { useState } from "react";
import usePostHook from "../hook/usePost";
import { toast } from "react-toastify";

const UploadReceipt = ({ refetch, close, id }) => {
  // console.log(id);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");
  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };
  const { handlePost } = usePostHook();
  const onSuccess = () => {
    setLoading(false);
    refetch();
    toast.success("Reciept uploaded successfully");
    close();
  };
  const handleSubmit = async () => {
    setLoading(true);
    const payload = {
      due_id: id,
      receipt: image,
    };
    handlePost(`member/upload/manual/receipt`, payload, `application/json`, onSuccess);
  };
  return (
    <>
      <div className="mt-4">
        <label className="text-lg font-medium w-full">Payment Receipt</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          className="border border-gray-400 w-full mt-2 p-2 rounded"
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

export default UploadReceipt;
