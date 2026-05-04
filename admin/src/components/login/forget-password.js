import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import Logo from "../../assets/images/logo.png";
import Img from "../../assets/images/login-in.png";
import Border from "../../assets/images/login-border.png";
import WarningIcon from "../../assets/images/error.svg";

const ForgetPassword = () => {
  const [response, setResponse] = useState({ code: 0, msg: "" });

  const {
    register,
    setValue,
    getValues,
    formState: { errors, isDirty, isValid },
  } = useForm({
    mode: "all",
  });

  const registerOptions = {
    mobile: {
      required: " شماره موبایل اجباری است",
      pattern: {
        value: /^[0-9]{4}$/, ////////////////////////////////////////////////////////
        message: "شماره موبایل معتبر نمی باشد . ",
      },
    },
  };

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setResponse({ code: 0, msg: "" });
    }, 4000);

    return () => clearTimeout(timer);
  }, [response]);

  const generateSecurityCodeHandler = async () => {
    let _response;
    setResponse({ code: 0, msg: "" });

    _response = await fetch(
      `${process.env.REACT_APP_URL}/admin/generateSecurityCode`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile: getValues("mobile"),
        }),
      }
    );

    switch (_response.status) {
      case 200:
        navigate("/check-security-code", {
          state: { mobile: getValues("mobile") },
        });
        break;

      case 404:
        setResponse({
          code: 404,
          msg: "شماره موبایل وارد شده در سیستم وجود ندارد",
        });

      default:
        break;
    }
  };

  return (
    <div>
      {response.code !== 0 && (
        <div className="fixed top-8 right-0 w-fit whitespace-nowrap text-[#434242] text-sm flex flex-row-reverse bg-[#FFF099] py-2 pr-14 pl-24  rounded-sm my-auto">
          <img src={WarningIcon} alt="آیکن هشدار" className="my-auto w-6 h-6" />
          <div
            style={{ direction: "rtl" }}
            className="my-auto mr-2 text-[#D76B00]"
          >
            {response.msg}
          </div>
        </div>
      )}
      <div className="flex flex-row justify-between ">
        <div className="w-1/2">
          <img src={Img} className="w-full h-screen" />
        </div>
        <div style={{ direction: "rtl" }} className="w-1/2 my-auto">
          <div className="w-[70%] mx-auto">
            <img src={Logo} className="w-30 mb-5" />
            <div className="text-right text-[#221D23] font-bold text-[38px]  leading-[58px] mb-2">
              فراموشی رمز عبور
            </div>
            <div className="text-right text-[#8F8F8F] leading-[31px] ">
              لطفا شماره تماس خود را وارد کنید تا کد برای شما ارسال شود.
            </div>

            <img src={Border} className="w-full my-5" />

            <div className="mb-6">
              <div className="text-right text-[#221D23] leading-[31px] mb-2">
                شماره تماس
              </div>
              <input
                placeholder="شماره تماس خود را وارد کنید"
                className={`w-full p-4 bg-[#f7f7f7] rounded-[8px] focus:outline-none ${
                  errors.mobile && "border border-[#A60014]"
                }`}
                onChange={(e) => setValue("mobile", e.target.value)}
                {...register("mobile", registerOptions.mobile)}
              />
              {errors?.mobile && (
                <div
                  style={{ direction: "rtl" }}
                  className="my-auto text-right text-xs mt-1 text-[#A60014]"
                >
                  {errors?.mobile.message}
                </div>
              )}
            </div>

            <div className="mt-10 mb-5">
              <button
                disabled={!isValid || !isDirty}
                onClick={generateSecurityCodeHandler}
                className="w-full py-2 bg-[#A60014] rounded-[50px] text-white text-lg disabled:cursor-not-allowed "
              >
                ارسال رمز
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
