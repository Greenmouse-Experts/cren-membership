// @ts-nocheck
import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoClose } from "react-icons/io5";
import { ThreeDots } from "react-loader-spinner";
import { CustomAdd } from "../../services/config";

const AddMembers = ({ onClose, refetch }) => {
  const [isLoading, setIsLoading] = useState(false);

  const [logindata, setLoginData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    gender: "",
    passport: null,
    address: "",
    occupation: "",
    marital_status: "",
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...logindata, [name]: value });
  };

  const handleFileInput = (e) => {
    const { name, files } = e.target;
    setLoginData({ ...logindata, [name]: files[0] });
  };

  console.log(logindata);

  const isValidate = () => {
    let isProceed = true;
    let errorMessages = ""; // Create a variable to store error messages

    if (
      logindata.first_name === "" ||
      logindata.last_name === "" ||
      logindata.email === "" ||
      logindata.phone_number === "" ||
      logindata.address === "" ||
      logindata.occupation === "" ||
      logindata.marital_status === "" ||
      logindata.gender === "" ||
      logindata.passport === null
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
    console.log(logindata);
    const payload = {
      ...logindata,
    };
    if (isValidate()) {
      setIsLoading(true);

      CustomAdd.post("member/add/member", payload)
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            console.log(res.data);
            console.log(res.data.errors);
            toast.success("Member Added Successfully");
            refetch();
            onClose();
          } else {
            console.log(res);
            // toast.error(res.response.data.code)
          }
        })
        .catch((err) => {
          Object.entries(err.response.data.errors).forEach(([key, value]) => {
            toast.error(value[0]);
          });
          console.log();
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
        <div className="double">
          <div className="input_log">
            <label htmlFor="firstName">First Name</label>
            <div>
              <input
                placeholder="Enter First Name"
                id="first_name"
                name="first_name"
                type="text"
                value={logindata.first_name}
                onChange={handleInput}
              />
            </div>
          </div>

          <div className="input_log">
            <label htmlFor="last_name">Last Name</label>
            <div>
              <input
                placeholder="Enter Last Name"
                id="last_name"
                name="last_name"
                type="text"
                value={logindata.last_name}
                onChange={handleInput}
              />
            </div>
          </div>
        </div>
        <div className="double">
          <div className="input_log">
            <label htmlFor="gender">Gender</label>
            <div>
              <select name="gender" id="gender" value={logindata.gender} onChange={handleInput}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>
        </div>

        <div className="double">
          <div className="input_log">
            <label htmlFor="email">Email</label>
            <div>
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
          <div className="input_log">
            <label htmlFor="address">Address</label>
            <div>
              <input
                placeholder="Address"
                id="address"
                name="address"
                type="text"
                value={logindata.address}
                onChange={handleInput}
              />
            </div>
          </div>
        </div>

        <div className="double">
          <div className="input_log">
            <label htmlFor="occupation">Occupation</label>
            <div>
              <input
                placeholder="Enter Occupation"
                id="occupation"
                name="occupation"
                type="text"
                value={logindata.occupation}
                onChange={handleInput}
              />
            </div>
          </div>
          <div className="input_log">
            <label htmlFor="marital_status">Marital Status</label>
            <div>
              <select
                name="marital_status"
                id="marital_status"
                value={logindata.marital_status}
                onChange={handleInput}
              >
                <option value="">Select Status</option>
                <option value="Married">Married</option>
                <option value="Single">Single</option>
              </select>
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
            <label htmlFor="passport">Photo</label>
            <div>
              <input id="passport" name="passport" type="file" onChange={handleFileInput} />
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

export default AddMembers;
