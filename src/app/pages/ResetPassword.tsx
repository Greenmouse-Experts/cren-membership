// @ts-nocheck
import { API_URL } from "@/app/services/env";
import React, { useState } from "react";
import { HiOutlineMail } from "react-icons/hi";
import { GoLock } from "react-icons/go";
import "../stylesheet/login.css";
import { toast } from "react-toastify";
import { useNavigate, Link } from "@/lib/router-compat";
import logo from "../image/logo.png";
import loginImg from "../image/login-img.svg";
import axios from "axios";
import { AiFillEye } from "react-icons/ai";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword); // Toggle the showPassword state
  };
  const togglePassword2 = () => {
    setShowPassword2(!showPassword2); // Toggle the showPassword state
  };

  const [isLoading, setIsLoading] = useState(false);

  const [logData, setLogData] = useState({
    code: "",
    password: "",
    password_confirmation: "",
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setLogData({ ...logData, [name]: value });
  };

  const usenavigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValidate()) {
      const fd = new FormData();
      Object.entries(logData).forEach(([key, value]) => {
        fd.append(key, value);
      });
      setIsLoading(true);
      axios
        .post(`${API_URL}/auth/password/reset`, fd, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          if (res.data.code === 200) {
            toast.success(res.data.message);
            usenavigate("/login");
          } else {
            toast.error("something went wrong");
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
  const isValidate = () => {
    let isProceed = true;
    let errorMessages = ""; // Create a variable to store error messages

    if (
      logData.code === "" ||
      logData.password === "" ||
      logData.password_confirmation === ""
    ) {
      isProceed = false;
      errorMessages += "Please fill all inputs. ";
    }
    if (logData.code === "") {
      isProceed = false;
      toast.error("Please enter reset code");
    }
    if (logData.password.length <= 7) {
      isProceed = false;
      toast.error("Password must be at least 8 Letters");
    }

    if (logData.password_confirmation !== logData.password) {
      isProceed = false;
      errorMessages += "Password and Confirm Password do not match. ";
    }

    if (!isProceed) {
      toast.error(errorMessages);
    }

    return isProceed;
  };

  return (
    <section className="px-0 py-0 grid xl:grid-cols-2 grid-cols-1 items-center">
      <div className="">
        <form
          onSubmit={handleSubmit}
          action="submit"
          className="login md:w-[32rem] w-full mx-auto"
        >
          <a href="http://ndiigbogermany.org">
            <img src={logo} alt="logo" />
          </a>
          <div className="log_head">
            <h3>Reset Password</h3>
          </div>
          <div className="input_log">
            <label htmlFor="email">Code</label>
            <div>
              {" "}
              <HiOutlineMail />{" "}
              <input
                type="text"
                name="code"
                placeholder="Enter reset code"
                onChange={handleInput}
                value={logData.code}
              />
            </div>
          </div>
          <div className="input_log">
            <label htmlFor="password">Password</label>
            <div>
              {" "}
              <GoLock />{" "}
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                onChange={handleInput}
                value={logData.password}
              />{" "}
              <span className="toggle-password" onClick={togglePassword}>
                <span className="eye-icon">
                  {showPassword ? (
                    <IoMdEyeOff size={27} color="#015907" />
                  ) : (
                    <IoMdEye size={27} color="#015907" />
                  )}
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
                type={showPassword2 ? "text" : "password"}
                value={logData.password_confirmation}
                onChange={handleInput}
              />

              <span className="toggle-password" onClick={togglePassword2}>
                <span className="eye-icon">
                  {showPassword2 ? (
                    <IoMdEyeOff size={27} color="#015907" />
                  ) : (
                    <IoMdEye size={27} color="#015907" />
                  )}
                </span>{" "}
              </span>
            </div>
          </div>

          <p className="text-grey-800 font-normal mt-2 ">
            
            <Link
              to="/forgot-password"
              className="text-[#015907] font-medium underline pb-1 cursor-pointer"
            >
              Resent code{" "}
            </Link>
          </p>

          <button type="submit" className="login_btn" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Continue"}
          </button>
          <p>
            Don,t have an account?{" "}
            <Link to="/">
              <span className="text-[#015907] font-medium">Create Account</span>
            </Link>
          </p>
        </form>
      </div>

      <div className="hidden xl:block h-full">
        <img
          src={loginImg}
          alt=""
          className="object-cover object-center h-full"
        />
      </div>
    </section>
  );
};

export default ResetPassword;
