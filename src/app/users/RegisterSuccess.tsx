// @ts-nocheck
import React from "react";
import { FaTimes } from "react-icons/fa";

const RegisterSuccess = ({close}) => {
  return (
    <div className="relative">
      <div className="p-5">
        <img
          src="https://cdn.2dimensions.com/screenshots/flare-9-6-129-2-11-1548112166-682x512-1548112220"
          alt="check"
          className="w-56 mx-auto"
        />
        <p className="text-center font-semibold text-2xl">Registration Successful</p>
        <p className="text-center mt-4">Your registration has been successfully processed. Within the next 24 hours, you will receive an email from the administrator containing your login details for accessing your Admin dashboard</p>
      </div>
      <FaTimes className="absolute top-3 right-3 text-gray-400" onClick={close}/>
    </div>
  );
};

export default RegisterSuccess;
