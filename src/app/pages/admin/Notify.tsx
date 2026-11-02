// @ts-nocheck
import React, { useState, useEffect } from "react";
import "../../stylesheet/admin.css";
import { formatDistanceToNow } from "date-fns";
import { BsTrash3Fill } from "react-icons/bs";
import { Circles } from "react-loader-spinner";
import useGetHook from "../../hook/useGet";
import usePostHook from "../../hook/usePostRead";
import { toast } from "react-toastify";
import { GoBell } from "react-icons/go";

const Notify = ({ datas }) => {
  const formatTimeAgo = (timestamp) => {
    const apiDate = new Date(timestamp);
    return formatDistanceToNow(apiDate);
  };

  const [activeButton, setActiveButton] = useState("all");
  const { data, isLoading } = useGetHook("admin/get/all/notifications");

  const { handlePost } = usePostHook();
  const onSuccess = () => {
    // toast.success("Announcement added successfully");
  };
  const handleSubmit = async (id) => {
    const endpoint = `admin/read/notification?notification_id=${id}`;
    handlePost(endpoint, `Application/json`, onSuccess);
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
              All <span>{notifications.length}</span>
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
            {!!notifications.length &&
              notifications.map((item, index) => (
                <div
                  onClick={() => handleSubmit(item.id)}
                  key={item.id}
                  className={`notification ${
                    (activeButton === "unread" && item.status === "Unread") ||
                    (activeButton === "all" && item.status === "Unread")
                      ? "unread-notification"
                      : "all-notification"
                  }`}
                >
                  <span>
                    <GoBell />
                  </span>
                  <div>
                    <div>
                      <h3>
                        {item.body} <span>{item.title}</span>
                      </h3>
                      <p>{formatTimeAgo(item.created_at)} ago</p>
                    </div>
                    <BsTrash3Fill />
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
