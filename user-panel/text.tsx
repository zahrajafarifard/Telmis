"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loginHandler = async () => {
    // console.log(username , password);

    // dispatch(login(username, password));

    setUsername("");
    setPassword("");
  };
  return (
    <div>
      <div className="flex flex-row justify-between ">
        <div className="w-1/2">
          <Image
            src="/images/client-portal/login.png"
            className="w-full h-screen"
            width={1000}
            height={1000}
            alt=""
          />
        </div>
        <div style={{ direction: "rtl" }} className="w-1/2 my-auto">
          <div className="w-[70%] mx-auto">
            <Image
              src="/images/Telmis-Logo-Red.png"
              className="w-30 mb-5"
              width={150}
              height={10}
              alt=""
            />
            <div className="text-right text-[#221D23] font-bold text-[38px]  leading-[58px] mb-2">
              به پنل خود وارد شوید
            </div>
            <div className="text-right text-[#8F8F8F] leading-[31px] ">
              به گروه ما خوش آمدید!
            </div>

            <Image
              src="/images/client-portal/login-border.png"
              className="w-full my-5"
              width={1000}
              height={10}
              alt=""
            />

            <div className="mb-6">
              <div className="text-right text-[#221D23] leading-[31px] mb-2">
                نام کاربری
              </div>
              <input
                placeholder="نام کاربری خود را وارد کنید"
                className="w-full p-4 bg-[#f7f7f7] rounded-[8px] focus:outline-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <div className="text-right text-[#221D23] leading-[31px] mb-2">
                رمز عبور
              </div>
              <div className="w-full p-2 bg-[#f7f7f7] rounded-[8px] flex flex-row justify-between">
                <input
                  placeholder="رمز عبور خود را وارد کنید"
                  className="w-[84%] p-2 bg-[#f7f7f7] flex focus:outline-none"
                  value={password}
                  type={!showPassword ? "password" : "text"}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <Image
                  onClick={() => setShowPassword((prev) => !prev)}
                  src={`${
                    !showPassword
                      ? "/images/client-portal/view.svg"
                      : "/images/client-portal/view-off.svg"
                  }`}
                  className="w-5 h-5 my-auto ml-4 cursor-pointer"
                  width={100}
                  height={100}
                  alt=""
                />
              </div>
            </div>

            <div className="mt-10 mb-5">
              <button
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
                // onClick={() => navigate("/password")}
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
