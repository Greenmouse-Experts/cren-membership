// @ts-nocheck
import React, { useState } from "react";
import { MdAddCircleOutline } from "react-icons/md";
import { TfiAnnouncement } from "react-icons/tfi";
import { RiDeleteBin5Line } from "react-icons/ri";
import useGetHook from "../../hook/useGet";
import useModal from "../../hook/useModal";

import { formatString } from "../../services/helpers";
import dayjs from "dayjs";
import ViewGallery from "../../admin/Gallery/ViewGallery";
import EditGallery from "../../admin/Gallery/EditGallery";
import ReusableModal from "../../components/ReusableModal";
import usePostHook from "../../hook/usePost";
import { toast } from "react-toastify";
import AddGallery from "../../admin/Gallery/AddDGallery";

const Gallery = () => {
  const [selected, setSelected] = useState();
  const [isBusy, setIsBusy] = useState(false);
  const { data, loading, refetch } = useGetHook("admin/frontend/gallery");
  console.log(data);
  const { handlePost } = usePostHook();
  const { Modal, setShowModal } = useModal();
  const { Modal: Delete, setShowModal: showDelete } = useModal();
  const { Modal: View, setShowModal: showView } = useModal();
  const { Modal: Edit, setShowModal: showEdit } = useModal();
  const openViewGallery = (item) => {
    setSelected(item);
    showView(true);
  };
  const openEdit = () => {
    showView(false);
    showEdit(true);
  };
  const openDelete = (item) => {
    setSelected(item);
    showDelete(true);
  };
  const onSuccess = () => {
    setIsBusy(false);
    refetch();
    toast.success("Gallery deleted successfully");
    showDelete(false);
  };
  const handleDelete = () => {
    setIsBusy(true);
    const payload = {};
    handlePost(
      `admin/frontend/delete/gallery?gallery_id=${selected.id}`,
      payload,
      `application/json`,
      onSuccess,
    );
  };
  return (
    <>
      <div className="p-6 bg-white min-h-screen m-2">
        <div className="flex items-center justify-between px-4">
          <p className="text-2xl font-semibold">CREN Gallery</p>
          <button
            className="flex items-center  gap-x-2 p-2 px-4 text-blue-900 font-semibold border border-blue-900 rounded"
            onClick={() => setShowModal(true)}
          >
            <MdAddCircleOutline />
            Add
          </button>
        </div>
        <div className="pt-10 px-3 grid grid-cols-[repeat(auto-fill,_minmax(22.5rem,_1fr))] gap-11">
          {data &&
            data?.data.length &&
            data.data.map((item, i) => (
              <div
                className="shadow w-full flex flex-col items-center relative justify-between hover:scale-105 duration-100 cursor-pointer"
                onClick={() => openViewGallery(item)}
                key={i}
              >
                <h6 className="text-xl capitalize font-semibold">{item.title}</h6>
                <img src={item.image} alt="" className="w-full" />
                <div
                  className="pr-6 flex gap-x-2 absolute top-10 right-4 bg-white p-2 rounded-md"
                  onClick={(e) => e.stopPropagation()}
                >
                  <p>{dayjs(item.created_at).format("ddd-DD-MM-YYYY")}</p>
                  <RiDeleteBin5Line
                    className="text-xl text-red-600"
                    onClick={() => openDelete(item)}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
      <Modal title={"Add Gallery"}>
        <AddGallery close={() => setShowModal(false)} refetch={refetch} />
      </Modal>
      <View title={selected?.title}>
        <ViewGallery close={() => setShowModal(false)} item={selected} openEdit={openEdit} />
      </View>
      <Edit title={"Edit Gallery"}>
        <EditGallery item={selected} refetch={refetch} close={() => showEdit(false)} />
      </Edit>
      <Delete title="" noHead>
        <ReusableModal
          title="Are you sure you want to delete this gallery?"
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

export default Gallery;
