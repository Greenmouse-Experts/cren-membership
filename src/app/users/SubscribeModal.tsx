// @ts-nocheck
import React, { useState } from "react";
import { usePaystackPayment } from "react-paystack";
import useGetHook from "../hook/useGet";
import usePostHook from "../hook/usePost";
import { toast } from "react-toastify";
import LoaderSmall from "../components/LoaderSmall";

const SubscribeModal = () => {
  const { data } = useGetHook("member/subscription");
  console.log(data);
  console.log(data?.data.amount);
  const fname = localStorage.getItem("fName");
  const [receipt, setReceipt] = useState(null);
  const email = localStorage.getItem("igbo_email");
  const { handlePost } = usePostHook();
  // const config = {
  //   reference: new Date().getTime().toString(),
  //   email: email,
  //   amount: data?.data?.amount * 100, //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
  //   publicKey: `pk_test_49f890a833251838e552b28276e8e42006444ce7`,
  // };
  const isSuccess = () => {
    localStorage.setItem("igbo_sub", "1");
    toast.success("Subscription paid successfully");
    window.location.reload();
  };
  // you can call this function anything
  const handleSubmit = () => {
    console.log();
    const fd = new FormData();
    fd.append("subscription_id", data?.data?.id);
    fd.append("receipt", receipt);
    handlePost(`member/subscription/upload/manual/receipt`, fd, `multipart/form-data`, isSuccess);
  };

  // you can call this function anything
  const onClose = () => {
    // implementation for  whatever you want to do when the Paystack dialog closed.
    console.log("closed");
  };
  // const PaystackHookButton = () => {
  //   // const initializePayment = usePaystackPayment(config);
  //   return (
  //     <div>
  //       <button
  //         className="bg-blue-900 text-white font-semibold px-6 py-2 rounded-lg"
  //         onClick={() => {
  //           initializePayment(onSuccess, onClose);
  //         }}
  //       >
  //         Subscribe Now
  //       </button>
  //     </div>
  //   );
  // };

  return (
    <div className="fixed flex justify-center items-center h-screen w-full top-0 left-0 bg-[#00000066]">
      <div className="w-11/12 lg:w-5/12 bg-white">
        {!data ? (
          <div>
            {" "}
            <LoaderSmall />
          </div>
        ) : (
          <div className="p-5 flex flex-col items-center gap-4">
            <p className="font-bold text-2xl text-center">Welcome to CREN</p>
            <p className="mt-8 text-center px-3">
              Hello {fname}, we are glad to have you on CREN, Please pay the sum of{" "}
              {data?.data.amount}&#8364; to {data?.data.bank} in order gain access to all services
              available on CREN.
            </p>
            <div className="mt-6 flex justify-center">
              <div className="flex flex-col">
                <label htmlFor=""> click upload receipt</label>
                <input type="file" name="" id="" onChange={(e) => setReceipt(e.target.files[0])} />
              </div>
              {/* <PaystackHookButton /> */}
            </div>
            <button
              onClick={() => handleSubmit()}
              className="bg-blue-900 text-white font-semibold px-6 py-2 rounded-lg text-center"
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscribeModal;
