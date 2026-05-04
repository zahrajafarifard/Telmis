import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import DatePicker from "react-datepicker2";

import errIcon from "../../../../assets/images/error2.svg";
import addIcon from "../../../../assets/images/Add_User.svg";
import calendarIcon from "../../../../assets/images/Calendar.svg";
import searchIcon2 from "../../../../assets/images/Search2.svg";
import titleIcon from "../../../../assets/images/device.svg";
import priceIcon from "../../../../assets/images/Ip.svg";
import statusIcon from "../../../../assets/images/status-download.svg";
import actionIcon from "../../../../assets/images/actions.svg";
import ReceiptDetails from "./receipt-details";
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
  }),
};

const Financial = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const _token = useSelector((state) => state.reducer.token);

  const [token, setToken] = useState("");
  const [totalItems, settTotalItems] = useState(0);
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [responseStatus, setResponseStatus] = useState(0);
  const [selectedExchange, setSelectedExchange] = useState(null);
  const [fetchedExchanges, setFetchedExchanges] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchPrice, setSearchPrice] = useState("");
  const [searchDateFrom, setSearchDateFrom] = useState(null);
  const [searchDateTo, setSearchDateTo] = useState(null);
  const [receipts, setReceipts] = useState([]);

  useEffect(() => {
    token &&
      location?.state?.id &&
      handleChange({
        value: location?.state?.id,
        label: location?.state?.username,
      });
  }, [token]);

  useEffect(() => {
    setToken(_token);
  }, [_token]);

  const handlePageChange = (page) => {
    if (page !== "...") {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    const _receipts = async () => {
      setResponseStatus(0);
      let _response, _data;

      const endpoint =
        searchTitle || searchPrice || searchDateFrom || searchDateTo
          ? `${process.env.REACT_APP_URL}/exchange/search-receipt`
          : `${process.env.REACT_APP_URL}/exchange/receipts/${selectedExchange?.value}`;

      const bodyData = {
        page: currentPage,
        pageSize: itemsPerPage,
        ...((searchTitle || searchPrice || searchDateFrom || searchDateTo) && {
          exchangeId: selectedExchange?.value,
        }),
        ...(searchTitle && { title: searchTitle }),
        ...(searchPrice && { price: searchPrice?.replace(/,/g, "") }),
        ...(searchDateFrom && { dateFrom: searchDateFrom }),
        ...(searchDateTo && { dateTo: searchDateTo }),
      };

      _response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(bodyData),
      });

      switch (_response.status) {
        case 200:
          _data = await _response.json();
          settTotalItems(_data?.data?.count || 0);
          setReceipts(_data?.data?.rows || []);
          setResponseStatus(200);
          break;

        case 404:
          setReceipts([]);
          settTotalItems(0);
          setResponseStatus(404);
          break;

        default:
          setReceipts([]);
          settTotalItems(0);
          setResponseStatus(500);

          break;
      }
    };
    selectedExchange?.value && token && _receipts();
  }, [
    token,
    currentPage,
    searchDateFrom,
    searchDateTo,
    searchPrice,
    searchTitle,
    selectedExchange?.value,
  ]);

  useEffect(() => {
    const _exchanges = async () => {
      const _response = await fetch(`${process.env.REACT_APP_URL}/exchange`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      switch (_response.status) {
        case 200:
          const data = await _response.json();
          setFetchedExchanges(data?.exchanges);
          break;

        default:
          break;
      }
    };

    token && _exchanges();
  }, [token, setFetchedExchanges]);

  const options = fetchedExchanges?.map((item) => ({
    value: item.id,
    label: item.username,
    name: item.name,
  }));

  const handleChange = async (option) => {
    setSelectedExchange(option);
  };

  const searchHandler = () => {
    setCurrentPage(1); // Reset to the first page when a new search item
  };

  return (
    <div className="w-[90%] mx-auto">
      <div className="flex flex-row justify-between  w-full my-8">
        <div className="text-[#1E1B1B] text-lg font-semibold my-auto">
          جست و جوی پیشرفته
        </div>
        <hr className="w-[88%] my-auto border-[#D9D9D9]" />
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="w-full">
          <div className="text-[#221D23] text-right mb-1 leading-[31px] ">
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

        <div className="w-full">
          <div className="text-[#221D23] text-right mb-1 leading-[31px] ">
            عنوان
          </div>
          <input
            placeholder="عنوان مورد نظر خود را وارد کنید"
            className="bg-[#F7F7F7] w-full p-4 rounded-[8px] focus:outline-none"
            value={searchTitle}
            onChange={(e) => {
              setSearchTitle(e.target.value);
            }}
          />
        </div>

        <div className="">
          <div className="text-[#221D23] text-right mb-1 leading-[31px] ">
            مبلغ کل
          </div>
          <input
            placeholder="مبلغ مورد نظر را وارد کنید"
            className="bg-[#F7F7F7] w-full p-4 rounded-[8px] focus:outline-none"
            // value={searchPrice}
            // onChange={(e) => {
            //   setSearchPrice(e.target.value);
            // }}
            value={Number(searchPrice.replace(/,/g, "") || 0).toLocaleString(
              "en-US"
            )}
            onChange={(e) => {
              const valueWithoutCommas = e.target.value.replace(/,/g, "");
              if (!isNaN(valueWithoutCommas)) {
                setSearchPrice(valueWithoutCommas);
              }
            }}
          />
        </div>
        <div className="">
          <div className="text-[#221D23] text-right mb-1 leading-[31px] ">
            از تاریخ
          </div>
          <div className="bg-[#F7F7F7] flex flex-row justify-between rounded-[8px]">
            <DatePicker
              isGregorian={false}
              timePicker={false}
              placeholder="تاریخ مورد نظر را وارد کنید"
              className="bg-[#F7F7F7] p-4 w-96 rounded-[8px] focus:outline-none "
              value={searchDateFrom}
              onChange={(value) => {
                setSearchDateFrom(value);
              }}
            />
            <img src={calendarIcon} className="ml-4" />
          </div>
        </div>
        <div className="">
          <div className="text-[#221D23] text-right mb-1 leading-[31px] ">
            تا تاریخ
          </div>

          <div className="bg-[#F7F7F7] w-full flex flex-row justify-between rounded-[8px]">
            <DatePicker
              isGregorian={false}
              timePicker={false}
              placeholder="تاریخ مورد نظر را وارد کنید"
              className="bg-[#F7F7F7] w-96 p-4 rounded-[8px] focus:outline-none"
              value={searchDateTo}
              onChange={(value) => {
                setSearchDateTo(value);
              }}
            />

            <img src={calendarIcon} className="ml-4" />
          </div>
        </div>
        <div className=" flex place-items-end">
          <div
            onClick={() => {
              searchHandler(
                searchTitle,
                searchPrice,
                searchDateFrom,
                searchDateTo
              );
            }}
            className="bg-[#A60014] rounded-[8px] w-14 h-14 flex justify-center"
          >
            <img
              src={searchIcon2}
              className="w-8 h-8  flex place-self-center"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-row justify-between  w-full my-10">
        <div className="text-[#1E1B1B] text-lg font-semibold my-auto">
          فاکتورها
        </div>
        <hr className="w-[76%] my-auto border-[#D9D9D9]" />

        <div
          onClick={() => navigate("/add-receipt")}
          className="my-auto bg-[#A60014] py-2  rounded-[50px] flex flex-row px-16 cursor-pointer"
        >
          <img src={addIcon} className="ml-2" />
          <span className="text-white whitespace-nowrap ">افزودن فاکتور</span>
        </div>
      </div>

      <div className="grid grid-cols-6 bg-[#F7F7F7]  text-[#919191] py-2 justify-center rounded-[4px]">
        <div className="text-center">ردیف</div>
        <div className="text-center flex flex-row-reverse justify-center items-center">
          <img src={titleIcon} className="my-auto" />
          <span className="my-auto ml-2">عنوان</span>
        </div>
        <div className="text-center flex flex-row-reverse justify-center items-center">
          <img src={calendarIcon} className="my-auto" />
          <span className="my-auto ml-2">تاریخ </span>
        </div>
        <div className="text-center flex flex-row-reverse justify-center items-center">
          <img src={priceIcon} className="my-auto" />
          <span className="my-auto ml-2">مبلغ کل </span>
        </div>
        <div className="text-center flex flex-row-reverse justify-center items-center">
          <img src={statusIcon} className="my-auto" />
          <span className="my-auto ml-2">وضعیت دانلود </span>
        </div>
        <div className="text-center flex flex-row-reverse justify-center items-center">
          <img src={actionIcon} className="my-auto" />
          <span className="my-auto ml-2">عملیات </span>
        </div>
      </div>

      <div>
        {selectedExchange ? (
          receipts && receipts?.length !== 0 ? (
            receipts?.map((item, index) => {
              return (
                <ReceiptDetails
                  key={item.id}
                  receipt={item}
                  index={index}
                  setReceipts={setReceipts}
                />
              );
            })
          ) : responseStatus === 404 ? (
            <div className=" w-fit mx-auto  pt-10 pb-12 px-20 mt-20">
              <div className="w-fit mx-auto mb-4">
                <img src={errIcon} className="w-24 h-24" />
              </div>
              <div className="text-[#6D6F72] text-2xl">
                هیچ فاکتوری پیدا نشد.
              </div>
            </div>
          ) : (
            <div className=" w-fit mx-auto  pt-10 pb-12 px-20 mt-20">
              <div className="w-fit mx-auto mb-4">
                <img src={errIcon} className="w-24 h-24" />
              </div>
              <div className="text-[#6D6F72] text-2xl">
                در حال حاضر فاکتوری برای نمایش وجود ندارد.
              </div>
            </div>
          )
        ) : (
          <div className=" w-fit mx-auto pt-10 pb-12 px-20 mt-20">
            <div className="w-fit mx-auto mb-4">
              <img src={errIcon} className="w-24 h-24" />
            </div>
            <div className="text-[#6D6F72] text-2xl">
              ابتدا یک کاربر انتخاب کنید
            </div>
          </div>
        )}

        <div className=" ">
          {receipts?.length !== 0 && (
            <Pagination
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              current={currentPage}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Financial;
