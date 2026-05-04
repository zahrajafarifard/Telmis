import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useSelector } from "react-redux";
import moment from "moment-jalaali";

import modalImage from "../../../../assets/images/modalBack.png";
import refuseIcon from "../../../../assets/images/refuse.svg";
import confirmIcon from "../../../../assets/images/confirm.svg";
import CheckCircleIcon from "../../../../assets/images/Check_ring.svg";

const RequestDetails = ({
  id,
  username,
  mobile,
  date,
  setRequests,
  setCheckedRequests,
}) => {
  const _token = useSelector((state) => state.reducer.token);
  const [token, setToken] = useState("");

  useEffect(() => {
    setToken(_token);
  }, [_token]);

  const [showConfirmBox, setShowConfirmBox] = useState(false);
  const [showRefuseBox, setShowRefuseBox] = useState(false);
  const [confirmUsername, setConfirmUsername] = useState(username);
  const [confirmMobile, setConfirmMobile] = useState(mobile);
  const [isChecked, setIsChecked] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  

  const handleCheckboxChange = (newRequest) => {
    setIsChecked((prevChecked) => !prevChecked);

    setCheckedRequests((prevRequests) => {
      if (isChecked) {
        return prevRequests.filter((request) => request.id !== newRequest.id);
      } else {
        return [...prevRequests, newRequest];
      }
    });
  };

  const showConfirmRequestBox = async () => {
    setShowConfirmBox(true);
  };

  const _successBox = (
    <div
      style={{
        background: `url(${modalImage})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
      className="w-2/3 text-white  mx-auto text-center bg-gradient-to-r from-[#640509] to-[#B71F26] px-8 py-14 font-Peyda rounded-[15px]"
    >
      <div className=" w-full mx-auto">
        <img src={CheckCircleIcon} className=" w-16 h-16 mx-auto" />
      </div>
      <div style={{ direction: "rtl" }} className="my-3 text-2xl">
        {successMessage}
      </div>

      <div
        onClick={() => {
          setSuccessMessage("");
        }}
        className="text-[#221D23] bg-[#FFDA8A] w-1/3 py-2  rounded-[50px] text-lg mx-auto cursor-pointer"
      >
        بازگشت به پنل
      </div>
    </div>
  );

  const confirmRequestHandler = async () => {
    let _response;

    _response = await fetch(
      `${process.env.REACT_APP_URL}/exchange/confirm-request`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          id,
          username: confirmUsername,
          mobile: confirmMobile,
        }),
      }
    );

    switch (_response.status) {
      case 201:
        setRequests((prevStates) => {
          return prevStates.filter((item) => item.id !== id);
        });

        setSuccessMessage("کاربر جدید افزوده شد!");
        break;

      default:
        break;
    }
  };

  const denyRequestHandler = async () => {
    let _response;

    _response = await fetch(
      `${process.env.REACT_APP_URL}/exchange/refuse-request`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          id,
        }),
      }
    );

    switch (_response.status) {
      case 200:
        setRequests((prevStates) => {
          return prevStates.filter((item) => item.id !== id);
        });
        break;

      default:
        break;
    }
  };

  const _confirmBox = (
    <div
      style={{
        background: `url(${modalImage})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
      className="w-2/3 text-white  mx-auto text-center bg-gradient-to-r from-[#640509] to-[#B71F26] pt-10 pb-12 px-16 font-Peyda rounded-[15px] "
    >
      <div className="text-2xl mb-3">افزودن کاربر</div>
      <div style={{ direction: "rtl" }} className="mb-10 text-xl">
        شما در حال افزودن کاربر با مشخصات زیر هستید:
      </div>
      <div
        style={{ direction: "rtl" }}
        className=" flex flex-col w-[95%] mx-auto"
      >
        <div className="text-right mb-1">نام کاربری</div>
        <input
          value={confirmUsername}
          className="py-1.5 text-[#919191] bg-[#F7F7F7] px-4 rounded-[8px] border-none focus:border-none focus:outline-none focus:ring-0"
          onChange={(e) => setConfirmUsername(e.target.value)}
        />
      </div>
      <div
        style={{ direction: "rtl" }}
        className=" flex flex-col w-[95%] mx-auto mt-6"
      >
        <div className="text-right mb-1">شماره تماس</div>
        <input
          value={confirmMobile}
          className="py-1.5 text-[#919191] bg-[#F7F7F7] px-4 rounded-[8px] border-none focus:border-none focus:outline-none focus:ring-0"
          onChange={(e) => setConfirmMobile(e.target.value)}
        />
      </div>

      <div className="flex flex-row-reverse justify-center mt-14">
        <div
          onClick={() => {
            setShowConfirmBox(false);
            confirmRequestHandler();
          }}
          className="text-[#221D23] bg-[#FFDA8A] w-1/3 py-1  rounded-[50px] ml-1 cursor-pointer"
        >
          تایید
        </div>
        <div
          onClick={() => setShowConfirmBox(false)}
          className="bg-white text-[#919191] border border-white w-1/3 py-1 rounded-[50px] mr-1 cursor-pointer"
        >
          لغو
        </div>
      </div>
    </div>
  );

  const _refuseBox = (
    <div
      style={{
        background: `url(${modalImage})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
      className="w-2/3 text-white  mx-auto text-center bg-gradient-to-r from-[#640509] to-[#B71F26] pt-10 pb-12 font-Peyda rounded-[15px] "
    >
      <div> رد درخواست</div>
      <div style={{ direction: "rtl" }} className="mt-3">
        شما در حال رد درخواست ثبت نام کاربر هستید
      </div>

      <div className="flex flex-row-reverse justify-center mt-10">
        <div
          onClick={() => {
            setShowRefuseBox(false);
            denyRequestHandler();
          }}
          className="text-[#221D23] bg-[#FFDA8A] w-1/4 py-1 rounded-[50px] ml-1 cursor-pointer"
        >
          تایید
        </div>
        <div
          onClick={() => setShowRefuseBox(false)}
          className="text-[#919191]  bg-white  w-1/4 py-1 rounded-[50px] mr-1 cursor-pointer"
        >
          لغو
        </div>
      </div>
    </div>
  );
  return (
    <div className="grid grid-cols-5 text-[#6D6F72] border text-sm rounded-sm my-4 py-2">
      <input
        className="accent-[#B71F26] w-4 h-4 mx-auto my-auto  shadow-[0_2px_4px_0_rgba(133,146,163,0.4)]"
        type="checkbox"
        checked={isChecked}
        onChange={() => {
          handleCheckboxChange({
            id: id,
            username: username,
            mobile: mobile,
          });
        }}
      />

      <div className="text-center my-auto">{username}</div>

      <div className="text-center my-auto">{mobile}</div>
      <div className="text-center my-auto">
        {moment(date).format("jYYYY/jMM/jDD")}
      </div>
      {!isChecked && (
        <div className="text-center flex flex-row justify-center my-auto">
          <div
            onClick={() => showConfirmRequestBox()}
            className="w-1/2 bg-[#A60014] text-white  flex flex-row justify-center p-1 rounded-[100px] cursor-pointer"
          >
            <img src={confirmIcon} className="w-5 h-4 my-auto ml-2" />
            تایید
          </div>
          <div
            onClick={() => setShowRefuseBox(true)}
            className="w-1/2 text-white bg-[#221D23] flex flex-row justify-center mx-2 p-1 rounded-[100px] cursor-pointer"
          >
            <img src={refuseIcon} className="w-4 h-4 my-auto ml-2" />
            رد کردن
          </div>
        </div>
      )}

      <div className={`${showConfirmBox && " relative"} `}>
        {showConfirmBox &&
          ReactDOM.createPortal(
            <div>
              <div
                className="w-full h-full bg-[#4c4c4c]   opacity-60 fixed top-0 left-0 z-20 "
                onClick={() => setShowConfirmBox(false)}
              />

              <div className="w-1/2 z-30 fixed justify-center h-fit mx-auto inset-x-0 my-auto inset-y-0">
                {_confirmBox}
              </div>
            </div>,

            document.getElementById("modal")
          )}
      </div>
      <div className={`${showRefuseBox && " relative"} `}>
        {showRefuseBox &&
          ReactDOM.createPortal(
            <div>
              <div
                className="w-full h-full bg-[#4c4c4c]   opacity-60 fixed top-0 left-0 z-20 "
                onClick={() => setShowRefuseBox(false)}
              />

              <div className="w-1/2 z-30 fixed justify-center h-fit mx-auto inset-x-0 my-auto inset-y-0">
                {_refuseBox}
              </div>
            </div>,

            document.getElementById("modal")
          )}
      </div>

      <div className={`${successMessage && " relative"} `}>
        {successMessage !== "" &&
          ReactDOM.createPortal(
            <div>
              <div
                className="w-full h-full bg-[#4c4c4c] opacity-60 fixed top-0 left-0 z-20 "
                onClick={() => {
                  setSuccessMessage("");
                }}
              />

              <div className="w-1/2 z-30 fixed justify-center h-fit mx-auto inset-x-0 my-auto inset-y-0">
                {_successBox}
              </div>
            </div>,

            document.getElementById("modal")
          )}
      </div>
    </div>
  );
};

export default RequestDetails;
