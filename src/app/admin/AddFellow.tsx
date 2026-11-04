// @ts-nocheck
import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoClose } from "react-icons/io5";
import { CustomAdd } from "../services/config";
import { ThreeDots } from "react-loader-spinner";

const AddFellow = ({ onClose, refetch }) => {
  const [isLoading, setIsLoading] = useState(false);

  const [logindata, setLoginData] = useState({
    name_of_representative: "",
    email: "",
    username: "",
    phone_number: "",
    name_of_member_organization: "",
    address: "",
    password: "password",
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...logindata, [name]: value });
  };

  const isValidate = () => {
    let isProceed = true;
    let errorMessages = ""; // Create a variable to store error messages

    if (
      (logindata.name_of_representative === "") | (logindata.username === "") ||
      logindata.email === "" ||
      logindata.phone_number === "" ||
      logindata.name_of_member_organization === "" ||
      logindata.address === ""
    ) {
      isProceed = false;
      errorMessages += "Please fill all inputs. ";
    }

    if (!isProceed) {
      toast.error(errorMessages);
    } else {
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(logindata.email)) {
        isProceed = false;
        toast.warning("Please enter a valid email");
      }
    }

    return isProceed;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...logindata,
    };
    if (isValidate()) {
      setIsLoading(true);

      CustomAdd.post("admin/member/add", payload)
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            console.log(res?.data);
            console.log(res?.data?.errors);
            toast.success("Member Added Successfully");
            refetch();
            onClose();
          } else {
            console.log(res);
            toast.error(res?.response?.data?.code);
          }
        })
        .catch((err) => {
          // Object.entries(err?.response?.data?.errors).forEach(([key, value]) => {
          //   toast.error(value[0]);
          // });
          console.log(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <div className="add_member">
      <div className="add_head">
        <p>Add New Member</p>{" "}
        <span onClick={onClose}>
          <IoClose />
        </span>
      </div>
      <form onSubmit={handleSubmit} action="submit" className="add_mem">
        <div className="input_log">
          <label htmlFor=" Name of Representative (full names)">
            {" "}
            Name of Representative (full names)
          </label>
          <div>
            {/* <HiOutlineUser className="icon" /> */}
            <input
              placeholder="Enter Name of Representative (full names)"
              id="name_of_representative"
              name="name_of_representative"
              type="text"
              value={logindata.name_of_representative}
              onChange={handleInput}
            />
          </div>
        </div>
        <div className="input_log">
          <label htmlFor=" Name of Representative (full names)"> Name of Organization</label>
          <div>
            {/* <HiOutlineUser className="icon" /> */}
            <input
              placeholder="Enter name of Organization"
              id="name_of_member_organization"
              name="name_of_member_organization"
              type="text"
              value={logindata.name_of_member_organization}
              onChange={handleInput}
            />
          </div>
        </div>
        <div className="double">
          <div className="input_log">
            <label htmlFor="username">Username</label>
            <div>
              {/* <HiOutlineUser className="icon" /> */}
              <input
                placeholder="Enter Username"
                id="username"
                name="username"
                type="text"
                value={logindata.username}
                onChange={handleInput}
              />
            </div>
          </div>

          <div className="input_log">
            <label htmlFor="email">Email</label>
            <div>
              {/* <AiOutlineMail className="icon" /> */}
              <input
                placeholder="Enter Email"
                id="email"
                name="email"
                type="email"
                value={logindata.email}
                onChange={handleInput}
              />
            </div>
          </div>
        </div>

        <div className="double">
          <div className="input_log">
            <label htmlFor="phone_number">Phone Number</label>
            <div>
              <input
                placeholder="Enter Phone Number"
                id="phone_number"
                name="phone_number"
                type="text"
                value={logindata.phone_number}
                onChange={handleInput}
              />
            </div>
          </div>
          <div className="input_log">
            <label htmlFor="address">Address</label>
            <div>
              {/* <HiOutlineUser className="icon" /> */}
              <input
                placeholder="Enter Address"
                id="address"
                name="address"
                type="text"
                value={logindata.address}
                onChange={handleInput}
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="dotss">
            <ThreeDots
              height="80"
              width="80"
              radius="9"
              color="#4fa94d"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClassName=""
              visible={true}
            />
          </div>
        ) : (
          <button className="add_btn" type="submit" disabled={isLoading}>
            Add Member{" "}
          </button>
        )}
      </form>
    </div>
  );
};

export default AddFellow;
