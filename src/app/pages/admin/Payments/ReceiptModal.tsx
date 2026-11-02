// @ts-nocheck
import React from "react";
import { FaTimes } from "react-icons/fa";

const ReceiptModal = ({ item, close }) => {
  //  const { data, loading } = useGetHook(`member/view/member?member_id=${item.id}`);

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
            <FaTimes onClick={close} className="" />
          </div>

        {item ?  <div className="oveflow-y-auto px-3">
            <img src={item} alt="receipt" className="" />
          </div> : <div> <h4>No Receipt found for this transaction</h4></div>}
          <div className="py-3"></div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
