// @ts-nocheck
import { API_URL } from "@/app/services/env";
import "../stylesheet/login.css";
import React, { useState } from "react";
import { AiFillEye } from "react-icons/ai";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "@/lib/router-compat";
import logo from "../image/logo.png";
import { useNavigate } from "@/lib/router-compat";
import axios from "axios";
import useModal from "../hook/useModal";
import RegisterSuccess from "../users/RegisterSuccess";
import { useEffect } from "react";

const Register = () => {
  function togglePassword(inputId) {
    const passwordInput = document.getElementById(inputId);
    const toggleIcon = passwordInput.parentElement.querySelector(".eye-icon");

    if (!passwordInput || !toggleIcon) {
      // Check if the elements are null or undefined before attempting to modify them
      return;
    }

    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      toggleIcon.style.backgroundImage = 'url("eye-icon-hidden.png")'; // Change to an icon that represents hidden password
    } else {
      passwordInput.type = "password";
      toggleIcon.style.backgroundImage = 'url("eye-icon.png")'; // Change back to the normal eye icon
    }
  }
  const [isLoading, setIsLoading] = useState(false);

  const [logindata, setLoginData] = useState({
    name_of_representative: "",
    last_name: "",
    email: "",
    password: "",
    username: "",
    password_confirmation: "",
    phone_number: "",
    address: "",
    name_of_member_organization:"",
  
  });

  const resetInput = () => {
    setLoginData({
      name_of_representative: "",
      last_name: "",
      email: "",
      password: "",
      username: "",
      password_confirmation: "",
      phone_number: "",
      address: "",
      name_of_member_organization:"",
    
    });
  };

  const navigate = useNavigate();

  const hadleInput = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      if (files.length > 0) {
        setLoginData({
          ...logindata,
          [name]: files[0],
        });
        console.log(logindata);
      }
    } else {
      setLoginData({ ...logindata, [name]: value });
    }
  };

  const isValidate = () => {
    let isProceed = true;
    let errorMessages = ""; // Create a variable to store error messages

    if (
      logindata.name_of_representative === "" ||
      logindata.username === "" ||
      logindata.email === "" ||
      logindata.password === "" ||
      logindata.password_confirmation === "" ||
      logindata.name_of_member_organization === "" 
    ) {
      isProceed = false;
      errorMessages += "Please fill all inputs. ";
    }

    if (logindata.password.length <= 7) {
      isProceed = false;
      toast.error("Password must be at least 8 Letters");
    }

    if (logindata.password_confirmation !== logindata.password) {
      isProceed = false;
      errorMessages += "Password and Confirm Password do not match. ";
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
    

  const fd = new FormData();
  Object.entries({ ...logindata}).forEach(([key, value]) => {
    fd.append(key, value);
  });
    if (isValidate()) {
      setIsLoading(true); // Set loading state to true

      axios
        .post(`${API_URL}/auth/register`, fd, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log(res);
          if (res.status) {
            toast.success("Registered Successfully");
            setShowModal(true);
            resetInput();
            // navigate("/login");
          } else {
            toast.error(res.data.message);
          }
        })
        .catch((err) => {
          if (err?.response?.data?.message) {
            toast.error(err?.response?.data?.message);
          }
          if (err?.response?.data?.errors) {
            Object.entries(err?.response?.data?.errors).forEach(
              ([key, value]) => {
                toast.error(value[0]);
              }
            );
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };
  // success modal
  const { Modal, setShowModal } = useModal();

  return (
    <>
      <div className="main_log">
        <form onSubmit={handleSubmit} action="submit" className="register">
          <img src={logo} alt="" />
          <div className="log_head">
            <h3>Register</h3>
            <p>Fill in your credentials to register as a Member</p>
          </div>

          {/* Add Account Type */}

         
            <div className="input_log">
              <label htmlFor=" Name of Representative (full names)"> Name of Representative (full names)</label>
              <div>
                {/* <HiOutlineUser className="icon" /> */}
                <input
                  placeholder="Enter Name of Representative (full names)"
                  id="name_of_representative"
                  name="name_of_representative"
                  type="text"
                  value={logindata.name_of_representative}
                  onChange={hadleInput}
                />
              </div>
            </div>

           
          
          <div className="double">
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
                  onChange={hadleInput}
                />
              </div>
            </div>

            <div className="input_log">
              <label htmlFor="phone_number">Phone Number (optional)</label>
              <div>
                <input
                  placeholder="Enter Phone Number"
                  id="phone_number"
                  name="phone_number"
                  type="text"
                  value={logindata.phone_number}
                  onChange={hadleInput}
                />
              </div>
            </div>
          </div>

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
                onChange={hadleInput}
              />
            </div>
          </div>

          {/* Add Address */}
          <div className="input_log">
            <label htmlFor="address">Address (optional)</label>
            <div>
              <input
                placeholder="Enter Your Address"
                id="address"
                name="address"
                type="text"
                value={logindata.address}
                onChange={hadleInput}
              />
            </div>
          </div>

          {/* Add Place of Business */}

          <div className="input_log">
            <label htmlFor="membership_professional_bodies">
              Name of Member Organization
            </label>
            <div>
              <input
                placeholder=" Name of Member Organization"
                id="name_of_member_organization"
                name="name_of_member_organization"
                type="text"
                value={logindata.name_of_member_organization}
                onChange={hadleInput}
              />
            </div>
          </div>

       

          <div className="double">
            <div className="input_log">
              <label htmlFor="password">Password</label>
              <div>
                {/* <BsKey className="icon" /> */}
                <input
                  placeholder="Enter Passowrd"
                  id="password"
                  name="password"
                  type="password"
                  value={logindata.password}
                  onChange={hadleInput}
                />
                <span
                  className="toggle-password"
                  onClick={() => togglePassword("password")}
                >
                  <span className="eye-icon">
                    <AiFillEye />
                  </span>{" "}
                </span>
              </div>
            </div>
            <div className="input_log">
              <label htmlFor="password_confirmation">Confirm Password</label>
              <div>
                {/* <BsKey className="icon" /> */}
                <input
                  placeholder="Confirm Password"
                  id="password_confirmation"
                  name="password_confirmation"
                  type="password"
                  value={logindata.password_confirmation}
                  onChange={hadleInput}
                />
                <span
                  className="toggle-password"
                  onClick={() => togglePassword("password_confirmation")}
                >
                  <span className="eye-icon">
                    <AiFillEye />
                  </span>
                </span>
              </div>
            </div>
          </div>
          <button className="form_btn" type="submit" disabled={isLoading}>
            {isLoading ? "Loading..." : "Sign Up"}
          </button>
          <p>
            Already Registered?{" "}
            <Link className="already text-[#015907] font-medium" to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
      <Modal title={""} noHead>
        <RegisterSuccess close={() => setShowModal(false)} />
      </Modal>
    </>
  );
};

export default Register;
