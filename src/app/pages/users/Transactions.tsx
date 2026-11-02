// @ts-nocheck
import React from "react";
import { useState } from "react";
import ConfirmedPayments from "../../users/ConfirmedPayments";
import PendingPayments from "../../users/PendingPayments";

const MembersTransactions = () => {
  const [open, setOpen] = useState(1);
  const handleOpen = (val) => {
    setOpen(val);
  };
  return (
    <>
      <div className="mx-2 p-6 bg-white min-h-[70vh]">
        <div className="">
          <p className="font-semibold text-xl">Transactions</p>
          <p className="text-[14px]">Record of your payments on CREN</p>
        </div>
        <div className="mt-12">
          <div className="flex gap-x-4">
            <p
              className={`font-medium border-b-[3px] px-4 cursor-pointer ${open === 1 ? "text-blue-900 font-semibold border-blue-900" : "opacity-50"}`}
              onClick={() => handleOpen(1)}
            >
              Completed Payments
            </p>
            <p
              className={`font-medium border-b-[3px] px-4 cursor-pointer ${open === 2 ? "text-blue-900 font-semibold border-blue-900" : "opacity-50"}`}
              onClick={() => handleOpen(2)}
            >
              Pending Payments
            </p>
          </div>
          <div>
            {open === 1 && <ConfirmedPayments />}
            {open === 2 && <PendingPayments />}
          </div>
        </div>
      </div>
    </>
  );
};

export default MembersTransactions;
