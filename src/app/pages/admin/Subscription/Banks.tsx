// @ts-nocheck
import React from "react";
import useGetHook from "../../../hook/useGet";
import useModal from "../../../hook/useModal";
import { MdAddCircleOutline } from "react-icons/md";
import AddBanksModal from "../../../admin/Dues/Banks/AddBanks";
import dayjs from "dayjs";
import { RiDeleteBin5Line } from "react-icons/ri";
import { LiaEdit } from "react-icons/lia";
import ReusableModal from "../../../components/ReusableModal";
import { useState } from "react";
import { toast } from "react-toastify";
import usePostHook from "../../../hook/usePost";
import EditBanksModal from "../../../admin/Dues/Banks/EditBanks";

const AdminSubBank = () => {
  const { data, isLoading, refetch } = useGetHook(`admin/banks`);
  const { handlePost } = usePostHook();
  const [isBusy, setIsBusy] = useState(false);
  const { Modal: Delete, setShowModal: showDelete } = useModal();
  const { Modal: Edit, setShowModal: showEdit } = useModal();
  const { Modal, setShowModal } = useModal();
  const [selected, setSelected] = useState();
  const openEdit = (item) => {
    setSelected(item);
    showEdit(true);
  };
  const openDelete = (item) => {
    setSelected(item);
    showDelete(true);
  };
  const onSuccess = () => {
    setIsBusy(false);
    refetch();
    toast.success("Bank Account deleted successfully");
    showDelete(false);
  };
  const handleDelete = () => {
    setIsBusy(true);
    const payload = {
        bank_id: selected.id,
    };
    handlePost(
      `admin/bank/delete`,
      payload,
      `application/json`,
      onSuccess
    );
  };
  return (
    <>
      <div className="mx-3 bg-white p-5 min-h-[80vh] ml-6">
        <div className="flex justify-between">
          <div className="lg:w-8/12">
            <p className="text-xl font-semibold">Available Banks</p>
            <p>
              Add, edit and delete bank informations used for collection of
              subscription.
            </p>
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
            <div className=" overflow-x-auto">
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
                      <th
                        scope="col"
                        className="px-6 lg:px-10 align-middle py-3 fs-500 whitespace-nowrap text-left"
                      >
                        Bank Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 lg:px-10 align-middle py-3 fs-500 whitespace-nowrap text-left"
                      >
                        Account Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 lg:px-10 align-middle py-3 fs-500 whitespace-nowrap text-left"
                      >
                        Account Number
                      </th>
                      <th
                        scope="col"
                        className="px-6 lg:px-10 align-middle py-3 fs-500 whitespace-nowrap text-left"
                      >
                        Created At
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
                        <td className="align-middle fs-500 whitespace-nowrap px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
                          {item.bank_name}
                        </td>
                        <td className="align-middle fs-500 whitespace-nowrap px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
                          {item.account_name}
                        </td>
                        <td className="align-middle fs-500 whitespace-nowrap px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
                          {item.account_number}
                        </td>
                        <td className="align-middle fs-500 whitespace-nowrap px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
                          {dayjs(item.created_at).format("DD/MM/YYYY")}
                        </td>
                        <td className="align-middle fs-500 whitespace-nowrap px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
                          <div className="flex gap-x-3">
                            <LiaEdit
                              onClick={() => openEdit(item)}
                              className="text-xl text-blue-900"
                            />
                            <RiDeleteBin5Line
                              onClick={() => openDelete(item)}
                              className="text-lg text-red-600"
                            />
                          </div>
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
      <Modal title={"Add Bank Account"}>
        <AddBanksModal close={() => setShowModal(false)} refetch={refetch} />
      </Modal>
      <Edit title={selected?.account_name}>
        <EditBanksModal item={selected} close={() => showEdit(false)} refetch={refetch} />
      </Edit>
      <Delete title="" noHead>
        <ReusableModal
          title="Are you sure you want to delete this account?"
          cancelTitle="No, cancel"
          actionTitle="Yes, delete"
          closeModal={() => showDelete(false)}
          action={handleDelete}
          isBusy={isBusy}
        />
      </Delete>
    </>
  );
};

export default AdminSubBank;
