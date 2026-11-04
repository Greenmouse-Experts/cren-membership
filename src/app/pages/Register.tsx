// @ts-nocheck
import { API_URL } from "@/app/services/env";
import "../stylesheet/login.css";
import { useForm } from "react-hook-form";
import { AiFillEye } from "react-icons/ai";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "@/lib/router-compat";
import logo from "../image/logo.png";
import axios from "axios";
import useModal from "../hook/useModal";
import RegisterSuccess from "../users/RegisterSuccess";
import RenderLogo from "../components/RenderLogo";

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
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      name_of_representative: "",
      last_name: "",
      email: "",
      password: "",
      username: "",
      password_confirmation: "",
      phone_number: "",
      address: "",
      name_of_member_organization: "",
    },
  });

  const submitRegistration = async (data) => {
    try {
      const res = await axios.post(`${API_URL}/auth/register`, data, {
        headers: { "Content-Type": "application/json" },
      });
      if (res.status) {
        toast.success("Registered Successfully");
        setShowModal(true);
        reset();
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

  // success modal
  const { Modal, setShowModal } = useModal();

  return (
    <>
      <div className="main_log">
        <form
          onSubmit={handleSubmit(submitRegistration, onInvalid)}
          noValidate
          className="register"
        >
          <RenderLogo />
          <div className="log_head">
            <h3>Register</h3>
            <p>Fill in your credentials to register as a Member</p>
          </div>

          {/* Add Account Type */}

          <div className="input_log">
            <label htmlFor="name_of_representative"> Name of Representative (full names)</label>
            <div>
              {/* <HiOutlineUser className="icon" /> */}
              <input
                placeholder="Enter Name of Representative (full names)"
                id="name_of_representative"
                type="text"
                {...register("name_of_representative", { required: "Please fill all inputs." })}
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
                  type="email"
                  {...register("email", {
                    required: "Please fill all inputs.",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: "Please enter a valid email",
                    },
                  })}
                />
              </div>
            </div>

            <div className="input_log">
              <label htmlFor="phone_number">Phone Number (optional)</label>
              <div>
                <input
                  placeholder="Enter Phone Number"
                  id="phone_number"
                  type="text"
                  {...register("phone_number")}
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
                type="text"
                {...register("username", { required: "Please fill all inputs." })}
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
                type="text"
                {...register("address")}
              />
            </div>
          </div>

          {/* Add Place of Business */}

          <div className="input_log">
            <label htmlFor="name_of_member_organization">Name of Member Organization</label>
            <div>
              <input
                placeholder=" Name of Member Organization"
                id="name_of_member_organization"
                type="text"
                {...register("name_of_member_organization", {
                  required: "Please fill all inputs.",
                })}
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
                  type="password"
                  {...register("password", {
                    required: "Please fill all inputs.",
                    minLength: { value: 8, message: "Password must be at least 8 Letters" },
                  })}
                />
                <span className="toggle-password" onClick={() => togglePassword("password")}>
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
                  type="password"
                  {...register("password_confirmation", {
                    required: "Please fill all inputs.",
                    validate: (value) =>
                      value === getValues("password") ||
                      "Password and Confirm Password do not match.",
                  })}
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
          <button className="form_btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Loading..." : "Sign Up"}
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
