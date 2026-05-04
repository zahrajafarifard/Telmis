import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import DatePicker from "react-datepicker2";
import Select from "react-select";
import modalImage from "../../../../assets/images/modalBack.png";
import CheckCircleIcon from "../../../../assets/images/Check_ring.svg";
import moment from "moment-jalaali";
import WarningIcon from "../../../../assets/images/error.svg";
import addPhoto2 from "../../../../assets/images/add_a_photo.svg";
import addReceiptIcon from "../../../../assets/images/Add_User.svg";
import EditIcon from "../../../../assets/images/Edit-profile.svg";
import Spinner from "../../../shared-component/spinner";

const Option = (props) => {
  const { isSelected, label, innerRef, innerProps, data, selectProps } = props;

  return (
    <div
      ref={innerRef}
      {...innerProps}
      style={{
        padding: "8px 25px",
        textAlign: "right",
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

const AddNewReceipt = () => {
  const navigate = useNavigate();
  const _token = useSelector((state) => state.reducer.token);
  const [token, setToken] = useState("");
  const [selectedExchange, setSelectedExchange] = useState(null);
  const [fetchedExchanges, setFetchedExchanges] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [responseStatus, setResponseStatus] = useState(0);

  useEffect(() => {
    setToken(_token);
  }, [_token]);

  const fileInputRef = useRef(null);

  const [receiptInfo, setReceiptInfo] = useState({
    title: "",
    date: moment(),
    price: "",
    image: "",
    imagePreview: "",
  });

  useEffect(() => {
    const _exchanges = async () => {
      const response = await fetch(`${process.env.REACT_APP_URL}/exchange`, {
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
  }, [token, setFetchedExchanges]);
  const handleChange = async (option) => {
    setSelectedExchange(option);
  };

  const options = fetchedExchanges?.map((item) => ({
    value: item.id,
    label: item.username,
    name: item.name,
  }));

  const handleAddPhotoClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    setReceiptInfo((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));

    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setReceiptInfo((prev) => ({
          ...prev,
          imagePreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addReceiptHandler = async () => {
    let _response;

    setResponseStatus(0);
    setUploading(true);

    const formData = new FormData();

    formData.append("title", receiptInfo?.title);
    formData.append("price", receiptInfo?.price?.replace(/,/g, ""));
    formData.append("date", receiptInfo?.date);
    formData.append("exchangeId", selectedExchange?.value);
    formData.append("uploadingFiles", receiptInfo?.image);

    _response = await fetch(
      `${process.env.REACT_APP_URL}/exchange/add-receipt`,
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
        setUploading(false);
        setResponseStatus(200);
        break;

      case 404:
        break;
      case 500:
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setResponseStatus(0);
    }, 4000);

    return () => clearTimeout(timer);
  }, [responseStatus]);

  if (uploading) {
    return <Spinner />;
  }
  return (
    <div className="w-[90%] mx-auto  text-[#221D23] ">
      <div className="flex flex-row justify-between  w-full mb-10">
        {responseStatus !== 200 && responseStatus !== 0 ? (
          <div className="w-[40%] bg-[#FFF099] text-sm flex flex-row  border border-[#D76B00] py-2 pr-14 pl-24 rounded-[8px] my-auto">
            <img
              src={WarningIcon}
              alt="آیکن هشدار"
              className="my-auto w-6 h-6"
            />

            <div
              style={{ direction: "rtl" }}
              className="my-auto mr-2 text-[#D76B00]"
            >
              اضافه کردن فاکتور جدید با خطا مواجه شد
            </div>
          </div>
        ) : (
          <div className="text-[#1E1B1B] text-lg font-semibold my-auto">
            اضافه کردن فاکتور جدید
          </div>
        )}
        <hr className="w-[87%] my-auto border-[#D9D9D9]" />
      </div>

      <div style={{ direction: "rtl" }} className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <div
            className={`relative  rounded-[10px] 
            ${receiptInfo.imagePreview !== "" && "bg-[#D6D6D6]"}
            
            `}
          >
            {receiptInfo.imagePreview !== "" && (
              <div
                onClick={handleAddPhotoClick}
                className="absolute bottom-0.5 left-0.5 bg-[#A60014] rounded-[10px] p-2 cursor-pointer"
              >
                <img src={EditIcon} className="w-6 h-6" />
              </div>
            )}

            <input
              type="file"
              accept="image/jpeg, image/png, image/jpg"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
            />

            {receiptInfo.imagePreview ? (
              <div className="rounded-[10px] w-full h-full overflow-hidden flex justify-center items-center ">
                <img
                  src={receiptInfo.imagePreview}
                  className="w-4/5 h-[43.4vh] mx-auto object-contain  "
                />
              </div>
            ) : (
              <div
                onClick={handleAddPhotoClick}
                className="w-full h-[43.4vh] border border-[#919191] rounded-[10px] flex flex-col items-center justify-center cursor-pointer"
              >
                <img src={addPhoto2} className="w-20 h-16 " />
                <div className="text-[#919191] mt-2 "> افزودن تصویر فاکتور</div>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="w-full mb-5">
            <div className="text-[#221D23] text-right mb-1 leading-[31px] text-lg">
              نام کاربر
            </div>
            <Select
              defaultValue={selectedExchange}
              onChange={handleChange}
              options={options}
              value={selectedExchange}
              hideSelectedOptions={false}
              styles={customStyles}
              components={{ Option }}
              placeholder="نام کاربر را انتخاب کنید"
            />
          </div>
          <div>
            <div className="text-lg mb-1 text-right">عنوان</div>
            <input
              value={receiptInfo.title}
              onChange={(e) => {
                setReceiptInfo((prev) => ({
                  ...prev,
                  title: e.target.value,
                }));
              }}
              className="text-[#919191] bg-[#F7F7F7] w-full rounded-[8px] px-3 p-4 outline-none"
              placeholder="عنوان فاکتور را وارد کنید"
            />
          </div>
          <div className="my-5">
            <div className="text-lg mb-1 text-right">تاریخ</div>

            <DatePicker
              isGregorian={false}
              timePicker={false}
              className="text-[#919191] bg-[#F7F7F7] w-full rounded-[8px] px-3 p-4 outline-none"
              value={receiptInfo.date}
              onChange={(value) => {
                setReceiptInfo((prev) => ({
                  ...prev,
                  date: value,
                }));
              }}
            />
          </div>
          <div>
            <div className="text-lg mb-1 text-right">مبلغ کل</div>
            <input
              value={Number(
                receiptInfo.price.replace(/,/g, "") || 0
              ).toLocaleString()}
              onChange={(e) => {
                const valueWithoutCommas = e.target.value.replace(/,/g, "");
                if (!isNaN(valueWithoutCommas)) {
                  setReceiptInfo((prev) => ({
                    ...prev,
                    price: valueWithoutCommas,
                  }));
                }
              }}
              className="text-[#919191] bg-[#F7F7F7] w-full rounded-[8px] px-3 p-4 outline-none"
              placeholder="مبلغ فاکتور را وارد کنید"
            />
          </div>
        </div>
      </div>

      <div className="w-[70%]  mx-auto flex flex-row absolute bottom-10">
        <button
          disabled={
            !selectedExchange?.value ||
            !receiptInfo?.imagePreview ||
            !receiptInfo?.title ||
            !receiptInfo?.price ||
            !receiptInfo?.date
          }
          onClick={addReceiptHandler}
          className="bg-[#A60014] text-white flex flex-row px-3 py-2 rounded-[50px] w-1/2 mx-auto text-center justify-center
          disabled:bg-[#AFAFAF] disabled:text-white
          "
        >
          <img src={addReceiptIcon} className="my-auto ml-2" />
          <span className="my-auto"> افزودن فاکتور</span>
        </button>
        <button
          onClick={() => {
            navigate(-1);
          }}
          className="border border-[#B71F26]  text-[#B71F26]  w-1/2 justify-center flex flex-row px-3 py-2 rounded-[50px] mx-2 "
        >
          لغو
        </button>
      </div>

      <div className={`${responseStatus === 200 && " relative"} `}>
        {responseStatus === 200 &&
          ReactDOM.createPortal(
            <div>
              <div
                className="w-full h-full bg-[#4c4c4c]   opacity-60 fixed top-0 left-0 z-20 "
                onClick={() => setResponseStatus(0)}
              />

              <div
                style={{
                  background: `url(${modalImage})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
                className="font-Peyda rounded-[15px] py-10 px-20 w-1/3 z-30 fixed justify-center h-fit mx-auto inset-x-0 my-auto inset-y-0"
              >
                <div className=" w-full mx-auto">
                  <img src={CheckCircleIcon} className=" w-20 h-20 mx-auto" />
                </div>
                <div className="text-xl text-white mx-auto w-fit pt-3 mb-7">
                  فاکتور با موفقیت اضافه شد
                </div>

                <div
                  onClick={() => {
                    setResponseStatus(0);
                    navigate(-1);
                  }}
                  className="bg-[#FFDA8A] text-[#221D23] text-center text-lg py-2 rounded-[50px] cursor-pointer w-44 mx-auto"
                >
                  بازگشت به فاکتورها
                </div>
              </div>
            </div>,

            document.getElementById("modal")
          )}
      </div>
    </div>
  );
};

export default AddNewReceipt;
