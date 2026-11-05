// @ts-nocheck
import React from "react";
import useGetHook from "../../hook/useGet";
import { FaTimes } from "react-icons/fa";
import dayjs from "dayjs";

const CardModal = ({ item, close }) => {
  const { data, loading } = useGetHook(`member/view/member?member_id=${item.id}`);
  const { data: user, refetch } = useGetHook("member/profile");

  console.log(data);
  console.log(data);

  return (
    <div
      className="fixed flex justify-center items-center h-screen w-full top-0 left-0 bg-[#00000066] "
      onClick={close}
    >
      {!data ? (
        <div>
          <p>Loading</p>{" "}
        </div>
      ) : (
        <div
          className="w-11/12 lg:w-7/12 bg-white relative flex gap-5"
          onClick={(e) => e.stopPropagation()}
        >
          <FaTimes onClick={close} className="absolute top-3 right-3" />
          <div className=" w-[20rem] h-[38rem] flex flex-col items-center mx-auto bg-[#f4f4f4] ">
            <div className="relative w-full ">
              <img src="/card-bg.png" alt="" />
              <div className=" absolute top-2 left-1/2 -translate-x-1/2 flex  flex-col items-center gap-3">
                <img src={user?.data?.avatar} alt="" className="rounded-full w-[5rem] h-[5rem]" />
                <p className=" uppercase text-center text-white font-semibold">
                  {user?.data?.name_of_member_organization}
                </p>
                <img
                  src={data.data.passport}
                  alt="passport"
                  className=" bottom-4  w-[7rem] h-[7rem]  rounded-full"
                />
              </div>
            </div>
            <div className="w-full pt-20 p-5">
              <p className="text-2xl text-[#015907] font-semibold mt-5 text-center">
                {data.data.first_name} {data.data.last_name}
              </p>
              <p className="font-medium text-center">{data.data.occupation}</p>
              <div className="w-full mt-3 text-start flex flex-col gap-2">
                <p className="text-sm font-medium flex gap-3">
                  {" "}
                  <span>ID NO :</span> <span>GT/06/24/089</span>
                </p>
                <p className="text-sm font-medium flex gap-3">
                  {" "}
                  <span>EMAIL :</span> <span>{data.data.email}</span>
                </p>
                <p className="text-sm font-medium flex gap-3">
                  {" "}
                  <span>PHONE :</span> <span>{data.data.phone_number}</span>
                </p>
                <p className="text-sm font-medium flex gap-3">
                  {" "}
                  <span>GENDER:</span> <span>{data.data.gender}</span>
                </p>
                <p className="text-sm font-medium flex gap-3">
                  {" "}
                  <span>MARITAL STATUS :</span> <span>{data.data.marital_status}</span>
                </p>
                <p className="text-sm font-medium flex gap-3">
                  {" "}
                  <span>ADDRESS :</span> <span>{data.data.address}</span>
                </p>
              </div>
              <p className="text-sm mt-4rem text-center  border border-t-[#222222] italic py-1 mt-2">
                {" "}
                {dayjs(data.data.created_at).format("DD-MMM -YYYY")}
              </p>
            </div>
          </div>
          <div className="p-5 w-[20rem] h-[38rem] flex flex-col items-center mx-auto bg-[#f4f4f4]  relative pt-20">
            <p className="text-lg font-semibold text-center">
              This ID card remains the property of {user?.data?.name_of_member_organization}
            </p>
            <p className="text-lg font-semibold text-center mt-3">
              If found please contact {user?.data?.email} or call {user?.data?.phone_number} or
              visit {user?.data?.address}
            </p>
            <img src="/logo.png" alt="" className="bottom-0 absolute" />
          </div>
        </div>
      )}
    </div>
  );
};

export default CardModal;
