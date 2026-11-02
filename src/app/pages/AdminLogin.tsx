// @ts-nocheck
import { API_URL } from "@/app/services/env";
import React, { useState } from "react";
import { HiOutlineMail } from "react-icons/hi";
import { GoLock } from "react-icons/go";
import "../stylesheet/login.css";
import { toast } from "react-toastify";
import { useNavigate } from "@/lib/router-compat";
import logo from "../image/logo.png";
import axios from "axios";

const AdminLogin = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [logData, setLogData] = useState({
    email: "",
    password: "",
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setLogData({ ...logData, [name]: value });
  };

  const usenavigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (logValidate()) {
      const fd = new FormData();
      Object.entries(logData).forEach(([key, value]) => {
        fd.append(key, value);
      });
      setIsLoading(true);
      axios
        .post(`${API_URL}/auth/admin/login`, fd, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log(res);
          if (res.data.code === 200) {
            toast.success(res.data.message);
            localStorage.setItem("igbo_token", res.data.token);
            usenavigate("/admin/");
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

  const logValidate = () => {
    let result = true;
    if (logData.email === "" || logData.email === null) {
      result = false;
      toast.error("Please enter Email");
    }

    if (logData.password === "" || logData.password === null) {
      result = false;
      toast.error("Please enter Password");
    }

    return result;
  };
  return (
    <div className="main_login">
      <form onSubmit={handleSubmit} action="submit" className="login">
        <a href="http://ndiigbogermany.org/">
          <img src={logo} alt="" />
        </a>
        <div className="log_head">
          <h3>Admin Login</h3>
          <p>Fill in your credentials to login to the dashboard</p>
        </div>
        <div className="input_log">
          <label htmlFor="email">Email</label>
          <div>
            {" "}
            <HiOutlineMail />{" "}
            <input
              type="text"
              name="email"
              placeholder="Email"
              onChange={handleInput}
              value={logData.email}
            />
          </div>
        </div>
        <div className="input_log">
          <label htmlFor="password">Password</label>
          <div>
            {" "}
            <GoLock />{" "}
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleInput}
              value={logData.password}
            />
          </div>
        </div>

        <button type="submit" className="login_btn" disabled={isLoading}>
          {isLoading ? "Verifying..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
