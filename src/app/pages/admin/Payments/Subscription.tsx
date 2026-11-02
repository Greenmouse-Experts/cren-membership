// @ts-nocheck
import React, { useState } from "react";
import useGetHook from "../../../hook/useGet";
import SetSubscribe from "../../../admin/Payments/SetSubscribe";
import { formatAsNgnMoney } from "../../../services/helpers";
import dayjs from "dayjs";
import { BsEyeFill } from "react-icons/bs";
import ReceiptModal from "./ReceiptModal";
import ReusableModal from "../../../components/ReusableModal";
import useModal from "../../../hook/useModal";
import axios from "axios";
import { toast } from "react-toastify";

const SubscriptionPayments = () => {
  const { data,  refetch, } = useGetHook("admin/get/subscription/transactions");

  const [showDetails, setShowDetails] = useState(false);
  const [image, setImage] = useState("");
  const [selected, setSelected] = useState();
  const [isBusy, setIsBusy] = useState();
  const { Modal: Verify, setShowModal: ShowVerify } = useModal();

  const handleView = (image) => {
    setShowDetails(true);
    setImage(image);
  };

  const VerifyMember = async () => {
    const token  = localStorage.getItem("igbo_token");
    try {
      const config = {
        headers: {
          "Content-Type": "Application/json",
         Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.post(
        `https://api.ndiigbogermany.org/api/admin/member/subscribe?user_id=${selected.user_id}`,
        {},
        config
      );
      const data = res.data;
      setIsBusy(false);
      toast.success(data.message);
      refetch();
      ShowVerify(false);
      
    } catch (error) {
      toast.error(error.message);
      setIsBusy(false);
    }
  };

  const openVerify = (item) => {
    console.log(item.user_id)
    setSelected(item);
    ShowVerify(true);
  };

  return (
    <>
      <div className="mx-2 p-6 bg-white min-h-[70vh]">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-xl">Subscription Payments</p>
        </div>
        <div className="mt-12">
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
                        Reference ID
                      </th>
                      <th
                        scope="col"
                        className="px-6 lg:px-10 align-middle py-3 fs-500 whitespace-nowrap text-left"
                      >
                        Paid By
                      </th>
                      <th
                        scope="col"
                        className="px-6 lg:px-10 align-middle py-3 fs-500 whitespace-nowrap text-left"
                      >
                        Account Type
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
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 lg:px-10 align-middle py-3 fs-500 whitespace-nowrap text-left"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 lg:px-10 align-middle py-3 fs-500 whitespace-nowrap text-left"
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.data.map((item, i) => (
                      <tr key={i}>
                        <td className="align-middle fs-500 whitespace-nowrap px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
                          {i + 1}
                        </td>
                        <td className="align-middle fs-500  px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
                          <div className="w-48">{item.ref_id}</div>
                        </td>
                        <td className="align-middle fs-500 whitespace-nowrap px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
                          <div>
                            <p>{item.user.name_of_member_organization}</p>
                            <p>{item.user.name_of_representative}</p>
                          </div>
                        </td>
                        <td className="align-middle fs-500 whitespace-nowrap px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
                          <div>
                            <p>{item.user.account_type}</p>
                          </div>
                        </td>
                        <td className="align-middle fs-500 whitespace-nowrap px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
                          <div>
                            <p>{formatAsNgnMoney(item.amount)}</p>
                          </div>
                        </td>
                        <td className="align-middle fs-500 whitespace-nowrap px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
                          {item.status === "success" && (
                            <span className="text-green-600 font-semibold">
                              {item.status}
                            </span>
                          )}
                           {item.status === "confirmed" && (
                            <span className="text-green-600 font-semibold">
                              {item.status}
                            </span>
                          )}
                          {item.status === "pending" && (
                            <span className="text-yellow-600 font-semibold">
                              {item.status}
                            </span>
                          )}
                          {item.status === "failed" && (
                            <span className="text-red-600 font-semibold">
                              {item.status}
                            </span>
                          )}
                        </td>
                        <td className="align-middle fs-500 whitespace-nowrap px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
                          {dayjs(item.paid_at).format("DD-MM-YYYY")}
                        </td>
                        <td className="  gap-4 items-center justify-center fs-500 whitespace-nowrap px-6 lg:px-10 py-4 text-left border-b h-full ">
                          <div
                            className="flex gap-3 "
                          >
                            <span      className=" cursor-pointer "
                            onClick={() => handleView(item.receipt)}>

                            <BsEyeFill size={25} className="text-blue-800" />
                            </span>

                            <span>
                            <p className=" cursor-pointer fs-500"   onClick={() => openVerify(item)}>Verify</p>
                            </span>
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
      {showDetails && (
        <ReceiptModal item={image} close={() => setShowDetails(false)} />
      )}
         <Verify title={""} noHead>
        <ReusableModal
          title={"Are you sure you want to verify this transaction?"}
          cancelTitle="No, cancel"
          actionTitle="Yes, Verify"
          closeModal={() => ShowVerify(false)}
          action={() => VerifyMember("Verify")}
          isBusy={isBusy}
        />
      </Verify>
    </>
  );
};

export default SubscriptionPayments;
