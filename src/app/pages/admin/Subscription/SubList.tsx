// @ts-nocheck
import React from "react";
import { MdAddCircleOutline } from "react-icons/md";
import useModal from "../../../hook/useModal";
import useGetHook from "../../../hook/useGet";
import { useState } from "react";
import usePostHook from "../../../hook/usePost";
import { toast } from "react-toastify";

import { formatAsNgnMoney } from "../../../services/helpers";
import { RiDeleteBin5Line } from "react-icons/ri";
import { LiaEdit } from "react-icons/lia";
import EditDues from "../../../admin/Dues/Dues/EditDues";
import ReusableModal from "../../../components/ReusableModal";
import AddSubscription from "../../../admin/Subscription/AddSubscription";
import SetSubscribe from "../../../admin/Payments/SetSubscribe";
import type { DueItem } from "../../../types";

const SubList = () => {
  const { data, isLoading, refetch } = useGetHook<DueItem[]>(`admin/subscription`);
  const { handlePost } = usePostHook();
  const [selected, setSelected] = useState<DueItem | undefined>();
  const { Modal: Delete, setShowModal: showDelete, Modal, setShowModal } = useModal();
  const [isBusy, setIsBusy] = useState(false);
  const onSuccess = () => {
    setIsBusy(false);
    refetch();
    toast.success("Dues deleted successfully");
    setShowModal(false);
  };
  const handleDelete = () => {
    if (!selected) return;
    setIsBusy(true);
    const payload = {
      due_id: selected.id,
    };
    handlePost(`admin/dues/delete`, payload, `application/json`, onSuccess);
  };
  return (
    <>
      <div className="mx-2 p-5 bg-white min-h-[70vh] ml-6">
        <div className="flex justify-between">
          <div className="lg:w-8/12">
            <p className="text-xl font-semibold">Subscription List</p>
            <p className="mt-2">Add, edit and delete dues informations for members.</p>
          </div>
          <div>
            <button
              className="flex items-center  gap-x-2 p-2 px-4 text-blue-900 font-semibold border border-blue-900 rounded"
              onClick={() => setShowModal(true)}
            >
              <MdAddCircleOutline />
              Add
            </button>
          </div>
        </div>
        <div className="mt-8">
          <div className="flex flex-col">
            <div className="overflow-x-auto">
              <div className="py-2 align-middle inline-block min-w-full ">
                <table className="items-center w-full bg-transparent border-collapse">
                  <thead className="thead-light border-y-2 border-[#CECECE]">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 lg:px-10 align-middle py-3 fs-500 whitespace-nowrap text-left"
                      >
                        S/N
                      </th>
                      {/* <th
                        scope="col"
                        className="px-6 lg:px-10 align-middle py-3 fs-500 whitespace-nowrap text-left"
                      >
                        Description
                      </th> */}
                      <th
                        scope="col"
                        className="px-6 lg:px-10 align-middle py-3 fs-500 whitespace-nowrap text-left"
                      >
                        Bank
                      </th>
                      <th
                        scope="col"
                        className="px-6 lg:px-10 align-middle py-3 fs-500 whitespace-nowrap text-left"
                      >
                        Amount
                      </th>

                      <th
                        scope="col"
                        className="px-6 lg:px-10 align-middle py-3 fs-500 whitespace-nowrap text-left"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.data.map((item, i) => (
                      <tr key={i}>
                        <td className="align-middle fs-500 whitespace-nowrap px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
                          {i + 1}
                        </td>
                        {/* <td className="align-middle fs-500  px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
                          <div className="w-48">
                          {item.description}
                          </div>
                        </td> */}
                        <td className="align-middle fs-500 whitespace-nowrap px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
                          <div>
                            <p>{item.bank}</p>
                          </div>
                        </td>
                        <td className="align-middle fs-500 whitespace-nowrap px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
                          <div>
                            <p>{formatAsNgnMoney(item.amount)}</p>
                          </div>
                        </td>
                        {/* <td className="align-middle fs-500 whitespace-nowrap px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
                          {item.start_date}
                        </td>
                        <td className="align-middle fs-500 whitespace-nowrap px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
                          {item.end_date}
                        </td> */}
                        <td className="align-middle fs-500 whitespace-nowrap px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
                          <SetSubscribe />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal title={"Set Subscription"}>
        <AddSubscription close={() => setShowModal(false)} refetch={refetch} />
      </Modal>
      <Edit title={selected?.description ?? "Edit Dues"}>
        <EditDues item={selected} close={() => setShowModal(false)} refetch={refetch} />
      </Edit>
    </>
  );
};

export default SubList;
