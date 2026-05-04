import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import viewPass1 from "../../../assets/images/view-off.svg";
import viewPass from "../../../assets/images/view.svg";
import infoIcon from "../../../assets/images/Check_ring-green.svg";
import WarningIcon from "../../../assets/images/error.svg";

const Admin = () => {
  const _token = useSelector((state) => state.reducer.token);

  const [response, setResponse] = useState({ code: 0, msg: "" });
  const [showPass, setShowPass] = useState(false);
  const [token, setToken] = useState("");
  const [admin, setAdmin] = useState({
    username: "",
    mobile: "",
    password: "",
  });

  useEffect(() => {
    setToken(_token);
  }, [_token]);

  useEffect(() => {
    const _adminData = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_URL}/admin/admin-profile`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      switch (response.status) {
        case 200:
          const data = await response.json();
          setAdmin({
            username: data?.data?.username,
            mobile: data?.data?.mobile,
            password: "",
          });

          break;

        default:
          break;
      }
    };

    token && _adminData();
  }, [token]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setResponse({ code: 0, msg: "" });
    }, 4000);

    return () => clearTimeout(timer);
  }, [response]);

  const changeCredentialHandler = async () => {
    if (admin.password.trim() === "") {
      return setResponse({ code: 500, msg: "رمز عبور نمی تواند خالی باشد . " });
    }
    const response = await fetch(
      `${process.env.REACT_APP_URL}/admin/updateCredential`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          admin,
        }),
      }
    );

    switch (response.status) {
      case 200:
        setResponse({ code: 200, msg: "رمز عبور شما با موفقیت تغییر کرد!" });
        break;

      default:
        setResponse({ code: 500, msg: "خطای سمت سرور، لطفا بعدا تلاش کنید." });

        break;
    }
  };
  return (
    <div className="w-[90%] mx-auto">
      {response.code == 200 && (
        <div className="fixed top-8 right-0 w-fit whitespace-nowrap  text-sm flex flex-row bg-[#CBEDCB] py-2 pr-14 pl-24  rounded-sm my-auto">
          <img src={infoIcon} alt="آیکن هشدار" className="my-auto w-6 h-6" />
          <div
            style={{ direction: "rtl" }}
            className="my-auto mr-2 text-[#219235]"
          >
            {response.msg}
          </div>
        </div>
      )}
      {response.code !== 0 && response.code !== 200 && (
        <div className="fixed top-8 right-0 w-fit whitespace-nowrap text-[#434242] text-sm flex flex-row bg-[#FFF099] py-2 pr-14 pl-24  rounded-sm my-auto">
          <img src={WarningIcon} alt="آیکن هشدار" className="my-auto w-6 h-6" />
          <div
            style={{ direction: "rtl" }}
            className="my-auto mr-2 text-[#D76B00]"
          >
            {response.msg}
          </div>
        </div>
      )}
      <div className="flex flex-row justify-between  space-x-4 space-x-reverse w-full  mt-12 mb-5">
        <div className="text-[#221D23] text-2xl leading-[36px] my-auto">
          حساب کاربری من
        </div>
        <hr className="flex flex-grow my-auto border-[#D9D9D9]" />
      </div>

      <div className="w-full">
        <div className="text-right text-xl leading-[31px] mb-2">نام کاربری</div>
        <input
          style={{
            WebkitBoxShadow: "0 0 0px 1000px #f7f7f7 inset",
            WebkitTextFillColor: "#000",
          }}
          className="bg-[#F7F7F7] text-[#221D23] rounded-[8px] p-4 w-full outline-none"
          value={admin?.username}
          onChange={(e) => {
            setAdmin((prev) => ({
              ...prev,
              username: e.target.value,
            }));
          }}
        />
      </div>

      <div className="w-full my-5">
        <div className="text-right text-xl leading-[31px] mb-2">شماره تماس</div>
        <input
          style={{
            WebkitBoxShadow: "0 0 0px 1000px #f7f7f7 inset",
            WebkitTextFillColor: "#000",
          }}
          className="bg-[#F7F7F7] text-[#221D23] rounded-[8px] p-4 w-full outline-none"
          value={admin?.mobile}
          onChange={(e) => {
            setAdmin((prev) => ({
              ...prev,
              mobile: e.target.value,
            }));
          }}
        />
      </div>

      <div className="w-full">
        <div className="text-right text-xl leading-[31px] mb-2">رمز عبور </div>
        <div className="flex flex-row w-full justify-between">
          <div className="w-[90%] rounded-[8px] bg-[#F7F7F7] flex flex-row justify-between">
            <input
              style={{
                WebkitBoxShadow: "0 0 0px 1000px #f7f7f7 inset",
                WebkitTextFillColor: "#000",
              }}
              className="bg-[#F7F7F7] text-[#221D23] rounded-[8px] p-4 w-[90%] outline-none"
              type={`${!showPass ? "password" : "text"}`}
              value={admin?.password}
              onChange={(e) => {
                setAdmin((prev) => ({
                  ...prev,
                  password: e.target.value,
                }));
              }}
            />

            <div
              onClick={() => setShowPass((prev) => !prev)}
              className="my-auto  w-16"
            >
              {!showPass ? (
                <img src={viewPass} className="mr-3 w-7 h-7" />
              ) : (
                <img src={viewPass1} className="mr-3 w-7 h-7" />
              )}
            </div>
          </div>
          <div
            onClick={changeCredentialHandler}
            className="bg-[#A60014] text-white w-[9.2%] rounded-e-[50px] rounded-s-[8px] flex justify-center items-center cursor-pointer"
          >
            تغییر رمز عبور
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
