import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";

import Logo from "../../assets/images/logo.png";
import Img from "../../assets/images/login-in.png";
import WarningIcon from "../../assets/images/error.svg";
import Border from "../../assets/images/login-border.png";
import Pass from "../../assets/images/view-off.svg";
import Text from "../../assets/images/view.svg";

const NewPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const _mobile = location?.state?.mobile;
  const [response, setResponse] = useState({ code: 0, msg: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatedPassword, setShowRepeatedPassword] = useState(false);

  const {
    register,
    setValue,
    getValues,
    formState: { errors, isDirty, isValid },
  } = useForm({
    mode: "all",
  });

  const registerOptions = {
    newPassword: {
      required: true,
    },
    repeatNewPassword: {
      required: true,
    },
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setResponse({ code: 0, msg: "" });
    }, 4000);

    return () => clearTimeout(timer);
  }, [response]);

  const newPasswordHandler = async () => {
    let _response;

    if (getValues("newPassword") !== getValues("repeatNewPassword")) {
      return setResponse({
        code: 403,
        msg: "رمز عبور و تکرار آن یکسان نیستند.",
      });
    }

    setResponse({ code: 0, msg: "" });

    _response = await fetch(
      `${process.env.REACT_APP_URL}/admin/set-new-password`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile: _mobile,
          newPassword: getValues("newPassword"),
          repeatNewPassword: getValues("repeatNewPassword"),
        }),
      }
    );

    switch (_response.status) {
      case 201:
        navigate("/");
        break;
      case 403:
        setResponse({ code: 403, msg: "رمز عبور و تکرار آن یکسان نیستند." });
        break;

      default:
        setResponse({ code: 500, msg: "خطای سمت سرور، لطفا بعدا تلاش کنید" });
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
              رمز عبور جدید
            </div>
            <div className="text-right text-[#8F8F8F] leading-[31px] ">
              یک رمز عبور جدید انتخاب کنید
            </div>

            <img src={Border} className="w-full my-5" />

            <div>
              <div className="text-right text-[#221D23] leading-[31px] mb-2">
                رمز عبور جدید
              </div>
              <div
                className={`w-full p-2 bg-[#f7f7f7] rounded-[8px] flex flex-row justify-between ${
                  errors.newPassword && "border border-[#A60014]"
                }`}
              >
                <input
                  placeholder="رمز عبور جدید خود را وارد کنید"
                  className="w-[84%] p-2 bg-[#f7f7f7] flex focus:outline-none"
                  type={!showPassword ? "password" : "text"}
                  onChange={(e) => setValue("newPassword", e.target.value)}
                  {...register("newPassword", registerOptions.newPassword)}
                />

                <img
                  onClick={() => setShowPassword((prev) => !prev)}
                  src={showPassword ? Pass : Text}
                  className="w-5 h-5 my-auto ml-4 cursor-pointer"
                />
              </div>
            </div>
            <div>
              <div className="text-right text-[#221D23] leading-[31px] mb-2">
                تکرار رمز عبور جدید
              </div>
              <div
                className={`w-full p-2 bg-[#f7f7f7] rounded-[8px] flex flex-row justify-between ${
                  errors.repeatNewPassword && "border border-[#A60014]"
                }`}
              >
                <input
                  placeholder=" تکرار رمز عبور جدید خود را وارد کنید"
                  className="w-[84%] p-2 bg-[#f7f7f7] flex focus:outline-none"
                  type={!showRepeatedPassword ? "password" : "text"}
                  onChange={(e) =>
                    setValue("repeatNewPassword", e.target.value)
                  }
                  {...register(
                    "repeatNewPassword",
                    registerOptions.repeatNewPassword
                  )}
                />

                <img
                  onClick={() => setShowRepeatedPassword((prev) => !prev)}
                  src={showRepeatedPassword ? Pass : Text}
                  className="w-5 h-5 my-auto ml-4 cursor-pointer"
                />
              </div>
            </div>

            <div className="mt-10 mb-5">
              <button
                disabled={!isDirty || !isValid}
                onClick={newPasswordHandler}
                className="w-full py-2 bg-[#A60014] rounded-[50px] text-white text-lg "
              >
                تغییر رمز عبور
              </button>
            </div>

            <div className="leading-[31px]">
              <span className="text-[#221D23]">ورود به حساب کاربری </span>
              <span
                onClick={() => navigate("/")}
                className="text-[#A60014] underline cursor-pointer"
              >
                ورود
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPassword;
