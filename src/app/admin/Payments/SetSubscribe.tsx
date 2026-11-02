// @ts-nocheck
import React from "react";
import { useState } from "react";
import { FiEdit } from "react-icons/fi";
import useModal from "../../hook/useModal";
import useGetHook from "../../hook/useGet";
import { formatAsNgnMoney } from "../../services/helpers";
import EditSubscription from "./EditSub";


const SetSubscribe = () => {
  const { data: subs, refetch } = useGetHook("admin/subscription");
  const { Modal, setShowModal } = useModal();
  const [selected, setSelected] = useState();
  const openModal = (item) => {
    setSelected(item);
    setShowModal(true);
  };
  return (
    <>
      <div className="relative">
        <div className="grid grid-cols-2 gap-x-3">
          {subs &&
            !!subs.data.length &&
            subs.data.map((item, i) => (
              <div key={i}>
                <div className="flex items-center gap-x-2">
                  <p>{item?.type}</p>
                  <FiEdit
                    className="text-blue-900"
                    onClick={() => openModal(item)}
                  />
                </div>
                <p className="font-semibold text-xl">
                  {formatAsNgnMoney(item.amount)}
                </p>
              </div>
            ))}
        </div>
      </div>
      <Modal title={"Edit Subscriptions"}>
        <EditSubscription refetch={refetch} close={() => setShowModal(false)} item={selected}/>
      </Modal>
    </>
  );
};

export default SetSubscribe;
