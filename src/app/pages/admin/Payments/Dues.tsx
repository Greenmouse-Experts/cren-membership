// @ts-nocheck
import React from "react";
import useGetHook from "../../../hook/useGet";
import { formatAsNgnMoney } from "../../../services/helpers";
import { useState } from "react";
import { useEffect } from "react";
import useModal from "../../../hook/useModal";
import ConfirmDuesPayment from "../../../admin/Dues/Dues/CofirmDues";

const DuesPayments = () => {
  const { data, refetch } = useGetHook("admin/dues/all/payments");
  const {Modal, setShowModal} = useModal()
  const [selected, setSelected] = useState('')
  const [dues, setDues] = useState([])
  const confirmModal = (item) => {
    setSelected(item)
    setShowModal(true)
  }
  useEffect(() => {
    setDues(data?.data)
  }, [data])
  const handleChange = (e) => {
    if(e.target.value === ""){
      return setDues(data?.data)
    }
    const filtered = data.data.filter((where) => where.status === e.target.value)
    setDues(filtered)
  }
  return (
    <>
      <div className="mx-2 p-6 bg-white min-h-[70vh]">
        <div>
          <p className="font-semibold text-xl">Dues Payments</p>
        </div>
        <div className="mt-12">
          <div className="flex justify-end">
            <div className="border border-gray-400 pr-2 rounded">
              <select className="" onChange={handleChange}>
                <option>Filter Payments</option>
                <option value={''}>All Payments</option>
                <option value={'success'}>Successful Payments</option>
                <option value={'pending'}>Pending Payments</option>
                <option value={'failed'}>Failed Payments</option>
              </select>
            </div>
          </div>
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
                        Channel
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dues && !!dues.length && dues.map((item, i) => (
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
                            <p>{formatAsNgnMoney(item.amount)}</p>
                          </div>
                        </td>
                        <td className="align-middle fs-500 whitespace-nowrap px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
                          {item.status === "success" ? (
                            <span className="text-green-600 font-semibold">
                              Success
                            </span>
                          ) : item.status === "pending" ? (
                            <p>
                              <span className="text-orange-600 font-semibold">
                                Pending
                              </span>
                              <span className="px-2 text-blue-900 font-semibold underline cursor-pointer" onClick={() => confirmModal(item)}>
                                Confirm
                              </span>
                            </p>
                          ) : (
                            <span className="text-red-600 font-semibold">
                              Failed
                            </span>
                          )}
                        </td>
                        <td className="align-middle fs-500 whitespace-nowrap px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
                          {item.channel}
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
      <Modal title={'Update Payment Status'}>
          <ConfirmDuesPayment item={selected} refetch={refetch} close={() => setShowModal(false)}/>
      </Modal>
    </>
  );
};

export default DuesPayments;
