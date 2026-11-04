// @ts-nocheck
import React, { useEffect, useState } from "react";
import useGetHook from "../../hook/useGet";
import dayjs from "dayjs";
import { formatAsNgnMoney } from "../../services/helpers";
import { RiSecurePaymentFill } from "react-icons/ri";
import { FiUploadCloud } from "react-icons/fi";
import useModal from "../../hook/useModal";
import UploadReceipt from "../../users/UploadReceipt";
import usePostHook from "../../hook/usePost";
import { toast } from "react-toastify";
import { usePaystackPayment } from "react-paystack";

const MembersDues = () => {
  const { data: due, loading, refetch } = useGetHook("member/payments");
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState("");
  const [id, setId] = useState("");
  const { Modal, setShowModal } = useModal();
  const openUpload = (item) => {
    setId(item);
    setSelected(item);
    setShowModal(true);
  };
  useEffect(() => {
    if (!!due?.data.length) {
      const filtered = due?.data.filter((where) => where.status === "Active");
      setData(filtered);
    }
  }, [due]);

  // paystack
  const email = localStorage.getItem("igbo_email");

  const { handlePost } = usePostHook();
  const mySuccess = () => {
    refetch();
    toast.success("Payment successfully");
    localStorage.removeItem("igbo_id");
  };
  const verifyPayment = (reference) => {
    const payload = {
      due_id: localStorage.getItem("igbo_id"),
      ref_id: reference,
    };
    handlePost(`member/payment/callback`, payload, `application/json`, mySuccess);
  };
  // you can call this function anything
  const onSuccess = (reference) => {
    verifyPayment(reference.reference);
  };

  // you can call this function anything
  const onClose = () => {
    // implementation for  whatever you want to do when the Paystack dialog closed.
    console.log("closed");
  };

  const PaystackHookButton = ({ item }) => {
    const config = {
      reference: new Date().getTime().toString(),
      email: email,
      amount: Number(item?.amount) * 100, //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
      publicKey: `pk_test_49f890a833251838e552b28276e8e42006444ce7`,
    };
    const initializePayment = usePaystackPayment(config);
    return (
      <div>
        <p
          className="flex cursor-pointer bg-blue-900 text-white justify-center py-1 rounded-lg gap-x-2 items-center"
          onClick={() => {
            initializePayment(onSuccess, onClose);
          }}
        >
          <RiSecurePaymentFill />
          Pay Now
        </p>
      </div>
    );
  };
  console.log(selected);
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
                        Description
                      </th>
                      <th
                        scope="col"
                        className="px-6 lg:px-10 align-middle py-3 fs-500 whitespace-nowrap text-left"
                      >
                        Category
                      </th>
                      <th
                        scope="col"
                        className="px-6 lg:px-10 align-middle py-3 fs-500 whitespace-nowrap text-left"
                      >
                        Duration
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
                        Account Details
                      </th>
                      <th
                        scope="col"
                        className="px-6 lg:px-10 align-middle py-3 fs-500 whitespace-nowrap text-left"
                      >
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data &&
                      data.map((item, i) => (
                        <tr key={i}>
                          <td className="align-middle fs-500 whitespace-nowrap px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
                            {i + 1}
                          </td>
                          <td className="align-middle fs-500  px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
                            <div className="w-48">{item.description}</div>
                          </td>
                          <td className="align-middle fs-500 whitespace-nowrap px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
                            <div>
                              <p>{item.category.name}</p>
                            </div>
                          </td>
                          <td className="align-middle fs-500 whitespace-nowrap px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
                            <div className="flex gap-x-2">
                              <p>{item.start_date}</p>
                              <p>{item.end_date}</p>
                            </div>
                          </td>
                          <td className="align-middle fs-500 whitespace-nowrap px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
                            <div>
                              <p>{formatAsNgnMoney(item.amount)}</p>
                            </div>
                          </td>
                          <td className="align-middle fs-500 whitespace-nowrap px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
                            <p>{item.category.bank.bank_name}</p>
                            <p>{item.category.bank.account_name}</p>
                            <p>{item.category.bank.account_number}</p>
                          </td>
                          <td className="align-middle text-[14px] whitespace-nowrap px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
                            {/* <div onClick={() => localStorage.setItem("igbo_id", item.id)}>
                              <PaystackHookButton item={item} />
                            </div> */}
                            <p
                              className="mt-4 cursor-pointer flex bg-gray-900 w-44 text-white justify-center py-1 rounded-lg gap-x-2 items-center"
                              onClick={() => openUpload(item.id)}
                            >
                              <FiUploadCloud />
                              Upload Receipt
                            </p>
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
      <Modal title={"Upload Payment Receipt"}>
        <UploadReceipt close={() => setShowModal(false)} id={selected} refetch={refetch} />
      </Modal>
    </>
  );
};

export default MembersDues;
