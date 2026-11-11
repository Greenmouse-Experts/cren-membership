import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import { useNavigate } from "@/lib/router-compat";
import { HiOutlineMail } from "react-icons/hi";
import { GoLock } from "react-icons/go";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { fetchApi } from "@/app/hook/useGet";
import usePostHook from "@/app/hook/usePost";
import useAuthStore, { normalizeSubscribed } from "@/store/auth-store";
import type { ApiResponse, LoginResponse, MemberSubscription } from "@/types/api";
import RenderLogo from "@/app/components/RenderLogo";
import "../stylesheet/login.css";

const loginSchema = z.object({
  login_details: z.string().min(1, "Please enter Email"),
  password: z.string().min(1, "Please enter Password"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

/** Fetch the logged-in member's current subscription from `GET member/subscription/current`. */
const loadUserSubscription = async (): Promise<MemberSubscription | null> => {
  try {
    const response = await fetchApi<MemberSubscription>("member/subscription/current");
    const data = response?.data;
    if (!data) return null;
    return {
      isSubscribed: data.isSubscribed ?? false,
      transaction: data.transaction ?? null,
      plan: data.plan ?? null,
    };
  } catch {
    // Non-fatal: the dashboard/subscription page will refetch this on its own.
    return null;
  }
};

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const setAuth = useAuthStore((s) => s.setAuth);

  const { handlePost, isPending } = usePostHook();
  const usenavigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { login_details: "", password: "" },
  });

  const submitLogin = (data: LoginFormValues) => {
    handlePost(
      "auth/login",
      data,
      undefined,
      (res: ApiResponse<LoginResponse["data"]> & { token?: string }) => {
        if (res.code !== 200 || !res.token) {
          toast.error(res.message || "Email or Password is Incorrect");
          return;
        }
        const apiData = res.data;
        const token = res.token;
        const subscribed = normalizeSubscribed(apiData.isSubscribed);

        // Keep legacy inline-storage keys (other pages/Hooks still read them).
        localStorage.setItem("igbo_token", token);
        localStorage.setItem("fName", apiData.name_of_member_organization ?? "");
        localStorage.setItem("igbo_sub", String(subscribed ? 1 : 0));
        localStorage.setItem("igbo_email", apiData.email ?? "");

        // Initialize the persistent user store.
        setAuth({
          token,
          user: {
            email: apiData.email ?? "",
            name: apiData.name_of_member_organization ?? "",
            isSubscribed: apiData.isSubscribed ?? false,
          },
        });

        // Fetch + store the current subscription from `/member/subscription/current`,
        // then continue to the dashboard.
        loadUserSubscription()
          .then((sub) => {
            if (!sub) return;
            const subscribedNow = normalizeSubscribed(sub.isSubscribed);
            setAuth({
              subscription: sub,
              user: {
                email: apiData.email ?? "",
                name: apiData.name_of_member_organization ?? "",
                isSubscribed: subscribedNow,
              },
            });
            localStorage.setItem("igbo_sub", String(subscribedNow ? 1 : 0));
          })
          .finally(() => {
            toast.success(res.message);
            usenavigate("/dashboard/");
          });
      },
    );
  };

  const onInvalid = (formErrors: Record<string, { message?: string }>) => {
    toast.error(Object.values(formErrors)[0]?.message);
  };

  return (
    <section className="px-0 py-0 grid xl:grid-cols-2 grid-cols-1 items-center">
      <div className="">
        <form
          onSubmit={form.handleSubmit(submitLogin, onInvalid)}
          noValidate
          className="login md:w-[32rem] w-full mx-auto"
        >
          <RenderLogo />

          <div className="log_head">
            <h3>Sign in</h3>

            <p> Please login to continue</p>
          </div>
          <div className="input_log">
            <label htmlFor="email">Email or Username</label>
            <div>
              {" "}
              <HiOutlineMail />{" "}
              <input
                type="text"
                placeholder="Enter Email or Username"
                {...form.register("login_details")}
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
                placeholder="Password"
                {...form.register("password")}
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

          <p className="text-grey-800 font-normal mt-2 ">
            Forgot Password?{" "}
            <a
              href="/forgot-password"
              className="text-[#015907] font-medium underline pb-1 cursor-pointer"
            >
              Click here
            </a>
          </p>

          <button type="submit" className="login_btn" disabled={isPending}>
            {isPending ? "Verifying..." : "Login"}
          </button>
          <p>
            Don't have an account?{" "}
            <a href="/auth/register" className="text-[#015907] font-medium">
              <span className="text-[#015907] font-medium">Create Account</span>
            </a>
          </p>
        </form>
      </div>

      <div className="hidden xl:block h-full">
        <img src={"/new_side.jpeg"} alt="" className="object-cover object-center h-full" />
      </div>
    </section>
  );
};

export default Login;
