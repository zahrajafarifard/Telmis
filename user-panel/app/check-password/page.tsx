"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCookie } from "cookies-next";
import { useForm } from "react-hook-form";

import { client } from "@/store/slices/client";
import { useNavigateMobile } from "@/components/shared/page";
import LogInImg from "@/public/images/login.png";
import Logo from "@/public/images/Telmis-Logo-Red.png";
import ErrorIcon from "@/public/images/error.svg";
import Border from "@/public/images/login-border.png";
import showPasswordIcon from "@/public/images/view.svg";
import hidePasswordIcon from "@/public/images/view-off.svg";
import refreshIcon from "@/public/images/refresh.svg";
import "@/components/shared/style.css";

const CheckPassword = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");

  const { mobile, captcha } = useNavigateMobile();
  const [mobileState, setMobileState] = useState<string>("");
  const [capchaState, setCapchaState] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState<{ code: number; msg: string }>({
    code: 0,
    msg: "",
  });

  const {
    register,
    getValues,
    formState: { errors, isValid, isDirty, isSubmitting },
  } = useForm<{ code: string; password: string }>({
    mode: "all",
  });
  useEffect(() => {
    // mobile && setMobileState(mobile);

    if (mobile) {
      setMobileState(mobile);
    }
  }, [setMobileState, mobile]);

  useEffect(() => {
    // captcha && setCapchaState(captcha);
    if (captcha) {
      setCapchaState(captcha);
    }
  }, [captcha, setCapchaState]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowError({ code: 0, msg: "" });
    }, 4000);

    return () => clearTimeout(timer);
  }, [showError]);

  const passwordHandler = async () => {
    setShowError({
      code: 0,
      msg: "",
    });
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/clients/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile: mobileState,
          capcha: getValues("code"),
          sms: getValues("password"),
        }),
      }
    );

    switch (response.status) {
      case 200:
        const data = await response.json();
        console.log("dddddd", data);
        dispatch(client({ token: data?.token }));
        if (redirectTo) {
          if (redirectTo?.includes("job-position")) {
            // if (data?.isResumeSentToAdmin) {
            if (data?.resume) {
              setCookie("token", data?.token, {
                maxAge: 60 * 60 * 2,
                domain: ".telmis.ir",
                path: "/",
                secure: true,
                sameSite: "none",
              });

              setCookie("isResumeSentToAdmin", data?.isResumeSentToAdmin, {
                maxAge: 60 * 60 * 2,
                domain: ".telmis.ir",
                path: "/",
                secure: true,
                sameSite: "none",
              });

              return router.push(`${redirectTo}`);
            } else {
              return router.push(`/client/resume?redirectTo=${redirectTo}`);
            }
          }

          if (!redirectTo?.includes("job-position")) {
            setCookie("token", data?.token, {
              maxAge: 60 * 60 * 2,
              domain: ".telmis.ir",
              path: "/",
              secure: true,
              sameSite: "none",
            });
            router.push(`${redirectTo}`);
          }
        } else {
          router.push("/client/overall-view");
        }

        break;

      //423 429

      case 429:
        setShowError({
          code: 429,
          msg: "به دلیل چندین تلاش ناموفق حساب شما مسدود شده است ، بعدا تلاش کنید.",
        });
        break;
      case 423:
        setShowError({ code: 423, msg: " کد(های) امنیتی منقضی شده است." });
        break;

      case 424:
        setShowError({ code: 424, msg: " کد(های) امنیتی اشتباه است ." });
        break;
      case 407:
        setShowError({
          code: 407,
          msg: "لطفا ابتدا حساب کاربری خود را ایجاد کنید",
        });
        break;
      case 500:
        setShowError({ code: 500, msg: " خطای سمت سرور، بعدا تلاش کنید ." });
        break;
      default:
        break;
    }
  };

  const regeneratePasswordHandler = async () => {
    const _response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/clients/regenerateCredentials`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile: mobile,
        }),
      }
    );

    switch (_response.status) {
      case 200:
        const _data = await _response.json();
        console.log("2000", _data);
        break;

      case 400:
        router.push("/");
        break;
      case 404:
        setShowError({ code: 400, msg: "اطلاعات وارد شده صحیح نیست." });
        break;

      case 500:
        setShowError({ code: 500, msg: "خطای سمت سرور ، بعدا تلاش کنید." });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.code === "Enter") {
        event.preventDefault();
        passwordHandler();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [passwordHandler]);

  const regenerateCapchaHandler = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/clients/regenerate-capcha`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile: mobile,
        }),
      }
    );

    switch (response.status) {
      case 200:
        const data = await response.json();

        const base64String = btoa(String.fromCharCode(...data.capcha.data)); //convert decimal to hex
        setCapchaState(base64String);
        break;

      case 404:
      case 500:
        setShowError({ code: 500, msg: "خطای سمت سرور ، بعدا تلاش کنید." });
        break;

      default:
        setShowError({ code: 500, msg: "خطای سمت سرور ، بعدا تلاش کنید." });
        break;
    }
  };

  return (
    <div>
      {showError.code !== 0 && (
        <div className="fixed top-10 right-0 rounded-s-[8px] bg-[#FFF099] flex flex-row-reverse w-fit pr-16 pl-10">
          <Image src={ErrorIcon} width={20} height={20} alt="" />
          <div
            style={{ direction: "rtl" }}
            className=" text-[#D76B00]  py-4 mr-2 whitespace-nowrap"
          >
            {showError.msg}
          </div>
        </div>
      )}

      <div className="flex flex-row justify-between ">
        <div className="w-1/2 relative h-screen">
          <Image
            src={LogInImg}
            className="w-full h-full object-cover"
            fill
            quality={40}
            priority={true}
            alt="عکس صفحه ورود به پرتال مشتریان تلمیس"
            sizes="50vw"
          />
        </div>
        <div style={{ direction: "rtl" }} className="w-1/2 my-auto">
          <div className="w-[70%] mx-auto">
            <Image
              src={Logo}
              className="w-30 mb-5"
              width={150}
              height={10}
              alt="لوگو شرکت داده پردازان تلمیس"
            />
            <div className="text-right text-[#221D23] font-bold text-[38px]  leading-[58px] mb-2">
              به پنل خود وارد شوید
            </div>
            <div className="text-right text-[#8F8F8F] leading-[31px] ">
              به گروه ما خوش آمدید!
            </div>

            <Image
              src={Border}
              className="w-full my-5"
              width={1000}
              height={10}
              alt="حاشیه"
            />

            <div className="mb-6">
              <div className="text-right text-[#221D23] leading-[31px] mb-2">
                رمز یک بار مصرف <span className="text-[#A60014]">*</span>
              </div>
              <div
                className={`flex flex-row bg-[#f7f7f7] rounded-[8px] ${
                  (showError.code === 404 || errors.password) &&
                  "border border-[#B3323A]"
                } `}
              >
                <input
                  placeholder=" رمز عبور خود را وارد کنید"
                  className={`w-[90%] p-4 bg-[#f7f7f7] rounded-[8px] focus:outline-none `}
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: true,
                  })}
                />

                <div
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="w-[10%] flex justify-end ml-3 cursor-pointer"
                >
                  <Image
                    src={showPassword ? hidePasswordIcon : showPasswordIcon}
                    width={24}
                    height={24}
                    alt=""
                    className="ایکن نمایش یا عدم نمایش پسورد"
                  />
                </div>
              </div>
              <div
                onClick={regeneratePasswordHandler}
                className="text-left text-[#A60014] underline mt-1 cursor-pointer"
              >
                ارسال مجدد کد
              </div>
            </div>

            <div
              className={`mb-6 flex flex-row bg-[#f7f7f7] rounded-[8px] ${
                errors.code && "border border-[#B3323A]"
              }`}
            >
              <input
                placeholder="کد روبرو را وارد کنید"
                className="w-[60%] p-4 bg-[#f7f7f7] rounded-[8px] focus:outline-none"
                {...register("code", {
                  required: true,
                })}
              />
              <div className="my-auto  w-[10%]">
                <Image
                  onClick={() => regenerateCapchaHandler()}
                  src={refreshIcon}
                  width={24}
                  height={24}
                  alt="ایکن رفرش"
                  className="my-auto mx-auto"
                />
              </div>
              <div className="my-auto w-[30%]">
                {capchaState && (
                  <div className="mx-auto w-full my-auto flex flex-row-reverse justify-center h-14">
                    <Image
                      className="my-auto mx-auto screen620:w-[60%] rounded-e-[8px] h-full"
                      src={`data:image/png;base64,${capchaState}`}
                      alt="Captcha"
                      width={180}
                      height={100}
                      unoptimized // Required to use base64 images directly
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-16 mb-5">
              <button
                disabled={!isValid || !isDirty || isSubmitting}
                onClick={passwordHandler}
                className="button w-full py-2 bg-[#A60014] rounded-[50px] text-white text-lg disabled:cursor-not-allowed"
              >
                <span className="button-hover-effect"></span>
                <p className="button-hover-effect-text ">ورود</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckPassword;
