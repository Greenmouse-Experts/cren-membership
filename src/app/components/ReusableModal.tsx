// @ts-nocheck
import React from "react";

const ReusableModal = ({
  title,
  closeModal,
  action,
  cancelTitle,
  actionTitle,
  isBusy
}) => {
  return (
    <div>
      <div className="px-6 text-center">{title}</div>
      <div className="w-full mt-8 flex justify-between">
        <button
          className="py-2 px-3 lg:px-6 rounded bg-red-600 text-white"
          onClick={closeModal}
        >{cancelTitle}</button>
        <button
          className="py-2 px-3 lg:px-6 bg-blue-900 rounded text-white"
          onClick={action}
        >{actionTitle}</button>
      </div>
    </div>
  );
};

export default ReusableModal;
