import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { login } from "../../store/action";
import LayOut from "../../mainLayout";
import Logo from "../../assets/images/logo.png";
import Img from "../../assets/images/login-in.png";
import Pass from "../../assets/images/view-off.svg";
import Text from "../../assets/images/view.svg";
import Border from "../../assets/images/login-border.png";
import WarningIcon from "../../assets/images/error.svg";

const Login = () => {
  const {
    register,
    setValue,
    getValues,
    formState: { errors, isDirty, isValid },
  } = useForm({
    mode: "all",
  });

  const registerOptions = {
    username: {
      required: true,
    },
    password: {
      required: true,
    },
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [response, setResponse] = useState({ code: 0, msg: "" });
  const [showPassword, setShowPassword] = useState(false);

  const _token = useSelector((state) => state.reducer.token);
  const [token, setToken] = useState();

  useEffect(() => {
    const timer = setTimeout(() => {
      setResponse({ code: 0, msg: "" });
    }, 4000);

    return () => clearTimeout(timer);
  }, [response]);

  useEffect(() => {
    setToken(_token);
  }, [_token]);

  const loginHandler = async (e) => {
    e.preventDefault();
    let res;
    setResponse({ code: 0, msg: "" });

    res = await fetch(`${process.env.REACT_APP_URL}/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mobile: getValues("username"),
        password: getValues("password"),
      }),
    });

    switch (res.status) {
      case 200:
        const data = await res.json();
        dispatch(login(data?.token));

        break;
      case 403:
        setResponse({ code: 403, msg: "نام کاربری یا رمز عبور اشتباه است." });
        break;

      default:
        setResponse({
          code: 500,
          msg: "خطای سمت سرور ، لطفا مجددا تلاش کنید.",
        });

        break;
    }
  };

  useEffect(() => {
    const listener = (event) => {
      if (event.code === "Enter") {
        event.preventDefault();
        !token && loginHandler(event);
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [getValues("username"), getValues("password"), loginHandler, token]);

  if (token) {
    return <LayOut />;
  }

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
            <img src={Logo} className="w-32 mb-5" />
            <div className="text-right text-[#221D23] font-bold text-[38px]  leading-[58px] mb-2">
              به پنل خود وارد شوید
            </div>
            <div className="text-right text-[#8F8F8F] leading-[31px] ">
              به پنل ادمین خوش آمدید!
            </div>

            <img src={Border} className="w-full my-5" />

            <div className="mb-6">
              <div className="text-right text-[#221D23] leading-[31px] mb-2">
                نام کاربری
              </div>
              <input
                style={{
                  WebkitBoxShadow: "0 0 0px 1000px #f7f7f7 inset",
                  WebkitTextFillColor: "#000",
                }}
                placeholder="نام کاربری خود را وارد کنید"
                className={`w-full p-4 bg-[#f7f7f7] rounded-[8px] focus:outline-none ${
                  errors.username && "border border-[#A60014]"
                }`}
                onChange={(e) => setValue("username", e.target.value)}
                {...register("username", registerOptions.username)}
              />
            </div>
            <div>
              <div className="text-right text-[#221D23] leading-[31px] mb-2">
                رمز عبور
              </div>
              <div
                className={`w-full p-2 bg-[#f7f7f7] rounded-[8px] flex flex-row justify-between ${
                  errors.password && "border border-[#A60014]"
                }`}
              >
                <input
                  style={{
                    WebkitBoxShadow: "0 0 0px 1000px #f7f7f7 inset",
                    WebkitTextFillColor: "#000",
                  }}
                  placeholder="رمز عبور خود را وارد کنید"
                  className="w-[84%] p-2 bg-[#f7f7f7] flex focus:outline-none"
                  type={!showPassword ? "password" : "text"}
                  onChange={(e) => setValue("password", e.target.value)}
                  {...register("password", registerOptions.password)}
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
                disabled={!isValid || !isDirty}
                onClick={loginHandler}
                className="w-full py-2 bg-[#A60014] rounded-[50px] text-white text-lg "
              >
                ورود
              </button>
            </div>

            <div className="leading-[31px]">
              <span className="text-[#221D23]">
                رمز خود را فراموش کرده اید؟
              </span>
              <span
                onClick={() => navigate("/password")}
                className="text-[#A60014] underline cursor-pointer"
              >
                فراموشی رمز عبور
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
