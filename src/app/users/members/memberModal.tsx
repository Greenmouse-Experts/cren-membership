// @ts-nocheck

import React from "react";
import useGetHook from "../../hook/useGet";
import { FaTimes } from "react-icons/fa";

const MemberModal = ({ item, close }) => {
  
 const { data, loading } = useGetHook(`member/view/member?member_id=${item.id}`);
 console.log(data)

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
            <p className="text-lg font-semibold ">
              {item.first_name} {item.last_name}
            </p>
            <FaTimes onClick={close} className="" />
          </div>
          {!data && <p className="py-12 text-center">Loading....</p>}
          <div className="oveflow-y-auto px-3">
            {data && (
              <div className="grid lg:grid-cols-2 gap-y-2 py-3 overflow-y-auto pr-3">
                <div>
                  <p className="text-gray-500">First Name:</p>
                  <p className="font-semibold">{item.first_name}</p>
                </div>
                <div>
                  <p className="text-gray-500">Last Name:</p>
                  <p className="font-semibold">{item.last_name}</p>
                </div>
                {/* <div>
                  <p className="text-gray-500">User Name:</p>
                  <p className="font-semibold">{item.username}</p>
                </div> */}
                <div>
                  <p className="text-gray-500">Email:</p>
                  <p className="font-semibold">{item.email}</p>
                </div>
                <div>
                  <p className="text-gray-500">Address:</p>
                  <p className="font-semibold">
                    {item.address} {item.state}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Phone:</p>
                  <p className="font-semibold">{item.phone_number}</p>
                </div>
                <div>
                  <p className="text-gray-500">Marital Status:</p>
                  <p className="font-semibold">{item.marital_status}</p>
                </div>
                <div>
                  <p className="text-gray-500">Gender:</p>
                  <p className="font-semibold">{item.gender}</p>
                </div>
                <div>
                  <p className="text-gray-500">Occupation:</p>
                  <p className="font-semibold">
                    {item.occupation}
                  </p>
                </div>
                {/* <div>
                  <p className="text-gray-500">Business Category:</p>
                  <p className="font-semibold">
                    {item.nature_business_employment}
                  </p>
                </div> */}
               
                {/* <div>
                  <p className="text-gray-500">Account Status:</p>
                  <p className="font-semibold">{item.status}</p>
                </div> */}
                <div>
                  <p className="text-gray-500">Passport:</p>
                  {item.passport && <a href={item.passport} target="_blank">
                    <img
                      src={item.passport}
                      alt="cert"
                      className="w-24 border cursor-pointer"
                    />
                  </a>}
                </div>
                {/* <div>
                  <p className="text-gray-500">Certificates:</p>
                  {item.certificates && <a href={item.certificates} target="_blank">
                    <img
                      src={item.certificates}
                      alt="cert"
                      className="w-24 border cursor-pointer"
                    />
                  </a>}
                </div> */}
              </div>
            )}
          </div>
          <div className="py-3"></div>
        </div>
      </div>
    </div>
  );
};

export default MemberModal;



