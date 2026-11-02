// @ts-nocheck
import React from "react";
import "../stylesheet/layout.css";
import { BiSearch } from "react-icons/bi";
// eslint-disable-next-line
import { formatAsNgnMoney, formatString } from "../services/helpers";
import useGetHook from "../hook/useGet";
import dayjs from "dayjs";
import { useNavigate } from "@/lib/router-compat";

const Home = () => {
  const currentYear = new Date().getFullYear();
  const { data } = useGetHook(`member/dashboard?year=${currentYear}`);
  
  const navigate = useNavigate()
  return (
    <div className="pl-4">
      <div className="lg:grid grid-cols-2 gap-x-5">
        <div className="bg-white p-6 overflow-y-auto">
          <div className="flex px-2 justify-between items-center">
            <h2 className="text-xl font-semibold">Announcements</h2>
            <p className="text-[14px] font-medium text-blue-900 cursor-pointer" onClick={() => navigate('/dashboard/announce')}>View All</p>
          </div>
          <div className="grid gap-5 pr-3">
            {data &&
              data.data.recentFiveAnnouncement.map((item, i) => (
                <div className="shadow-lg rounded-lg p-2" key={i}>
                  <p className="font-[15px] font-semibold">{item.title}</p>
                  <p className="text-[13px]">
                    {formatString(item.content, 60)}
                  </p>
                </div>
              ))}
          </div>
        </div>
        <div className="p-6 bg-white">
          <div className="">
            <h2 className="font-semibold text-lg">Payments Alert</h2>{" "}
          </div>
          <div className="grid gap-5">
            {/* <p className="py-24 font-semibold text-center">No Payments Yet</p> */}
            {data && data.data.recentFivePayments.map((item, i) => (
               <div className="shadow-lg rounded-lg p-2" key={i}>
                <div className="flex justify-between">
                  <p className="font-medium text-blue-900">{item.channel}</p>
                  <p className="font-semibold text-[17px] ">{formatAsNgnMoney(item.amount)}</p>
                </div>
               <p className="font-[15px] font-semibold mt-3">{item?.due?.description? item?.due?.description : "Subscription" }</p>
               <p className="text-[13px]">
                 {/* {formatString(item.content, 60)} */}
               </p>
             </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6">
        {" "}
        <div className="w-full bg-white p-5">
          <div className="head_table">
            <h3 className="text-xl font-semibold">Recent Members</h3>
            
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
                        Member Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 lg:px-10 align-middle py-3 fs-500 whitespace-nowrap text-left"
                      >
                        Occupation
                      </th>
                      <th
                        scope="col"
                        className="px-6 lg:px-10 align-middle py-3 fs-500 whitespace-nowrap text-left"
                      >
                        Date Joined
                      </th>
                      
                    </tr>
                  </thead>
                  <tbody>
                    {data &&
                      data?.data?.recentFiveMembers.map((item, i) => (
                        <tr key={i}>
                          <td className="align-middle fs-500 whitespace-nowrap px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
                            {i + 1}
                          </td>
                          <td className="align-middle fs-500 whitespace-nowrap px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
                            <div>
                              <p>
                                {item.first_name} {item.last_name}
                              </p>
                            </div>
                          </td>
                          <td className="align-middle fs-500 whitespace-nowrap px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
                            <div>{item.occupation}</div>
                          </td>
                          <td className="align-middle fs-500 whitespace-nowrap px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
                            {dayjs(item.created_at).format("DD/MM/YYYY")}
                          </td>
                          <td className="align-middle fs-500 whitespace-nowrap px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
                            {item.status}
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
    </div>
  );
};

export default Home;
