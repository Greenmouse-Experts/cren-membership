// @ts-nocheck
import React, { useState } from "react";
import { toast } from "react-toastify";
import usePostHook from "../../hook/usePost";

const EditAnnounce = ({ item, refetch, close }) => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(item?.title || "");
  const [body, setBody] = useState(item?.content || "");
  const [image, setImage] = useState();
  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };
  const { handlePost } = usePostHook();
  const onSuccess = () => {
    setLoading(false);
    refetch();
    toast.success("Announcement added successfully");
    close();
  };
  const handleSubmit = async () => {
    setLoading(true);
    const payload = {
      title,
      content: body,
      announcement_id: item.id,
      ...(image ? { image } : {}),
    };
    handlePost(`admin/announcements/update`, payload, `application/json`, onSuccess);
  };
  return (
    <>
      <div>
        <label className="text-lg font-medium">Title</label>
        <input
          type="text"
          className="border border-gray-400 w-full mt-2 p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="mt-4">
        <label className="text-lg font-medium">Body</label>
        <textarea
          className="border border-gray-400 w-full h-24 mt-2 p-2 rounded"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>
      <div className="mt-4">
        <label className="text-lg font-medium">Image</label>
        <input
          type="file"
          accept="image/*"
          className="border border-gray-400 w-full mt-2 p-2 rounded"
          onChange={handleImage}
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

export default EditAnnounce;
