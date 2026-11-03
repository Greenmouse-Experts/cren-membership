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

const Members = () => {
  const { data, isLoading: loading, refetch } = useGetHook("admin/member/retrieve/all");
  const [showDetails, setShowDetails] = useState(false);
  const [showAddMemberPopup, setShowAddMemberPopup] = useState(false);

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
      head: [["S/N", "Member Id", "Member Name", "Email", "Date created", "Status"]],
      body: data?.data?.data.map((item, index) => [
        index + 1,
        item.membership_id,
        `${item.name_of_representative}`,
        item.email,

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
      setItems(data?.data.data);
    }
  }, [data]);
  const openActivate = (item) => {
    setSelected(item);
    ShowActivate(true);
  };
  const openDeactivate = (item) => {
    setSelected(item);
    ShowDeactivate(true);
  };
  const openDetails = (item) => {
    setSelected(item);
    setShowDetails(true);
  };
  // change account status
  const ChangeAccountStatus = async (status) => {
    const token = localStorage.getItem("igbo_token");

    try {
      const config = {
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.get(
        `${API_URL}/admin/member/${status}?user_id=${selected.id}`,
        config,
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
  // handle search
  const handleSearch = (e) => {
    if (e.target.value === "") {
      setItems(data.data.data);
    } else {
      const filtered = data.data.data.filter((item) =>
        item.name_of_representative?.toLowerCase().includes(e.target.value.toLowerCase()),
      );
      setItems(filtered);
    }
  };
  return (
    <div className="px-5">
      <div className="p-6 bg-white">
        <div className="admin_head">
          <div className="leftt">
            <h3 className="text-2xl font-semibold">Members</h3>
            <svg
              onClick={downloadAsPDF}
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              viewBox="0 0 30 30"
              fill="none"
            >
              <g clip-path="url(#clip0_51_612)">
                <path
                  d="M26.886 10.731H26.115L26.1555 7.896C26.1507 7.73032 26.0868 7.57181 25.9755 7.449L19.3515 0.201C19.2983 0.140194 19.2332 0.0909744 19.1601 0.0563973C19.0871 0.0218202 19.0078 0.00262381 18.927 0L5.06702 0C4.75626 0.00498908 4.45956 0.130352 4.23937 0.349698C4.01919 0.569045 3.89269 0.865264 3.88652 1.176V10.731H3.11402C2.68652 10.731 2.27402 10.908 1.97402 11.223C1.66793 11.5431 1.498 11.9696 1.50002 12.4125V21.1575C1.50002 22.0845 2.22302 22.8375 3.11402 22.8375H3.88652V28.8225C3.89233 29.134 4.01907 29.431 4.23994 29.6508C4.46081 29.8705 4.75848 29.9958 5.07002 30H24.987C25.6095 30 26.157 29.472 26.157 28.824V22.839H26.8875C27.7785 22.839 28.5015 22.0845 28.5015 21.156V12.411C28.5015 11.967 28.332 11.538 28.029 11.223C27.882 11.0683 27.7053 10.945 27.5093 10.8604C27.3134 10.7758 27.1024 10.7318 26.889 10.731H26.886ZM5.92502 2.067H16.359V8.9325C16.3584 9.08708 16.4175 9.23593 16.524 9.348C16.5757 9.4023 16.6378 9.44559 16.7066 9.47523C16.7754 9.50488 16.8496 9.52028 16.9245 9.5205H24.063V10.731H5.92502V2.067ZM5.92502 27.933V22.8375H24.063V27.933H5.92502ZM18.4365 2.28L19.014 2.931L22.884 7.2105L23.0985 7.47H19.143C18.843 7.47 18.6555 7.4205 18.576 7.32C18.4965 7.2225 18.45 7.065 18.4365 6.8505V2.28ZM4.50002 21.348V12.348H7.37702C8.46602 12.348 9.17702 12.393 9.50702 12.483C10.017 12.618 10.443 12.912 10.7865 13.365C11.1285 13.8165 11.301 14.4 11.301 15.117C11.301 15.669 11.202 16.134 11.004 16.512C10.806 16.887 10.554 17.1825 10.2495 17.397C9.97118 17.6002 9.65496 17.7455 9.31952 17.8245C8.89202 17.91 8.27252 17.9535 7.46102 17.9535H6.29252V21.348H4.50002ZM6.29252 13.8705V16.425H7.27352C7.98002 16.425 8.45252 16.377 8.69102 16.284C8.92154 16.197 9.11901 16.04 9.25568 15.8349C9.39236 15.6299 9.46137 15.3873 9.45302 15.141C9.46396 14.8447 9.36211 14.5552 9.16802 14.331C8.98073 14.1195 8.7266 13.9787 8.44802 13.932C8.23502 13.8915 7.80452 13.872 7.15802 13.872H6.29252V13.8705ZM12.3525 12.348H15.6285C16.368 12.348 16.9305 12.405 17.319 12.5205C17.8395 12.675 18.285 12.9525 18.657 13.3485C19.0275 13.746 19.311 14.232 19.5045 14.8065C19.6995 15.3825 19.7955 16.0905 19.7955 16.9335C19.7955 17.6745 19.7055 18.3135 19.5225 18.849C19.3005 19.5045 18.9825 20.034 18.5715 20.439C18.261 20.7465 17.841 20.9865 17.3115 21.159C16.917 21.285 16.3875 21.348 15.726 21.348H12.3525V12.348ZM14.145 13.8705V19.8315H15.483C15.984 19.8315 16.3455 19.803 16.5675 19.746C16.8585 19.671 17.1 19.548 17.2905 19.371C17.4825 19.1955 17.64 18.906 17.76 18.5025C17.8815 18.099 17.9415 17.55 17.9415 16.854C17.9415 16.158 17.8815 15.624 17.7615 15.252C17.6662 14.9238 17.491 14.6243 17.2515 14.3805C17.02 14.1644 16.7327 14.0174 16.422 13.956C16.1715 13.899 15.681 13.8705 14.952 13.8705H14.145ZM20.9145 21.348V12.348H27V13.8705H22.707V16.0005H26.412V17.523H22.707V21.348H20.9145Z"
                  fill="#EE3124"
                />
              </g>
              <defs>
                <clipPath id="clip0_51_612">
                  <rect width="30" height="30" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>

          <div className="rightt">
            <button className="" onClick={handleAddMemberClick}>
              <BiPlus /> Add New
            </button>
            <div className="searchh">
              <input type="text" placeholder="Search by name" onChange={handleSearch} />
              <span>
                <BiSearch />
              </span>
            </div>
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
                        Member ID
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
                        Email
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
                        Subscription
                      </th>
                      <th
                        scope="col"
                        className="px-6 lg:px-10 align-middle py-3 fs-500 whitespace-nowrap text-left"
                      >
                        Date Joined
                      </th>
                      <th
                        scope="col"
                        className="px-6 lg:px-10 align-middle py-3 fs-500 whitespace-nowrap text-left"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  {/*<tbody>
                    {!!items.length &&
                      items?.map((item, i) => (
                        <tr key={i}>
                          <td className="align-middle fs-500 whitespace-nowrap px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
                            {i + 1}
                          </td>
                          <td className="align-middle fs-500  px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
                            <div className="font-semibold text-blue-900">
                              {item.membership_id}
                            </div>
                          </td>
                          <td className="align-middle fs-500 whitespace-nowrap px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
                            {item.name_of_representative}
                          </td>
                          <td className="align-middle fs-500 whitespace-nowrap px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
                            {item.email}
                          </td>
                          <td className="align-middle fs-500 whitespace-nowrap px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
                            <div className="flex items-center gap-x-3">
                              <div
                                className={`px-2 py-1 rounded font-semibold border ${
                                  item.status === "Pending" ||
                                  item.status === "Inactive"
                                    ? `bg-orange-100`
                                    : `bg-blue-200`
                                }`}
                              >
                                {item.status}
                              </div>
                              {item.status === "Pending" ||
                              item.status === "Inactive" ? (
                                <span
                                  className="underline cursor-pointer font-medium text-blue-900"
                                  onClick={() => openActivate(item)}
                                >
                                  Activate
                                </span>
                              ) : (
                                <span
                                  className="underline cursor-pointer font-medium text-red-800"
                                  onClick={() => openDeactivate(item)}
                                >
                                  Deactivate
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="align-middle fs-500 whitespace-nowrap px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
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
                          <td className="align-middle fs-500 whitespace-nowrap px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
                            {dayjs(item.created_at).format("DD-MMM -YYYY")}
                          </td>
                          <td className="align-middle fs-500 whitespace-nowrap px-6 lg:px-10 py-4 text-left border-b border-[#CECECE]">
                            <div className="flex gap-x-3 cursor-pointer">
                              <BsEyeFill
                                onClick={() => openDetails(item)}
                                className="text-xl text-blue-900"
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>*/}
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
      {showDetails && <MemberModal item={selected} close={() => setShowDetails(false)} />}
      <Activate title={""} noHead>
        <ReusableModal
          title={"Are you sure you want to activate this account?"}
          cancelTitle="No, cancel"
          actionTitle="Yes, Activate"
          closeModal={() => ShowActivate(false)}
          action={() => ChangeAccountStatus("activate")}
          isBusy={isBusy}
        />
      </Activate>
      <Deactivate title={""} noHead>
        <ReusableModal
          title={"Are you sure you want to deactivate this account?"}
          cancelTitle="No, cancel"
          actionTitle="Yes, Deactivate"
          closeModal={() => ShowActivate(false)}
          action={() => ChangeAccountStatus("deactivate")}
          isBusy={isBusy}
        />
      </Deactivate>
    </div>
  );
};

export default Members;
