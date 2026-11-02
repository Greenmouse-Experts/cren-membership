// @ts-nocheck
import React from 'react'
import useGetHook from '../hook/useGet'
import { formatAsNgnMoney } from '../services/helpers'
import dayjs from 'dayjs'

const ConfirmedPayments = () => {
    const {data, loading} = useGetHook('member/payments/approved')
    return (
        <>
        <div className="">
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
                        Reference
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
                        Amount
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
                        Channel
                      </th>
                      <th
                        scope="col"
                        className="px-6 lg:px-10 align-middle py-3 fs-500 whitespace-nowrap text-left"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data &&
                      data.data.map((item, i) => (
                        <tr key={i}>
                          <td className="align-middle fs-500 whitespace-nowrap px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
                            {i + 1}
                          </td>
                          <td className="align-middle fs-500  px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
                            <div className="w-48">{item.ref_id}</div>
                          </td>
                          <td className="align-middle fs-500 whitespace-nowrap px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
                            <div>
                            <p>{item.due && item.due.description}</p>
                            </div>
                          </td>
                          <td className="align-middle fs-500 whitespace-nowrap px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
                            <p>{formatAsNgnMoney(item.amount)}</p>
                          </td>
                          <td className="align-middle fs-500 whitespace-nowrap px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
                            <p>{dayjs(item.created_at).format("DD/MM/YYYY")}</p>{" "}
                          </td>
                          <td className="align-middle fs-500 whitespace-nowrap px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
                            {item.channel}
                          </td>
                          <td className="align-middle fs-500 whitespace-nowrap px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
                            {item.status === "success" ? (
                              <span className="text-green-600 font-semibold">
                                Success
                              </span>
                            ) : (
                              <span className="text-red-600 font-semibold">
                                Failed
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </>
    )
}

export default ConfirmedPayments