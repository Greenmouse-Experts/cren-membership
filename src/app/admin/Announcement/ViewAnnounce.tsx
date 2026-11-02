// @ts-nocheck
import React from "react";
import { MdEdit } from "react-icons/md";

const ViewAnnounce = ({ item, openEdit }) => {
  return (
    <>
      <div className="flex justify-end">
        {openEdit && <p
          className="flex items-center gap-x-2 text-blue-800 mb-1 cursor-pointer font-semibold"
          onClick={openEdit}
        >
          <MdEdit className="text-lg" />
          Edit
        </p>}
      </div>
      <div className="max-h-[500px] overflow-y-auto mb-2 no-scrollbar">
        <img src={item.image} alt="item" className="w-full" />
        <p className="mt-5">{item.content}</p>
      </div>
    </>
  );
};

export default ViewAnnounce;
