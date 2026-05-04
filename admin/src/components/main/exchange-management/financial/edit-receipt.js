import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import moment from "moment-jalaali";
import DatePicker from "react-datepicker2";
import WarningIcon from "../../../../assets/images/error.svg";
import modalImage from "../../../../assets/images/modalBack.png";
import CheckCircleIcon from "../../../../assets/images/Check_ring.svg";
import EditIcon from "../../../../assets/images/Edit-profile.svg";

const EditReceipt = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  const _id = location?.state?.id;
  const _token = useSelector((state) => state.reducer.token);

  const [token, setToken] = useState("");

  const [responseStatus, setResponseStatus] = useState(0);
  const [receiptInfo, setReceiptInfo] = useState({
    id: 0,
    title: "",
    date: moment(),
    price: 0,
    image: "",
    imagePreview: "",
    exchangId: 0,
    exchangName: 0,
  });

  useEffect(() => {
    setToken(_token);
  }, [_token]);

  useEffect(() => {
    const _fetchReceipt = async () => {
      let _response, _data;

      _response = await fetch(
        `${process.env.REACT_APP_URL}/exchange/receipt/${_id}`,
        {
          method: "GET",
          headers: { Authorization: "Bearer " + token },
        }
      );

      _data = await _response.json();

      setReceiptInfo({
        id: _id,
        title: _data?.data?.title,
        date: moment(_data?.data?.date),
        price: _data?.data?.price,
        image: _data?.data?.file,
        imagePreview: _data?.data?.imagePreview,
        exchangId: _data?.data?.ExchangeId,
        exchangName: _data?.data?.company,
      });
    };

    _id && token && _fetchReceipt();
  }, [_id, token, setReceiptInfo]);

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

  const editReceiptHandler = async () => {
    setResponseStatus(0);
    let _response;

    const formData = new FormData();

    formData.append("id", receiptInfo.id);
    formData.append("title", receiptInfo.title);
    formData.append("price", +receiptInfo?.price);
    formData.append("date", receiptInfo.date);
    formData.append("exchangeName", receiptInfo.exchangName);
    formData.append("exchangeId", receiptInfo.exchangId);
    formData.append("uploadingFiles", receiptInfo.image);

    _response = await fetch(
      `${process.env.REACT_APP_URL}/exchange/edit-receipt`,
      {
        method: "PATCH",
        headers: { Authorization: "Bearer " + token },
        body: formData,
      }
    );

    switch (_response.status) {
      case 201:
        setResponseStatus(201);
        break;
      case 404:
        setResponseStatus(404);
        break;
      case 500:
        setResponseStatus(500);
        break;

      default:
        setResponseStatus(500);

        break;
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setResponseStatus(0);
    }, 4000);

    return () => clearTimeout(timer);
  }, [responseStatus]);

  return (
    <div className="bg-white px-8 py-6 w-[90%] h-full mx-auto font-Peyda  text-[#1E1B1B] relative">
      <div className="flex flex-row justify-between  w-full mb-10">
        {responseStatus !== 201 && responseStatus !== 0 ? (
          <div className="w-1/3 bg-[#FFF099] text-sm flex flex-row  border border-[#D76B00] py-2 pr-14 pl-24 rounded-[8px] my-auto">
            <img
              src={WarningIcon}
              alt="آیکن هشدار"
              className="my-auto w-6 h-6"
            />

            <div
              style={{ direction: "rtl" }}
              className="my-auto mr-2 text-[#D76B00]"
            >
              ویرایش فاکتور با خطا مواجه شد
            </div>
          </div>
        ) : (
          <div className="text-[#1E1B1B] text-lg font-semibold my-auto">
            ویرایش فاکتور
          </div>
        )}
        <hr className="w-[87%] my-auto border-[#D9D9D9]" />
      </div>
      <div style={{ direction: "rtl" }} className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <input
            type="file"
            accept="image/jpeg, image/png, image/jpg"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageChange}
          />

          {receiptInfo?.imagePreview ? (
            <div className="relative">
              <div className=" bg-[#D6D6D6]  rounded-[10px] w-full h-full overflow-hidden flex justify-center items-center">
                <img
                  src={receiptInfo?.imagePreview}
                  className="w-1/2 h-[30vh] mx-auto object-contain  "
                />
              </div>

              <div
                onClick={handleAddPhotoClick}
                className="absolute bottom-0.5 left-0.5 bg-[#A60014] rounded-[10px] p-2 cursor-pointer"
              >
                <img src={EditIcon} className="w-6 h-6" />
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className=" bg-[#D6D6D6] rounded-[10px] w-full h-full overflow-hidden flex justify-center items-center">
                <img
                  src={`${process.env.REACT_APP_URL}/${receiptInfo?.image}`}
                  className="w-1/2 h-[30vh]  mx-auto object-contain   "
                />

                <div
                  onClick={handleAddPhotoClick}
                  className="absolute bottom-0.5 left-0.5 bg-[#A60014] rounded-[10px] p-2 cursor-pointer"
                >
                  <img src={EditIcon} className="w-6 h-6" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <div>
            <div className="text-right text-lg mb-1">عنوان</div>
            <input
              value={receiptInfo.title}
              onChange={(e) => {
                setReceiptInfo((prev) => ({
                  ...prev,
                  title: e.target.value,
                }));
              }}
              className="w-full rounded-[8px] px-3 p-4 bg-[#F7F7F7] text-[#919191] outline-none"
              placeholder="عنوان فاکتور را وارد کنید"
            />
          </div>
          <div className="my-3">
            <div className="text-right text-lg mb-1">تاریخ</div>

            <DatePicker
              isGregorian={false}
              timePicker={false}
              className="w-full rounded-[8px] px-3 p-4 bg-[#F7F7F7] text-[#919191] outline-none"
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
            <div className="text-right text-lg mb-1">مبلغ کل</div>
            <input
              value={Number(receiptInfo?.price).toLocaleString()}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/,/g, "");
                if (!isNaN(rawValue)) {
                  setReceiptInfo((prev) => ({
                    ...prev,
                    price: rawValue,
                  }));
                }
              }}
              className="w-full rounded-[8px] px-3 p-4 bg-[#F7F7F7] text-[#919191] outline-none"
              placeholder="مبلغ فاکتور را وارد کنید"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-row mt-10 place-items-center  w-[90%] mx-auto absolute bottom-16 left-0 inset-x-0">
        <button
          onClick={editReceiptHandler}
          className="bg-[#A60014] w-1/2 justify-center border border-transparent 
           text-white flex flex-row px-3 py-2 rounded-[50px] mx-auto "
        >
          بروزرسانی
        </button>
        <button
          onClick={() => navigate(-1)}
          className="border border-[#B71F26]  text-[#B71F26]  w-1/2 justify-center flex flex-row px-3 py-2 rounded-[50px]  mx-2 "
        >
          لغو
        </button>
      </div>

      <div className={`${responseStatus === 201 && " relative"} `}>
        {responseStatus === 201 &&
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
                  فاکتور با موفقیت بروزرسانی شد
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

export default EditReceipt;
