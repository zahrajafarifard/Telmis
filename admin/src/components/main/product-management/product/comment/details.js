import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useSelector } from "react-redux";
import moment from "moment-jalaali";

import modalImage from "../../../../../assets/images/modalBack.png";
import refuseIcon from "../../../../../assets/images/refuse.svg";
import confirmIcon from "../../../../../assets/images/confirm.svg";
import CheckCircleIcon from "../../../../../assets/images/Check_ring.svg";

const RequestDetails = ({
  id,
  name,
  mail,
  date,
  rating,
  comment,
  setComments,
  setCheckedComments,
}) => {
  const _token = useSelector((state) => state.reducer.token);
  const [token, setToken] = useState("");

  useEffect(() => {
    setToken(_token);
  }, [_token]);

  const [showConfirmBox, setShowConfirmBox] = useState(false);
  const [showRefuseBox, setShowRefuseBox] = useState(false);
  const [confirmUsername, setConfirmUsername] = useState(name);
  const [confirmMobile, setConfirmMobile] = useState(mail);

  const [isChecked, setIsChecked] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");

  const handleCheckboxChange = (newComment) => {
    setIsChecked((prevChecked) => !prevChecked);

    setCheckedComments((prevComment) => {
      if (isChecked) {
        return prevComment.filter((comment) => comment.id !== newComment.id);
      } else {
        return [...prevComment, newComment];
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

  const confirmCommentHandler = async () => {
    let _response, _data;

    _response = await fetch(
      `${process.env.REACT_APP_URL}/products/confirm-comment`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          id,
          name: confirmUsername,
          mail: confirmMobile,
        }),
      }
    );

    switch (_response.status) {
      case 201:
        await setComments((prevStates) => {
          return prevStates.filter((item) => item.id !== id);
        });

        setSuccessMessage("کاربر جدید افزوده شد!");

        break;

      default:
        break;
    }
  };

  const denyCommentHandler = async () => {
    let _response;

    _response = await fetch(
      `${process.env.REACT_APP_URL}/products/refuse-comment`,
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
        setComments((prevStates) => {
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
      <div className="text-2xl mb-3">تایید نظر </div>
      <div style={{ direction: "rtl" }} className="mt-4 mb-10 text-xl">
        شما در حال تایید نظر کاربر هستید
      </div>

      <div className="flex flex-row-reverse justify-center mt-10">
        <div
          onClick={() => {
            setShowConfirmBox(false);
            confirmCommentHandler();
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
        شما در حال رد نظر کاربر هستید
      </div>

      <div className="flex flex-row-reverse justify-center mt-10">
        <div
          onClick={() => {
            setShowRefuseBox(false);
            denyCommentHandler();
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
    <div className="grid grid-cols-8 text-[#6D6F72] border text-sm rounded-sm my-4 py-2">
      <input
        className="accent-[#B71F26] w-4 h-4 mx-auto my-auto  shadow-[0_2px_4px_0_rgba(133,146,163,0.4)]"
        type="checkbox"
        checked={isChecked}
        onChange={() => {
          handleCheckboxChange({
            id: id,
            name: name,
            mail: mail,
          });
        }}
      />

      <div className="text-center my-auto">{name}</div>

      <div className="text-center my-auto">{mail}</div>
      <div className="text-center my-auto col-span-2 line-clamp-1 hover:line-clamp-none">
        {comment}
      </div>
      <div className="text-center my-auto">{rating ? rating : "-"}</div>
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
            <img src={refuseIcon} className="w-4 h-4 my-auto ml-2 " />
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

              <div className="w-1/2 z-30 fixed justify-center h-fit mx-auto inset-x-0 my-auto inset-y-0 ">
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
                className="w-full h-full bg-[#4c4c4c]   opacity-60 fixed top-0 left-0 z-20 "
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
