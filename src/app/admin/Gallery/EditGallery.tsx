// @ts-nocheck
import React, { useState } from "react";
import { toast } from "react-toastify";
import usePostHook from "../../hook/usePost";

const EditGallery = ({ item, refetch, close }) => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(item?.title || "");
  const [image, setImage] = useState();
  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };
  const { handlePost } = usePostHook();
  const onSuccess = () => {
    setLoading(false);
    refetch();
    toast.success("Gallery added successfully");
    close();
  };
  const handleSubmit = async () => {
    setLoading(true);
    const fd = new FormData();
    fd.append("title", title);
    fd.append("gallery_id", item.id);
    if (image) {
      fd.append("image", image);
    }
    handlePost(
      `admin/frontend/update/gallery`,
      fd,
      `multipart/form-data`,
      onSuccess
    );
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
        <img src={item.image} alt="image" className="w-24" />
        <label className="text-lg font-medium w-full">Image Cover</label>
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
          {loading ? `Updating...` : `Submit`}
        </button>
      </div>
    </>
  );
};

export default EditGallery;
