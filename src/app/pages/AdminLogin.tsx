// @ts-nocheck
import { API_URL } from "@/app/services/env";
import { useForm } from "react-hook-form";
import { HiOutlineMail } from "react-icons/hi";
import { GoLock } from "react-icons/go";
import "../stylesheet/login.css";
import { toast } from "react-toastify";
import { useNavigate } from "@/lib/router-compat";
import logo from "../image/logo.png";
import axios from "axios";

const AdminLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: { email: "", password: "" },
  });

  const usenavigate = useNavigate();

  const submitLogin = async (data) => {
    try {
      const res = await axios.post(`${API_URL}/auth/admin/login`, data, {
        headers: { "Content-Type": "application/json" },
      });
      if (res.data.code === 200) {
        toast.success(res.data.message);
        localStorage.setItem("igbo_token", res.data.token);
        usenavigate("/admin/");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      if (err?.response?.data?.message) {
        toast.error(err.response.data.message);
      }
      if (err?.response?.data?.errors) {
        Object.values(err.response.data.errors).forEach((value) => {
          toast.error(value[0]);
        });
      }
    }
  };

  const onInvalid = (formErrors) => {
    toast.error(Object.values(formErrors)[0]?.message);
  };
  return (
    <div className="main_login">
      <form onSubmit={handleSubmit(submitLogin, onInvalid)} noValidate className="login">
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
              placeholder="Email"
              {...register("email", { required: "Please enter Email" })}
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
              placeholder="Password"
              {...register("password", { required: "Please enter Password" })}
            />
          </div>
        </div>

        <button type="submit" className="login_btn" disabled={isSubmitting}>
          {isSubmitting ? "Verifying..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
