import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { useSelector } from "react-redux";

import { useForm } from "react-hook-form";

import AddPhoto from "../../../../assets/images/add_a_photo.svg";
import RequestDetails from "./request-details";
import checkIcon from "../../../../assets/images/Check_ring.svg";
import closeIcon from "../../../../assets/images/user.svg";
import WarningIcon from "../../../../assets/images/error.svg";
import ErrIcon from "../../../../assets/images/error2.svg";
import AddUser from "../../../../assets/images/Add_User.svg";
import usernameIcn from "../../../../assets/images/account_circle.svg";
import phoneIcn from "../../../../assets/images/Phone.svg";
import calendarIcn from "../../../../assets/images/Calendar.svg";
import actionIcn from "../../../../assets/images/actions.svg";
import editIcn from "../../../../assets/images/Edit-profile.svg";
import modalImage from "../../../../assets/images/modalBack.png";
import CheckCircleIcon from "../../../../assets/images/Check_ring.svg";

const CreateUser = () => {
  const fileInputRef = useRef(null);

  const [requests, setRequests] = useState([]);
  const [checkedRequests, setCheckedRequests] = useState([]);
  const [profilePreview, setProfilePreview] = useState(AddPhoto);
  const [profileImage, setProfileImage] = useState();
  const [showConfirmBox, setShowConfirmBox] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [message, setMessage] = useState("");
  const _token = useSelector((state) => state.reducer.token);
  const [token, setToken] = useState("");

  useEffect(() => {
    setToken(_token);
  }, [_token]);

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
        value: /^[0-9]{11}$/,
        message: "شماره موبایل معتبر نمی باشد . ",
      },
    },
    username: {
      required: "Name is required",
    },
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage("");
    }, 4000);
    return () => clearTimeout(timer);
  }, [message]);

  useEffect(() => {
    const fetchedRequest = async () => {
      let _response, _data;
      _response = await fetch(
        `${process.env.REACT_APP_URL}/exchange/get-requests`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      switch (_response.status) {
        case 200:
          _data = await _response.json();
          setRequests(_data?.data);
          break;

        default:
          break;
      }
    };
    token && fetchedRequest();
  }, [token, setRequests]);

  const handleImageChange = (e) => {
    e.target.files[0] && setProfileImage(e.target.files[0]);

    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPhotoClick = () => {
    fileInputRef.current.click();
  };

  const createExchangeHandler = async () => {
    const formData = new FormData();

    formData.append("mobile", getValues("mobile"));
    formData.append("username", getValues("username"));
    formData.append("exchangeName", getValues("username"));
    formData.append("uploadingFiles", profileImage);

    let _response, _data;
    _response = await fetch(`${process.env.REACT_APP_URL}/exchange/create`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },

      body: formData,
    });

    switch (_response.status) {
      case 201:
        _data = await _response.json();
        setValue("username", "");
        setValue("mobile", "");
        setProfileImage("");
        setProfilePreview(AddPhoto);

        setSuccessMessage("کاربر جدید افزوده شد!");
        break;

      case 409:
        setMessage("مقادیر وارد شده تکراری هستند !");
        break;
      case 500:
        setMessage("خطای سمت سرور، بعدا تلاش کنید");
        break;

      default:
        setMessage("خطای سمت سرور، بعدا تلاش کنید");
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
      className="w-2/3 text-white  mx-auto text-center bg-gradient-to-r from-[#640509] to-[#B71F26] p-8 font-Peyda rounded-[15px]"
    >
      <div>افزودن کاربر</div>
      <div style={{ direction: "rtl" }} className="my-3">
        شما در حال افزودن کاربر با مشخصات زیر هستید:
      </div>
      <div className=" w-[95%] mx-auto mb-1 flex flex-row justify-center">
        <div className="mx-2">{getValues("username")}</div>
        <div>: نام کاربری</div>
      </div>
      <div className="w-[95%] mx-auto mt-8mb-1 flex flex-row justify-center">
        <span className="mx-2">{getValues("mobile")}</span>
        <span>: شماره تماس</span>
      </div>

      <div className="flex flex-row-reverse justify-center mt-6">
        <div
          onClick={() => {
            setShowConfirmBox(false);
            createExchangeHandler();
          }}
          className="text-[#221D23] bg-[#FFDA8A] w-1/4 py-1 rounded-[50px] ml-1 cursor-pointer"
        >
          تایید
        </div>
        <div
          onClick={() => setShowConfirmBox(false)}
          className="text-[#919191] bg-white w-1/4 py-1 rounded-[50px] mr-1 cursor-pointer"
        >
          لغو
        </div>
      </div>
    </div>
  );

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
    let _response, _data;

    _response = await fetch(
      `${process.env.REACT_APP_URL}/exchange/confirm-requests`, //group reqs
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },

        body: JSON.stringify({
          requests: checkedRequests,
        }),
      }
    );

    // _data = await _response.json();

    switch (_response.status) {
      case 201:
        checkedRequests?.map((req) => {
          return setRequests((prevStates) => {
            return prevStates.filter((item) => item.id !== req.id);
          });
        });

        setCheckedRequests("");

        break;

      default:
        break;
    }
  };

  const denyRequestHandler = async () => {
    let _response, _data;

    _response = await fetch(
      `${process.env.REACT_APP_URL}/exchange/refuse-requests`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },

        body: JSON.stringify({
          requests: checkedRequests,
        }),
      }
    );

    switch (_response.status) {
      case 200:
        checkedRequests?.map((req) => {
          return setRequests((prevStates) => {
            return prevStates.filter((item) => item.id !== req.id);
          });
        });

        setCheckedRequests("");
        break;

      default:
        break;
    }
  };

  return (
    <div className="w-[90%] mx-auto my-8">
      <div className="flex flex-row justify-between  w-full">
        <div className="text-[#1E1B1B] text-lg font-semibold my-auto">
          اضافه کردن کاربر جدید
        </div>
        <hr className="w-[87%] my-auto border-[#D9D9D9]" />
      </div>

      {/* ///////////////////////////////////////// */}
      <div className="grid grid-cols-2">
        <div className="mt-2">
          {(errors?.mobile || errors?.username) && (
            <div className="w-fit bg-[#FFF099] text-sm flex flex-row py-2 pr-14 pl-24 rounded-sm my-auto">
              <img
                src={WarningIcon}
                alt="آیکن هشدار"
                className="my-auto w-6 h-6"
              />

              <div
                style={{ direction: "rtl" }}
                className="my-auto mr-2 text-[#D76B00]"
              >
                لطفا تمام فیلد ها را به درستی پر کنید!
              </div>
            </div>
          )}
          {message !== "" && (
            <div className="w-fit bg-[#FFF099] text-sm flex flex-row  border border-[#D76B00] py-2 pr-14 pl-24 rounded-[8px] my-auto">
              <img
                src={WarningIcon}
                alt="آیکن هشدار"
                className="my-auto w-6 h-6"
              />

              <div
                style={{ direction: "rtl" }}
                className="my-auto mr-2 text-[#D76B00]"
              >
                {message}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-row-reverse w-full mx-auto my-10">
        <div className="w-3/4">
          <div>
            <div className="mb-2 text-[#221D23] text-lg text-right">
              نام کاربری
            </div>
            <input
              onChange={(e) => setValue("username", e.target.value)}
              {...register("username", registerOptions.username)}
              placeholder="نام کاربری خود را وارد کنید"
              className={`w-full mx-auto border  p-3 bg-[#F7F7F7] rounded-[8px] focus:outline-none focus:ring-0
                  ${
                    errors?.username
                      ? "border-[#A60014]"
                      : "border-transparent "
                  }
                  `}
            />
          </div>
          <div className="mt-6 flex flex-row justify-between ">
            <div className="w-[80%] ">
              <div className="mb-2 text-[#221D23] text-right text-lg ">
                شماره تماس
              </div>

              <input
                onChange={(e) => setValue("mobile", e.target.value)}
                {...register("mobile", registerOptions.mobile)}
                placeholder="شماره تماس خود را وارد کنید"
                className={`w-full mx-auto border p-3 bg-[#F7F7F7] rounded-[8px]  focus:outline-none focus:ring-0
                  ${errors?.mobile ? "border-[#A60014]" : "border-transparent"}
                  `}
              />
            </div>

            <button
              onClick={() => setShowConfirmBox(true)}
              disabled={!isValid || !isDirty}
              className="w-fit flex  items-center justify-ce nter px-9 py-1 mt-10 rounded-[50px] cursor-pointer
              bg-[#A60014] text-white disabled:cursor-not-allowed
              "
            >
              <img src={AddUser} className="w-6 h-6 ml-2" />
              افزودن کاربر
            </button>
          </div>
        </div>
        <div className="w-1/4 flex flex-col ">
          <div
            onClick={handleAddPhotoClick}
            className={`border  rounded-[10px]  w-[70%] h-[20.5vh] flex flex-col items-center justify-center cursor-pointer relative
              ${profileImage ? "border-transparent" : "border-[#919191]"}
              `}
          >
            {profileImage && (
              <div className="absolute bottom-0.5 left-0.5 bg-[#A60014] rounded-[10px] p-2">
                <img src={editIcn} className="w-6 h-6" />
              </div>
            )}
            <img
              src={profilePreview}
              className={`mx-auto  ${
                profilePreview.includes("add_a_photo")
                  ? ""
                  : " w-full h-full rounded-[10px]"
              } `}
            />

            {!profileImage && (
              <div className="text-[#919191] leading-[36px] text-center">
                افزودن تصویر
              </div>
            )}
          </div>

          <input
            type="file"
            accept="image/jpeg, image/png, image/jpg"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
      </div>

      <div className="rounded-[8px] p-8 mt-10">
        <div className="flex flex-row justify-between  w-full mb-10">
          <div className="text-[#1E1B1B] text-lg font-semibold my-auto">
            درخواست ها
          </div>
          <hr className="w-[92%] my-auto border-[#D9D9D9]" />
        </div>
        <div className="grid grid-cols-5 bg-[#F7F7F7]  text-[#919191] py-2 justify-center rounded-[4px]">
          <div className="text-center">گزینه</div>
          <div className="text-center flex flex-row justify-center items-center">
            <img src={usernameIcn} className="my-auto" />
            <span className="my-auto mr-2">نام کاربری</span>
          </div>
          <div className="text-center flex flex-row justify-center items-center">
            <img src={phoneIcn} className="my-auto" />
            <span className="my-auto mr-2">شماره تماس</span>
          </div>
          <div className="text-center flex flex-row justify-center items-center">
            <img src={calendarIcn} className="my-auto" />
            <span className="my-auto mr-2">تاریخ </span>
          </div>

          <div>
            {checkedRequests?.length !== 0 ? (
              <div className="text-center flex flex-row justify-center">
                <div
                  onClick={confirmRequestHandler}
                  className="w-1/2 bg-[#A60014] text-white  flex flex-row justify-center p-1 rounded-[50px] cursor-pointer"
                >
                  <img src={checkIcon} className="w-4 h-4 my-auto ml-2" />
                  تایید
                </div>
                <div
                  onClick={denyRequestHandler}
                  className="w-1/2 text-white bg-[#221D23] flex flex-row justify-center mx-2 p-1 rounded-[100px] cursor-pointer"
                >
                  <img src={closeIcon} className="w-4 h-4 my-auto ml-2" />
                  رد کردن
                </div>
              </div>
            ) : (
              <div className="text-center flex flex-row justify-center items-center">
                <img src={actionIcn} className="my-auto" />
                <span className="my-auto mr-2">عملیات </span>
              </div>
            )}
          </div>
        </div>
        <div className=" h-[28vh] overflow-y-auto">
          {requests?.length !== 0 ? (
            requests?.map((item) => {
              return (
                <div key={item.id}>
                  <RequestDetails
                    setRequests={setRequests}
                    id={item.id}
                    username={item.username}
                    mobile={item.mobile}
                    date={item.createdAt}
                    setCheckedRequests={setCheckedRequests}
                  />
                </div>
              );
            })
          ) : (
            <div className="pt-10 pb-12 px-20 w-fit mx-auto  mt-12">
              <img src={ErrIcon} className="w-24 h-24 mx-auto" />
              <div className="text-[#6D6F72] text-2xl">
                در حال حاضر درخواستی وجود ندارد .
              </div>
            </div>
          )}
        </div>
      </div>

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
      <div className={`${successMessage && " relative"} `}>
        {successMessage !== "" &&
          ReactDOM.createPortal(
            <div>
              <div
                className="w-full h-full bg-[#4c4c4c]   opacity-60 fixed top-0 left-0 z-20 "
                onClick={() => setSuccessMessage("")}
              />

              <div className="w-1/2 z-30 fixed justify-center h-fit mx-auto inset-x-0 my-auto inset-y-0 ">
                {_successBox}
              </div>
            </div>,

            document.getElementById("modal")
          )}
      </div>
    </div>
  );
};

export default CreateUser;
