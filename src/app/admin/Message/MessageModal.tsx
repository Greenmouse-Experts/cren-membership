// @ts-nocheck
import React from "react";
import useGetHook from "../../hook/useGet";
import { FaTimes } from "react-icons/fa";

const MessageModal = ({ item, close }) => {
  console.log(item);

  return (
    <div
      className="fixed flex justify-center items-center h-screen w-full top-0 left-0 bg-[#00000066]"
      onClick={close}
    >
      <div
        className="w-11/12 lg:w-7/12 bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5">
          <div className="flex justify-between border-b items-center mb-3">
            <p className="text-lg font-semibold ">{item.first_name}</p>
            <FaTimes onClick={close} className="" />
          </div>

          <div className="oveflow-y-auto px-3">
            <div className="grid lg:grid-cols-2 gap-y-2 py-3 overflow-y-auto pr-3">
              <div>
                <p className="text-gray-500">Name:</p>
                <p className="font-semibold">{item.name}</p>
              </div>
              <div>
                <p className="text-gray-500">Email</p>
                <p className="font-semibold">{item.email}</p>
              </div>
              <div>
                <p className="text-gray-500">Phone:</p>
                <p className="font-semibold">{item.phone}</p>
              </div>
              <div>
                <p className="text-gray-500">Subject:</p>
                <p className="font-semibold">{item.subject}</p>
              </div>
            </div>
            <div>
                <p className="text-gray-500">Description:</p>
                <p className="font-semibold">{item.description}</p>
              </div>
          </div>
          <div className="py-3"></div>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;
