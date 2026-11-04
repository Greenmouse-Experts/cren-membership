// @ts-nocheck
import React from "react";
import { API_URL } from "@/app/services/env";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, Link } from "@/lib/router-compat";
import RenderLogo from "../components/RenderLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { HiOutlineMail } from "react-icons/hi";

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Please enter Email").email("Please enter a valid email"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordValues) => {
    try {
      const res = await axios.post(
        `${API_URL}/auth/password/email`,
        { email: values.email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (res.data?.code === 200) {
        toast.success("check your email to get verification code");
        navigate("/password-reset/");
      } else {
        toast.error(res.data?.message || "Failed to send reset code");
      }
    } catch (err: any) {
      if (err?.response?.data?.message) {
        toast.error(err.response.data.message);
      }
      if (err?.response?.data?.errors) {
        Object.entries(err.response.data.errors).forEach(([_, value]: any) => {
          toast.error(Array.isArray(value) ? value[0] : value);
        });
      }
    }
  };

  const onInvalid = (errors: any) => {
    if (errors.email?.message) {
      toast.error(errors.email.message);
    }
  };

  return (
    <main className="min-h-screen w-full bg-[#f8f9fa] dark:bg-darkMood flex items-stretch">
      <section className="w-full grid xl:grid-cols-2 grid-cols-1 min-h-screen">
        <div className="flex flex-col justify-center items-center px-6 py-12 sm:px-12 lg:px-16 w-full">
          <form
            onSubmit={handleSubmit(onSubmit, onInvalid)}
            noValidate
            className="w-full sm:w-[32rem] bg-white dark:bg-card p-8 sm:p-10 rounded-2xl shadow-sm border border-border/60 flex flex-col justify-center items-center gap-6"
          >
            <RenderLogo />

            <div className="flex flex-col gap-2 w-full text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Forget Password?
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                Enter the email address associated with your account.
              </p>
            </div>

            <div className="flex flex-col gap-6 w-full">
              <div className="space-y-2 text-left">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Email
                </Label>
                <div className="relative flex items-center">
                  <HiOutlineMail className="absolute left-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter Email"
                    className="pl-11 h-11 rounded-lg border-gray-300 focus:border-[#015907] focus:ring-[#015907]"
                    {...register("email")}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 bg-[#015907] hover:bg-[#014705] text-white font-semibold rounded-lg transition-colors cursor-pointer"
              >
                {isSubmitting ? "Verifying..." : "Continue"}
              </Button>

              <p className="text-center text-sm text-gray-600 dark:text-gray-300">
                Remembered Password?{" "}
                <Link
                  to="/login"
                  className="text-[#015907] font-semibold hover:underline cursor-pointer"
                >
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>

        <div className="hidden xl:block relative h-full w-full">
          <img
            src="/new_side.jpeg"
            alt="CREN Community"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        </div>
      </section>
    </main>
  );
};

export default ForgotPassword;
