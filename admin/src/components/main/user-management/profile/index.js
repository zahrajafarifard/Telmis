import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import Select from "react-select";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import ProfileIcon from "../../../../assets/images/add_a_photo.svg";
import UpdateIcon from "../../../../assets/images/refresh.svg";
import LoginDetails from "./login-details";
import ErrIcon from "../../../../assets/images/error2.svg";
import WarningIcon from "../../../../assets/images/error.svg";
import deviceIcon from "../../../../assets/images/device.svg";
import calendarIcon from "../../../../assets/images/Calendar.svg";
import ipIcon from "../../../../assets/images/Ip.svg";
import editIcn from "../../../../assets/images/Edit-profile.svg";
import modalImage from "../../../../assets/images/modalBack.png";
import CheckCircleIcon from "../../../../assets/images/Check_ring.svg";
import Pagination from "../../../shared-component/pagination";

const Option = (props) => {
  const { isSelected, label, innerRef, innerProps, data, selectProps } = props;

  return (
    <div
      ref={innerRef}
      {...innerProps}
      style={{
        padding: "8px 25px",
        textAlign: "right",
        outlineColor: "#f00",
      }}
    >
      <label
        className={`${
          isSelected ? "text-[#221D23] font-semibold" : "text-[#6D6F72]  "
        }`}
      >
        {label}
      </label>
    </div>
  );
};

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    padding: "10px 0px",
    borderRadius: "10px",
    border: "transparent",
    backgroundColor: "#FAF5F5",
  }),

  placeholder: (provided) => ({
    ...provided,
    textAlign: "right",
  }),

  menu: (provided) => ({
    ...provided,
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.18)",

    margin: "10px 0",
  }),
  option: (provided, state) => ({
    ...provided,
    // borderBottom: state.isLastOption ? "none" : "1px solid #ccc",
  }),
};

const Profile = () => {
  const location = useLocation();
  const _token = useSelector((state) => state.reducer.token);
  const [token, setToken] = useState("");

  const {
    register,
    setValue,
    getValues,
    formState: { errors, isDirty, isValid, dirtyFields },
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

  const [reload, setReload] = useState(false);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [loginHistory, setLoginHistory] = useState([]);
  const [profilePreview, setProfilePreview] = useState(ProfileIcon);
  const [profileImage, setProfileImage] = useState();
  const fileInputRef = useRef(null);
  const [selectedExchange, setSelectedExchange] = useState(null);
  const [exchangeName, setExchangeName] = useState("");
  const [fetchedExchanges, setFetchedExchanges] = useState([]);
  const [totalItems, settTotalItems] = useState(0);
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = async (page) => {
    if (page !== "...") {
      setCurrentPage(page);
    }

    let _response, _data;

    _response = await fetch(
      `${process.env.REACT_APP_URL}/exchange/getExchangeWithLoginHistory/${selectedExchange?.value}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ page: page, pageSize: itemsPerPage }),
      }
    );

    switch (_response.status) {
      case 200:
        _data = await _response.json();

        setLoginHistory(_data?.history?.rows);
        settTotalItems(_data?.history?.count || 0);

        break;

      default:
        break;
    }
  };

  useEffect(() => {
    token &&
      location?.state?.id &&
      handleChange({
        value: location?.state?.id,
        label: location?.state?.username,
      });
  }, [token]);

  useEffect(() => {
    return () => {
      setProfilePreview(ProfileIcon);
    };
  }, [selectedExchange]);

  useEffect(() => {
    setToken(_token);
  }, [_token]);

  const options = fetchedExchanges?.map((item) => ({
    value: item?.id,
    label: item?.username,
  }));

  const handleChange = async (option) => {
    let _response, _data;
    setSelectedExchange(option);
    _response = await fetch(
      `${process.env.REACT_APP_URL}/exchange/getExchangeWithLoginHistory/${option.value}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ page: currentPage, pageSize: itemsPerPage }),
      }
    );

    switch (_response.status) {
      case 200:
        _data = await _response.json();

        setExchangeName(_data?.data?.name);
        setValue("username", _data?.data?.username);
        setValue("mobile", _data?.data?.mobile);
        setLoginHistory(_data?.history?.rows);
        settTotalItems(_data?.history?.count || 0);

        _data?.data?.image !== null &&
          _data?.data?.image &&
          setProfilePreview(
            `${process.env.REACT_APP_URL}/uploadedFiles/${
              _data?.data?.name
            }/profile/${_data?.data?.image?.split(/[\/\\]/).pop()}`
          );
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    setReload(false);

    const _exchanges = async () => {
      const response = await fetch(`${process.env.REACT_APP_URL}/exchange`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      switch (response.status) {
        case 200:
          const data = await response.json();

          setFetchedExchanges(data?.exchanges);

          break;

        default:
          break;
      }
    };

    token && _exchanges();
  }, [setFetchedExchanges, reload, token]);

  useEffect(() => {
    if (profileImage != undefined) {
      uploadImageHandler();
    }
  }, [profileImage]);

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);

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

  const updateExchangeHandler = async () => {
    let _response;

    _response = await fetch(
      `${process.env.REACT_APP_URL}/exchange/adminUpdateExchange`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          exchangeId: selectedExchange?.value,
          username: getValues("username"),
          mobile: getValues("mobile"),
        }),
      }
    );
    setReload(true);
    switch (_response.status) {
      case 200:
        setValue("username", "");
        setValue("mobile", "");
        setProfilePreview(ProfileIcon);
        setSelectedExchange("");
        break;
      case 404:
        break;
      case 500:
        break;

      default:
        break;
    }
  };

  const uploadImageHandler = async () => {
    let _response;

    const formData = new FormData();
    formData.append("changedBy", "admin");
    formData.append("exchangeName", exchangeName);
    formData.append("exchangeId", selectedExchange?.value);
    formData.append("uploadingFiles", profileImage);

    _response = await fetch(
      `${process.env.REACT_APP_URL}/exchange/uploadImage`,
      {
        method: "PATCH",
        headers: {
          Authorization: "Bearer " + token,
        },
        body: formData,
      }
    );

    switch (_response.status) {
      case 200:
        break;

      case 404:
        break;

      case 500:
        break;

      default:
        break;
    }
  };

  const _confirmUpdateMobileBox = (
    <div
      style={{
        background: `url(${modalImage})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
      className="w-full text-white  mx-auto text-center  px-8 py-14 font-Peyda rounded-[15px]"
    >
      <img src={CheckCircleIcon} className="mx-auto w-20 h-20 mb-3" />
      <div style={{ direction: "rtl" }} className="w-full mx-auto text-xl">
        شما در حال تغییر شماره موبایل این کاربر هستید.
      </div>
      <div style={{ direction: "rtl" }} className="w-full mx-auto text-xl">
        شماره موبایل جدید به شماره کاربر پیامک خواهد شد.
      </div>

      <div className="flex flex-row-reverse justify-center mt-6">
        <div
          onClick={() => {
            setShowMobileModal(false);
            updateExchangeHandler();
          }}
          className="text-[#221D23] bg-[#FFDA8A] w-1/3 py-2 rounded-[50px] ml-1 cursor-pointer text-lg"
        >
          ادامه
        </div>
        <div
          onClick={() => {
            setShowMobileModal(false);
          }}
          className="text-[#919191] bg-white w-1/3 py-2 rounded-[50px] mr-1 cursor-pointer text-lg"
        >
          لغو
        </div>
      </div>
    </div>
  );
  const _confirmUpdateUsernameBox = (
    <div
      style={{
        background: `url(${modalImage})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
      className="w-full text-white  mx-auto text-center  px-8 py-14 font-Peyda rounded-[15px]"
    >
      <img src={CheckCircleIcon} className="mx-auto w-20 h-20 mb-3" />
      <div style={{ direction: "rtl" }} className="w-full mx-auto text-xl">
        شما در حال تغییر نام کاربری این کاربر هستید.
      </div>
      <div style={{ direction: "rtl" }} className="w-full mx-auto text-xl">
        نام کاربری جدید به شماره کاربر پیامک خواهد شد.
      </div>

      <div className="flex flex-row-reverse justify-center mt-6">
        <div
          onClick={() => {
            setShowUsernameModal(false);
            updateExchangeHandler();
          }}
          className="text-[#221D23] bg-[#FFDA8A] w-1/3 py-2 rounded-[50px] ml-1 cursor-pointer text-lg"
        >
          ادامه
        </div>
        <div
          onClick={() => {
            setShowUsernameModal(false);
          }}
          className="text-[#919191] bg-white w-1/3 py-2 rounded-[50px] mr-1 cursor-pointer text-lg"
        >
          لغو
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-[90%] my-8 mx-auto text-[#6D6F72]">
      <div className="flex flex-row justify-between  w-full">
        <div className="text-[#1E1B1B] text-lg font-semibold my-auto">
          اطلاعات کاربری
        </div>
        <hr className="w-[91%] my-auto border-[#D9D9D9]" />
      </div>

      <div className="mb-6  pb-10  ">
        <div className="grid grid-cols-2 mb-8 mt-2">
          {(errors?.mobile || errors?.username) && (
            <div className="w-fit text-[#434242] text-sm flex flex-row  bg-[#FFF099] py-2 pr-14 pl-24  rounded-sm my-auto">
              <img
                src={WarningIcon}
                alt="آیکن هشدار"
                className="my-auto w-6 h-6"
              />

              <div
                style={{ direction: "rtl" }}
                className="my-auto mr-2 text-[#D76B00]"
              >
                لطفا تمامی فیلد هارو به درستی پر کنید
              </div>
            </div>
          )}
        </div>
        <div className=" flex flex-row-reverse">
          <div className=" w-2/3">
            <div className="mb-4">
              <div className="text-[#221D23] text-right text-lg mb-2">
                نام کاربر
              </div>
              <div className="w-full  rounded-md">
                <Select
                  defaultValue={selectedExchange}
                  onChange={handleChange}
                  options={options}
                  value={selectedExchange}
                  styles={customStyles}
                  components={{ Option }}
                  placeholder="نام کاربر را انتخاب کنید"
                />
              </div>
            </div>

            <div className="mt-4 w-[100%] mx-auto">
              <div className="text-[#221D23] text-right  mb-1">نام کاربری</div>
              <div className="flex flex-row justify-between">
                <input
                  dir="rtl"
                  placeholder="نام کاربری  را وارد کنید"
                  onChange={(e) => setValue("username", e.target.value)}
                  {...register("username", registerOptions.username)}
                  className="w-[92%] py-3 px-3 rounded-[8px] bg-[#f7f7f7] text-[#919191] text focus:outline-none focus:ring-0"
                />
                <div
                  onClick={() => {
                    dirtyFields.username && setShowUsernameModal(true);
                  }}
                  className={` w-14 h-14 rounded-full mr-2 text-white 
                   flex flex-row place-content-center px-2 
                   ${
                     !getValues("username") ||
                     errors?.username ||
                     !selectedExchange?.value
                       ? "bg-[#D9D9D9] cursor-not-allowed"
                       : "bg-[#A60014] cursor-pointer"
                   }
                   `}
                >
                  <img
                    src={UpdateIcon}
                    className={`w-7 h-7 my-auto ${
                      (getValues("username") ||
                        errors?.username !== undefined) &&
                      "brightness-0 invert"
                    } `}
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 w-[100%] mx-auto ">
              <div className="text-[#221D23] text-right  mb-1">شماره تماس</div>
              <div className="flex flex-row justify-between ">
                <input
                  placeholder="شماره تماس  را وارد کنید"
                  dir="rtl"
                  onChange={(e) => setValue("mobile", e.target.value)}
                  {...register("mobile", registerOptions.mobile)}
                  className=" w-[92%]  py-3 px-3 rounded-[8px] bg-[#f7f7f7] text-[#919191] focus:outline-none focus:ring-0"
                />
                <div
                  onClick={() => {
                    dirtyFields.mobile && setShowMobileModal(true);
                  }}
                  className={` w-14 h-14 rounded-full mr-2
                     flex flex-row place-content-center px-2 
                     ${
                       !getValues("mobile") ||
                       errors?.mobile ||
                       !selectedExchange?.value
                         ? "bg-[#D9D9D9] cursor-not-allowed"
                         : "bg-[#A60014] cursor-pointer"
                     }
                   `}
                >
                  <img
                    src={UpdateIcon}
                    className={`w-7 h-7 my-auto ${
                      (getValues("username") ||
                        errors?.username !== undefined) &&
                      "brightness-0 invert"
                    } `}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-1/3 flex flex-col ">
            <div
              onClick={handleAddPhotoClick}
              className={`w-[80%] h-[28.5vh] my-auto border rounded-[10px] flex flex-col justify-center items-center relative cursor-pointer
                 ${
                   !profilePreview.includes("add_a_photo")
                     ? "border-transparent"
                     : "border-[#919191]"
                 }
                `}
            >
              {!profilePreview.includes("add_a_photo") && (
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

              {(!profilePreview || profilePreview.includes("add_a_photo")) && (
                <div className="text-[#919191] leading-[36px] text-center">
                  افزودن تصویر
                </div>
              )}

              <input
                type="file"
                accept="image/jpeg, image/png, image/jpg"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto rounded-sm">
        <div className="flex flex-row justify-between  w-full pb-10">
          <div className="text-[#1E1B1B] text-lg font-semibold my-auto">
            تاریخچه ورود ها
          </div>
          <hr className="w-[90%] my-auto border-[#D9D9D9]" />
        </div>

        <div
          style={{ direction: "rtl" }}
          className="grid grid-cols-5 bg-[#F7F7F7]  w-[90%] mx-auto py-2 rounded-[4px] text-sm text-[#919191]"
        >
          <div className="my-auto mx-auto">ردیف</div>
          <div className="my-auto mx-auto flex flex-row ">
            <img src={deviceIcon} className="w-5 h-5" />
            <span className="mr-2">دستگاه</span>
          </div>
          <div className="my-auto mx-auto flex flex-row ">
            <img src={calendarIcon} className="w-5 h-5" />
            <span className="mr-2">تاریخ</span>
          </div>
          <div className="my-auto mx-auto flex flex-row ">
            <img src={ipIcon} className="w-5 h-5" />
            <span className="mr-2">آدرس IP</span>
          </div>

          <div></div>
        </div>
        <div className=" w-[90%] mx-auto ">
          {selectedExchange ? (
            loginHistory?.length !== 0 ? (
              loginHistory?.map((item, index) => {
                return <LoginDetails item={item} key={item.id} index={index} />;
              })
            ) : (
              <div className="pt-10 pb-12 px-20 w-fit mx-auto  mt-12">
                <img src={ErrIcon} className="w-24 h-24 mx-auto" />
                <div className="text-[#6D6F72] text-2xl">
                  هیچ تاریخچه ورودی وجود ندارد .
                </div>
              </div>
            )
          ) : (
            <div className="pt-10 pb-12 px-20 w-fit mx-auto  mt-12">
              <img src={ErrIcon} className="w-24 h-24 mx-auto" />
              <div className="text-[#6D6F72] text-2xl">
                ابتدا یک کاربر انتخاب کنید
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="">
        {loginHistory?.length !== 0 && (
          <Pagination
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            current={currentPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      <div className={`${showUsernameModal && " relative "} `}>
        {showUsernameModal &&
          ReactDOM.createPortal(
            <>
              <div
                className="w-full h-full bg-[#4c4c4c]   opacity-60 fixed top-0 left-0 z-20 "
                onClick={() => {
                  setShowUsernameModal(false);
                }}
              />

              <div className="z-30 fixed justify-center h-fit mx-auto inset-x-0 my-auto inset-y-0  font-Peyda  w-[35%]">
                {_confirmUpdateUsernameBox}
              </div>
            </>,

            document.getElementById("modal")
          )}
      </div>

      <div className={`${showMobileModal && " relative "} `}>
        {showMobileModal &&
          ReactDOM.createPortal(
            <>
              <div
                className="w-full h-full bg-[#4c4c4c]   opacity-60 fixed top-0 left-0 z-20 "
                onClick={() => {
                  setShowMobileModal(false);
                }}
              />

              <div className="z-30 fixed justify-center h-fit mx-auto inset-x-0 my-auto inset-y-0  font-Peyda  w-[35%]">
                {_confirmUpdateMobileBox}
              </div>
            </>,

            document.getElementById("modal")
          )}
      </div>
    </div>
  );
};

export default Profile;
