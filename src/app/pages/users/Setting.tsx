// @ts-nocheck
import React, { useEffect, useState } from "react";
import { FaUserShield } from "react-icons/fa";
import { MdMarkEmailRead, MdOutlineMarkEmailRead, MdOutlineWorkHistory } from "react-icons/md";
import useGetHook from "../../hook/useGet";
import { BsFillCameraFill, BsHouseAdd, BsTelephonePlusFill } from "react-icons/bs";
import usePostHook from "../../hook/usePost";
import { toast } from "react-toastify";
import useModal from "../../hook/useModal";
import { IoBusinessOutline } from "react-icons/io5"
import { FaUsersLine } from "react-icons/fa6"
import ChangePassword from "../../users/ChangePassword";

const MembersSetting = () => {
  const { data: user, refetch } = useGetHook("member/profile");

  console.log(user)
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState();
  const [isBusy, setIsBusy] = useState(false);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUserName] = useState("")
  const [address, setAddress] = useState("")
  const [representative, setNameOfRepresentative] = useState("")
  // const [piwe, setPiwe] = useState("")
  // const [rea, setRea] = useState("")
  const { handlePost } = usePostHook();
  const { Modal, setShowModal } = useModal();
  useEffect(() => {
    setFname(user?.data?.name_of_member_organization);
    setLname(user?.data?.last_name);
    setEmail(user?.data?.email);
    setPhone(user?.data?.phone_number);
    setUserName(user?.data?.username)
    setAddress(user?.data?.address)
    setNameOfRepresentative(user?.data?.name_of_representative)
    localStorage.setItem(
      "igbo_member_avatar",
      user?.data?.avatar
    );
    // setPiwe(user?.data?.previous_insolvency_work_experience)
    // setRea(user?.data?.referee_email_address)
  }, [user, preview, loading]);
  const onSuccess = () => {
    toast.success("Profile updated successfully");
    setLoading(false);
    refetch()
  };
  const changeProfileImage = async (e) => {
    setIsBusy(true);
    e.preventDefault();
    const objectUrl = URL.createObjectURL(e.target.files[0]);
    setPreview(objectUrl);
    const formData = new FormData();
    formData.append("avatar", e.target.files[0]);
    handlePost(
      `member/profile/upload/profile-picture`,
      formData,
      "multipart/form-data",
      onSuccess
    
    );
    if(onSuccess){
      setLoading(false)
    }
  };
  const handleUpateProfile = () => {
    setLoading(true)
    const formData = new FormData();
    formData.append("first_name", fname);
    formData.append("last_name", lname);
    formData.append("email", email);
    formData.append("phone_number", phone);
    formData.append("username", username)
    formData.append("address", address)
    formData.append("name_of_representative", representative)
     formData.append("name_of_member_organization", fname)
    // formData.append("referee_email_address", rea)
    handlePost(
      `member/profile/update`,
      formData,
      "multipart/form-data",
      onSuccess
    );
  };
  return (
    <>
      <div className="bg-white p-5">
        <div className="rounded-lg  p-6">
          <div>
            <p className="font-semibold text-xl border-b">Member Settings</p>
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
                  {isBusy ? (
                    ""
                  ) : (
                    <BsFillCameraFill className="text-primary relative" />
                  )}
                  <input
                    type="file"
                    onChange={(e) => changeProfileImage(e)}
                    className="w-full h-full absolute z-10 opacity-0 cursor-pointer"
                  />
                </p>
              </div>
              <div className="">
                <p className="fw-600 mt-1 text-center">{`${
                  user?.data?.first_name ? user?.data?.first_name : ""
                } ${user?.data?.last_name ? user?.data?.last_name : ""}`}</p>
              </div>
            </div>
            <div className="col-span-3 mt-9 lg:pl-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="flex items-center gap-x-2">
                  <div className="w-16 h-16 grid place-content-center shadow-lg">
                    <FaUserShield className="text-2xl text-gray-400" />
                  </div>
                  <div className="w-full">
                    <p className="text-[14px] text-primary">Name of Organization:</p>
                    <input
                      type="text"
                      value={fname}
                      onChange={(e) => setFname(e.target.value)}
                      className="border-b w-full bg-transparent p-2"
                    />
                  </div>
                </div>
                {/* <div className="flex items-center gap-x-2">
                  <div className="w-16 h-16 grid place-content-center shadow-lg">
                    <FaUserShield className="text-2xl text-gray-400" />
                  </div>
                  <div className="w-full">
                    <p className="text-[14px] text-primary">Last Name:</p>
                    <input
                      type="text"
                      value={lname}
                      onChange={(e) => setLname(e.target.value)}
                      className="border-b w-full bg-transparent p-2"
                    />
                  </div>
                </div> */}
                <div className="flex items-center gap-x-2">
                  <div className="w-16 h-16 grid place-content-center shadow-lg">
                    <MdMarkEmailRead className="text-2xl text-gray-400" />
                  </div>
                  <div className="w-full">
                    <p className="text-[14px] text-primary">Email:</p>
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
                    <p className="text-[14px] text-primary">Phone:</p>
                    <input
                      type="number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="border-b w-full bg-transparent p-2"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-x-2">
                  <div className="w-16 h-16 grid place-content-center shadow-lg">
                    <BsHouseAdd className="text-2xl text-gray-400" />
                  </div>
                  <div className="w-full">
                    <p className="text-[14px] text-primary">Username:</p>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUserName(e.target.value)}
                      className="border-b w-full bg-transparent p-2"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-x-2">
                  <div className="w-16 h-16 grid place-content-center shadow-lg">
                    <IoBusinessOutline className="text-2xl text-gray-400" />
                  </div>
                  <div className="w-full">
                    <p className="text-[14px] text-primary">Address:</p>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="border-b w-full bg-transparent p-2"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-x-2">
                  <div className="w-16 h-16 grid place-content-center shadow-lg">
                    <FaUsersLine className="text-2xl text-gray-400" />
                  </div>
                  <div className="w-full">
                    <p className="text-[14px] text-primary">Name of Representative</p>
                    <input
                      type="text"
                      value={representative}
                      onChange={(e) => setNameOfRepresentative(e.target.value)}
                      className="border-b w-full bg-transparent p-2"
                    />
                  </div>
                </div>
                {/* <div className="flex items-center gap-x-2">
                  <div className="w-16 h-16 grid place-content-center shadow-lg">
                    <MdOutlineWorkHistory className="text-2xl text-gray-400" />
                  </div>
                  <div className="w-full">
                    <p className="text-[14px] text-primary">Previous Insolvency Work Experience:</p>
                    <input
                      type="text"
                      value={piwe}
                      onChange={(e) => setPiwe(e.target.value)}
                      className="border-b w-full bg-transparent p-2"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-x-2">
                  <div className="w-16 h-16 grid place-content-center shadow-lg">
                    <MdOutlineMarkEmailRead className="text-2xl text-gray-400" />
                  </div>
                  <div className="w-full">
                    <p className="text-[14px] text-primary">Referee Email Address:</p>
                    <input
                      type="text"
                      value={rea}
                      onChange={(e) => setRea(e.target.value)}
                      className="border-b w-full bg-transparent p-2"
                    />
                  </div>
                </div> */}
                {/* <div className="flex items-center gap-x-2">
                  <div className="w-16 h-16 grid place-content-center shadow-lg">
                    <FaUserShield className="text-2xl text-gray-400" />
                  </div>
                  <div className="w-full">
                    <p className="text-[14px] text-primary">First Name:</p>
                    <input
                      type="text"
                      value={fname}
                      onChange={(e) => setFname(e.target.value)}
                      className="border-b w-full bg-transparent p-2"
                    />
                  </div>
                </div> */}
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
             {loading? "Saving..." : "Save Changes"}
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

export default MembersSetting;
