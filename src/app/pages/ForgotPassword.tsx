// @ts-nocheck
import { API_URL } from "@/app/services/env";
import React, { useState } from "react";
import loginImg from "../image/forgot-img.svg";
import logo from "../image/logo.png";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "@/lib/router-compat";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (logValidate()) {
      setIsLoading(true);
      axios
        .post(`${API_URL}/auth/password/email`, {email: email}, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          if (res.data.code === 200) {
            toast.success("check your email to get verification code")
              navigate("/password-reset/");
           

            // localStorage.setItem("reset_igbo_email", res.data.data.email);
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
    if (email === "") {
      result = false;
      toast.error("Please enter Email");
    }
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
        result = false;
        toast.warning("Please enter a valid email");
      }

    return result;
  };
  return (
    <main>
      <section className="px-0 py-0 grid xl:grid-cols-2 grid-cols-1">
        <div>
          <form
            onSubmit={handleSubmit}
            className="md:w-[32rem] bg-white dark:bg-darkMood w-full px-5 py-10 flex flex-col justify-center items-center mx-auto h-full rounded-2xl login"
          >
            <a href="http://ndiigbogermany.org">
              <img src={logo} alt="logo" className=" scale-75" />
            </a>
            <div className="flex flex-col justify-center gap-4 w-full">
              <h3 className="text-[2.5rem] font-bold tracking-[-2px] mb-1">
                Forget Password?
              </h3>
              <p className="text-grey-800 text-lg font-normal mb-8">
                Enter the email address associated with your account.
              </p>

              <div className="flex flex-col gap-8 ">
                <div className="mb-4">
                  <div className="input_log">
                    <label htmlFor="email">Email</label>
                    <div>
                      {/* <AiOutlineMail className="icon" /> */}
                      <input
                        placeholder="Enter Email"
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="login_btn bg-[#015907] text-white"
                >
                  {isLoading ? "Verifying..." : "Continue"}
                </button>
              </div>
            </div>
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
    </main>
  );
};

export default ForgotPassword;
