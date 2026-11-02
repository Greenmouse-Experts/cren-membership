// @ts-nocheck
import React, { useState, useEffect } from "react";
import "../stylesheet/admin.css";
import { formatDistanceToNow } from "date-fns";
import { BsTrash3Fill } from "react-icons/bs";
import { Circles } from "react-loader-spinner";
import useGetHook from "../hook/useGet";
import usePostHook from "../hook/usePostRead";
import { toast } from "react-toastify";
import { GoBell } from "react-icons/go";

const Notify = ({ datas }) => {
  const formatTimeAgo = (timestamp) => {
    const apiDate = new Date(timestamp);
    return formatDistanceToNow(apiDate);
  };

  const [activeButton, setActiveButton] = useState("all");
  const { data, isLoading } = useGetHook("member/get/all/notifications");

  const { handlePost } = usePostHook();
  const onSuccess = () => {
    // toast.success("Announcement added successfully");
  };

  const handleSubmit = async (id) => {
    const endpoint = `member/read/notification?notification_id=${id}`;
    handlePost(endpoint, `Application/json`, onSuccess);
  };

  const handleDelete = async (id) => {
    const endpoint = `member/delete/notification?notification_id=${id}`;
    handlePost(endpoint, `Application/json`, onSuccess);
   
    if(onSuccess){
      toast.success("Notification deleted successfully");
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== id)
      );
    }
  };

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (data?.data) {
      setNotifications(data.data);
    }
  }, [data]);

  const handleButtonClick = (buttonType) => {
    setActiveButton(buttonType);
  };

  return (
    <div className="notify">
      <div className="not">
        <div className="notify_head">
          <div className="notify_left">
            <button
              onClick={() => handleButtonClick("all")}
              className={activeButton === "all" ? "active" : ""}
            >
              All <span>{notifications?.length}</span>
            </button>
            <button
              onClick={() => handleButtonClick("unread")}
              className={activeButton === "unread" ? "active" : ""}
            >
              Unread
            </button>
          </div>
          <button>Mark all as read</button>
        </div>
        {isLoading ? (
          <div className="load">
            <Circles
              height="80"
              width="80"
              color="#015907"
              ariaLabel="circles-loading"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
          </div>
        ) : (
          <div className="notify_body">
            {notifications.map((item, index) => (
              <div
                key={item.id}
                className={`notification ${
                  (activeButton === "unread" && item.status === "Unread") ||
                  (activeButton === "all" && item.status === "Unread")
                    ? "unread-notification"
                    : "all-notification"
                }`}
              >
                <span>
                  <GoBell className=" cursor-pointer" onClick={() => handleSubmit(item.id)} />
                </span>
                <div>
                  <div>
                    <h3>
                      {item.body} <span>{item.title}</span>
                    </h3>
                    <p>{formatTimeAgo(item.created_at)} ago</p>
                  </div>
                  <BsTrash3Fill size={30} className=" cursor-pointer" onClick={() => handleDelete(item.id)} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notify;
