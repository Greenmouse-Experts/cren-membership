// @ts-nocheck
import { API_URL } from "@/app/services/env";
import React, { useEffect, useState } from "react";
import { BiSearch, BiPlus } from "react-icons/bi";
import dayjs from "dayjs";
import { ThreeCircles } from "react-loader-spinner";
import AddFellow from "../../admin/AddFellow";
import useGetHook from "../../hook/useGet";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { BsEyeFill } from "react-icons/bs";
import useModal from "../../hook/useModal";
import ReusableModal from "../../components/ReusableModal";
import axios from "axios";
import { toast } from "react-toastify";
import MemberModal from "../../admin/members/memberModal";
import MessageModal from "../../admin/Message/MessageModal";

const Messages = () => {
  const {
    data,
    isLoading: loading,
    refetch,
  } = useGetHook("admin/frontend/contact-us");
  const [showDetails, setShowDetails] = useState(false);
  const [showAddMemberPopup, setShowAddMemberPopup] = useState(false);
  const [moreDetails, setMoreDetails] = useState({});

  console.log(data, "members");

  const handleAddMemberClick = () => {
    setShowAddMemberPopup(true);
  };

  const handleCloseAddMemberPopup = () => {
    setShowAddMemberPopup(false);
  };

  const downloadAsPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [
        [
          "S/N",
          "Member Id",
          "Member Name",
          "Email",
          "State",
          "Date created",
          "Status",
        ],
      ],
      body: data?.data.map((item, index) => [
        index + 1,
        item.membership_id,
        `${item.first_name} ${item.last_name}`,
        item.email,
        item.state,
        dayjs(item.created_at).format("DD-MMM -YYYY"),
        item.status,
      ]),
    });

    doc.save("members.pdf");
  };
  const [items, setItems] = useState([]);
  const [isBusy, setIsBusy] = useState();
  const [selected, setSelected] = useState();

  const { Modal: Activate, setShowModal: ShowActivate } = useModal();
  const { Modal: Deactivate, setShowModal: ShowDeactivate } = useModal();
  useEffect(() => {
    if (data) {
      setItems(data?.data);
    }
  }, [data]);
  const openActivate = (item) => {
    setSelected(item);
    ShowActivate(true);
  };
  const openDelete = (item) => {
    setSelected(item);
    ShowDeactivate(true);
  };
  const openDetails = (item) => {
    setSelected(item);
    setShowDetails(true);
  };
  // change account status
  const deleteMessage = async (status) => {
    const token = localStorage.getItem("igbo_token");

    try {
      const config = {
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.post(
        `${API_URL}/admin/frontend/delete/contact-us?contact_id=${selected.id}`,
        {},
        config
      );
      const data = res.data;
      setIsBusy(false);
      toast.success(data.message);
      refetch();
      ShowActivate(false);
      ShowDeactivate(false);
    } catch (error) {
      setIsBusy(false);
    }
  };

  return (
    <div className="px-5">
      <div className="p-6 bg-white">
        <div className="admin_head">
          <div className="leftt">
            <h3 className="text-2xl font-semibold">Contact us Messages</h3>
           
          </div>
        </div>
        {loading && (
          <div className="">
            <ThreeCircles
              height="100"
              width="100"
              color="#015907"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
              ariaLabel="three-circles-rotating"
              outerCircleColor=""
              innerCircleColor=""
              middleCircleColor=""
            />
          </div>
        )}
        {!loading && (
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
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 lg:px-10 align-middle py-3 fs-500 whitespace-nowrap text-left"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-6 lg:px-10 align-middle py-3 fs-500 whitespace-nowrap text-left"
                      >
                        Phone
                      </th>
                      <th
                        scope="col"
                        className="px-6 lg:px-10 align-middle py-3 fs-500 whitespace-nowrap text-left"
                      >
                        Subject
                      </th>
                      {/* <th
                        scope="col"
                        className="px-6 lg:px-10 align-middle py-3 fs-500 whitespace-nowrap text-left"
                      >
                        Subscription
                      </th> */}
                      <th
                        scope="col"
                        className="px-6 lg:px-10 align-middle py-3 fs-500 whitespace-nowrap text-left"
                      >
                        Date Sent
                      </th>
                      <th
                        scope="col"
                        className="px-6 lg:px-10 align-middle py-3 fs-500 whitespace-nowrap text-left"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {!!items?.length &&
                      items?.map((item, i) => (
                        <tr key={i}>
                          <td className="align-middle fs-500 whitespace-nowrap px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
                            {i + 1}
                          </td>
                          <td className="align-middle fs-500  px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
                            <div className="font-semibold text-blue-900">
                              {item.name}
                            </div>
                          </td>
                          <td className="align-middle fs-500 whitespace-nowrap px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
                            {item.email}
                          </td>
                          <td className="align-middle fs-500 whitespace-nowrap px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
                            {item.phone}
                          </td>
                          <td className="align-middle fs-500 whitespace-nowrap px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
                            {item.subject.slice(0, 13)}...
                          </td>
                          <td className="align-middle fs-500 whitespace-nowrap px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
                            {dayjs(item.created_at).format("DD-MMM -YYYY")}
                          </td>
                          <td
                            className="align-middle fs-500 whitespace-nowrap px-6 lg:px-10 py-4 text-left border-b text-semibold text-red-600 cursor-pointer border-[#CECECE]"
                            onClick={() => openDelete(item)}
                          >
                            Delete
                          </td>

                          <td className="align-middle fs-500 whitespace-nowrap px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
                            <div className="flex gap-x-3 cursor-pointer">
                              <BsEyeFill
                                onClick={() => {
                                  setMoreDetails(item);
                                  setShowDetails(true);
                                }}
                                className="text-xl text-blue-900"
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
      {showAddMemberPopup && (
        <div className="popup">
          <AddFellow onClose={handleCloseAddMemberPopup} refetch={refetch} />
        </div>
      )}
      {showDetails && (
        <MessageModal item={moreDetails} close={() => setShowDetails(false)} />
      )}

      <Deactivate title={""} noHead>
        <ReusableModal
          title={"Are you sure you want to delete this info?"}
          cancelTitle="No, cancel"
          actionTitle="Yes, Delete"
          closeModal={() => ShowDeactivate(false)}
          action={() => deleteMessage("deactivate")}
          isBusy={isBusy}
        />
      </Deactivate>
    </div>
  );
};

export default Messages;
