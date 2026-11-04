// @ts-nocheck
import React, { useEffect, useState } from "react";
import { FaUserShield } from "react-icons/fa";
import { MdMarkEmailRead } from "react-icons/md";
import useGetHook from "../../hook/useGet";
import { BsFillCameraFill, BsTelephonePlusFill } from "react-icons/bs";
import usePostHook from "../../hook/usePost";
import { toast } from "react-toastify";
import useModal from "../../hook/useModal";
import ChangePassword from "../../admin/Settings/ChangePassword";

const SettingsPage = () => {
  const { data: user, refetch } = useGetHook("admin/profile");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState();
  const [isBusy, setIsBusy] = useState(false);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const { handlePost } = usePostHook();
  const { Modal, setShowModal } = useModal();
  useEffect(() => {
    setFname(user?.data?.first_name);
    setLname(user?.data?.last_name);
    setEmail(user?.data?.email);
    setPhone(user?.data?.phone_number);
  }, [user]);
  const onSuccess = () => {
    toast.success("Profile updated successfully");
    setLoading(false);
    refetch();
  };
  const changeProfileImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsBusy(true);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    const payload = {
      avatar: file,
    };
    handlePost(`admin/profile/upload/profile-picture`, payload, "application/json", () => {
      toast.success("Profile picture updated successfully");
      setIsBusy(false);
      refetch();
    });
  };
  const handleUpateProfile = () => {
    setLoading(true);
    const payload = {
      name_of_member_organization: fname,
      name_of_representative: lname,
      username: user?.data?.username || email,
      email: email,
      phone_number: phone,
      address: user?.data?.address || "",
    };
    handlePost(
      `admin/profile/update`,
      payloadpayload,
      "applicationapplication/jsonjson",
      onSuccess,
    );
  };
  return (
    <>
      <div className="bg-white p-5 ml-4">
        <div className="lg:w-9/12 xl:w-8/10 rounded-lg  p-6 mx-auto">
          <div>
            <p className="font-semibold text-xl border-b">Admin Settings</p>
          </div>
          <div className="mt-6 grid lg:grid-cols-4 gap-x-6">
            <div>
              <div className="relative z-0 w-[160px] h-[160px]">
                <img
                  src={preview ? preview : user?.data?.avatar}
                  alt="profile"
                  width={160}
                  height={160}
                  className="rounded-[80px] border w-full h-full mx-auto"
                />
                <p className="w-8 h-8 rounded-[80px] grid place-content-center bg-white absolute overflow-hidden z-10 bottom-[1px] right-[15px] border cursor-pointer">
                  {isBusy ? "" : <BsFillCameraFill className="text-primary relative" />}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => changeProfileImage(e)}
                    className="w-full h-full absolute z-10 opacity-0 cursor-pointer"
                  />
                </p>
              </div>
            </div>
            <div className="col-span-3 mt-9 lg:pl-6">
              <div className="grid gap-6">
                <div className="flex items-center gap-x-2">
                  <div className="w-16 h-16 grid place-content-center shadow-lg">
                    <FaUserShield className="text-2xl text-gray-400" />
                  </div>
                  <div className="w-full">
                    <p className="fs-400 text-primary">First Name:</p>
                    <input
                      type="text"
                      value={fname}
                      onChange={(e) => setFname(e.target.value)}
                      className="border-b w-full bg-transparent p-2"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-x-2">
                  <div className="w-16 h-16 grid place-content-center shadow-lg">
                    <FaUserShield className="text-2xl text-gray-400" />
                  </div>
                  <div className="w-full">
                    <p className="fs-400 text-primary">Last Name:</p>
                    <input
                      type="text"
                      value={lname}
                      onChange={(e) => setLname(e.target.value)}
                      className="border-b w-full bg-transparent p-2"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-x-2">
                  <div className="w-16 h-16 grid place-content-center shadow-lg">
                    <MdMarkEmailRead className="text-2xl text-gray-400" />
                  </div>
                  <div className="w-full">
                    <p className="fs-400 text-primary">Email:</p>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-b w-full bg-transparent p-2"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-x-2">
                  <div className="w-16 h-16 grid place-content-center shadow-lg">
                    <BsTelephonePlusFill className="text-2xl text-gray-400" />
                  </div>
                  <div className="w-full">
                    <p className=" text-primary">Phone:</p>
                    <input
                      type="number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="border-b w-full bg-transparent p-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-x-6 mt-12">
            <button
              className="px-6 py-2 border border-blue-800 text-blue-800 font-semibold rounded-lg"
              onClick={() => setShowModal(true)}
            >
              Change Password
            </button>
            <button
              className="px-6 py-2 border border-green-600 bg-blue-800 text-white font-semibold rounded-lg"
              onClick={handleUpateProfile}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
      <Modal title={"Change Password"}>
        <ChangePassword />
      </Modal>
    </>
  );
};

export default SettingsPage;
