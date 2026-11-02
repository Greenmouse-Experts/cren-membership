// @ts-nocheck
import React, { Fragment, useState } from "react";
import { FaTimes } from "react-icons/fa";

const useModal = () => {
  const [showModal, setModal] = useState(false);
  const [modalBusy, setModalBusy] = useState(false);

  const setShowModal = (state) => setModal(state);

  const Modal = ({ title, children, noHead }) => {
    return (
      <>
        {showModal && (
          <div
            className="fixed top-0 left-0 index-30 w-full h-screen flex items-center justify-center bg-[#00000066]"
            onClick={() => setShowModal(false)}
          >
            <div
              className={`rounded shade bg-white ${
                noHead
                  ? "w-11/12 md:w-6/12 lg:w-4/12 xl:w-3/12"
                  : "w-11/12 md:w-8/12 lg:w-6/12 xl:w-5/12"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {!noHead && (
                <div className="flex items-start justify-between py-3 px-5 bg-[#015907] text-white border-b rounded-t dark:border-gray-600">
                  <h3 className="text-xl font-semibold ">{title}</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    type="button"
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    data-modal-hide="defaultModal"
                  >
                    <FaTimes />
                  </button>
                </div>
              )}
              <div className="p-6">{children}</div>
            </div>
          </div>
        )}
      </>
    );
  };
  return { Modal, showModal, setShowModal, setModalBusy };
};

export default useModal;
