import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Logo from "../../assets/images/logo.png";
import Img from "../../assets/images/login-in.png";
import Border from "../../assets/images/login-border.png";
import Pass from "../../assets/images/view-off.svg";
import Text from "../../assets/images/view.svg";
import WarningIcon from "../../assets/images/error.svg";

const CheckSecurity = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const _mobile = location?.state?.mobile;
  const [response, setResponse] = useState({ code: 0, msg: "" });

  const [mobile, setMobile] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setMobile(_mobile);
  }, [_mobile, mobile]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setResponse({ code: 0, msg: "" });
    }, 4000);

    return () => clearTimeout(timer);
  }, [response]);

  const checkSecurityCodeHandler = async () => {
    let _response;
    _response = await fetch(
      `${process.env.REACT_APP_URL}/admin/checkSecurityCode`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile: _mobile,
          securityCode,
        }),
      }
    );

    switch (_response.status) {
      case 200:
        navigate("/set-new-password", {
          state: {
            mobile: mobile,
          },
        });
        break;
      case 404:
        setResponse({ code: 404, msg: "رمز عبور وارد شده اشتباه است ." });
        break;

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
              کد ۶ رقمی ارسال شده را در کادر زیر وارد کنید.
            </div>

            <img src={Border} className="w-full my-5" />

            <div>
              <div className="text-right text-[#221D23] leading-[31px] mb-2">
                کد امنیتی
              </div>
              <div className="w-full p-2 bg-[#f7f7f7] rounded-[8px] flex flex-row justify-between">
                <input
                  placeholder="کد امنیتی خود را وارد کنید"
                  className="w-[84%] p-2 bg-[#f7f7f7] flex focus:outline-none"
                  type={!showPassword ? "password" : "text"}
                  value={securityCode}
                  onChange={(e) => setSecurityCode(e.target.value)}
                />

                <img
                  onClick={() => setShowPassword((prev) => !prev)}
                  src={!showPassword ? Text : Pass}
                  className="w-5 h-5 my-auto ml-4 cursor-pointer"
                />
              </div>
            </div>

            <div className="mt-10 mb-5">
              <button
                onClick={checkSecurityCodeHandler}
                className="w-full py-2 bg-[#A60014] rounded-[50px] text-white text-lg "
              >
                تایید
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckSecurity;
