// @ts-nocheck
import React from "react";
import "../stylesheet/layout.css";
import img1 from "../image/profit 5.png";
import img2 from "../image/profit 6.png";
import img3 from "../image/profit 7.png";
import useGetHook from "../hook/useGet";
import dayjs from "dayjs";
import { formatAsNgnMoney } from "../services/helpers";
import MembersJoined from "./charts/membersJoined";
import DuesPayment from "./charts/duesPayment";
// eslint-disable-next-line

const Admin = () => {
  const currentYear = new Date().getFullYear();
  const { data: user, refetch } = useGetHook(`admin/dashboard?year=${currentYear}`)

  console.log(user)

  const list = [
    {
      head: "Total Members",
      num: user?.data.totalPartnerMembers,
      Image: img1,
    },
    {
      head: "Total Partners Members",
      num: user?.data.totalPartner,
      Image: img2,
    },
    {
      head: "Total Dues Paid",
      num: user && formatAsNgnMoney(user?.data.totalDuesPaid),
      Image: img3,
    },
    {
      head: "Total Subscription Paid",
      num: user && formatAsNgnMoney(user?.data.totalSubscriptionPaid),
      Image:
        "https://img.freepik.com/premium-vector/sack-money-big-pile-cash-money-icon-illustration-money-bag-flat-icon_385450-362.jpg",
    },
  ];

  return (
    <div className="home">
      <div className="home_top">
        {" "}
        <div className="bg-white p-6 w-[99%] lg:w-[70%]">
          <div className="head_table">
            <p className="text-xl font-semibold">Recent Members</p>
            {/* <div className="searchh">
              <input type="text" placeholder="Search by name" />
              <span>
                <BiSearch />
              </span>
            </div> */}
          </div>
          <div className="w-full overflow-x-auto">
          <table className="overflow-x-auto">
            <thead>
              <tr>
                <th className="whitespace-nowrap">S/N</th>
                <th className="whitespace-nowrap">Member Id</th>
                <th className="whitespace-nowrap">Member Name</th>
                <th className="whitespace-nowrap">Member Type</th>
                <th className="whitespace-nowrap">Subscription</th>
                <th className="whitespace-nowrap">Date Registered</th>
              </tr>
            </thead>
            <tbody>
              {user &&
                user?.data?.latestFiveMember.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.membership_id}</td>
                    <td>
                      {item.name_of_member_organization}
                    </td>
                    <td>{item.account_type}</td>
                    <td>
                      {item?.isSubscribed === "0" ? (
                        <span className="px-2 py-1 text-sm bg-orange-100 font-medium rounded-lg">
                          Unsubscribed
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-sm bg-green-100 font-medium rounded-lg">
                          Subscribed
                        </span>
                      )}
                    </td>
                    <td>{dayjs(item.created_at).format('DD-MM-YYYY')}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          </div>
        </div>
        <div className="top_right">
          {list.map((item) => (
            <div className="">
              <div className="_text">
                <p>{item.head}</p> <h3>{item.num}</h3>{" "}
              </div>{" "}
              <img src={item.Image} alt="" className="w-[60px]" />
            </div>
          ))}
        </div>
      </div>
      <div className="home_bottom">
        <div className="l">
          <div className="line">
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold text-xl">Monthly Payment Dues</h2>
              {/* <button className="flex items-center gap-x-2 bg-blue-900 text-white px-2 py-1 rounded-lg">
                Monthly (2023){" "}
                <span>
                  <IoIosArrowDown />
                </span>
              </button> */}
            </div>
            {user && <DuesPayment data={user?.data?.usersPayments}/>}
          </div>
        </div>
        <div className="b">
          <div className="bar">
            <h2 className="font-semibold mb-2">Monthly Members joined</h2>{" "}
            {user && <MembersJoined className="v" data={user?.data?.monthly_members_joined} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
