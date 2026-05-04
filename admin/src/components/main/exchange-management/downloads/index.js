import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Select from "react-select";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import DatePicker from "react-datepicker2";

import FileDetails from "./file-details";
import errIcon from "../../../../assets/images/error2.svg";
import addIcon from "../../../../assets/images/Add_User.svg";
import calendarIcon from "../../../../assets/images/Calendar.svg";
import CheckCircleIcon from "../../../../assets/images/Check_ring.svg";
import searchIcon from "../../../../assets/images/search.svg";
import userIcon from "../../../../assets/images/Ip.svg";
import statusIcon from "../../../../assets/images/status-download.svg";
import actionIcon from "../../../../assets/images/actions.svg";
import titleIcon from "../../../../assets/images/device.svg";
import versionIcon from "../../../../assets/images/version.svg";
import Pagination from "../../../shared-component/pagination";

const Option = (props) => {
  const { isSelected, label, innerRef, innerProps, data, selectProps } = props;

  return (
    <div
      ref={innerRef}
      {...innerProps}
      style={{
        padding: "6px",
        textAlign: "right",
      }}
    >
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => null}
        style={{ accentColor: "#B71F26", margin: "10px" }}
      />
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
    margin: "10px 0",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.18)",
  }),
  option: (provided, state) => ({
    ...provided,
    // borderBottom: state.isLastOption ? "none" : "1px solid #ccc",
  }),
};

const Downloads = () => {
  const navigate = useNavigate();
  const _token = useSelector((state) => state.reducer.token);
  const [token, setToken] = useState("");

  const [totalItems, settTotalItems] = useState(0);
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [downloads, setDownloads] = useState([]);
  const [showConfirmBox, setShowConfirmBox] = useState(false);
  const [responseStatus, setResponseStatus] = useState(0);
  const [showFileType, setShowFileType] = useState(false);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchVersion, setSearchVersion] = useState("");
  const [searchFileType, setSearchFileType] = useState(
    "نوع فایل را انتخاب کنید"
  );
  const [searchDateFrom, setSearchDateFrom] = useState(null);
  const [searchDateTo, setSearchDateTo] = useState(null);

  const [selectedExchange, setSelectedExchange] = useState([]);
  const [fetchedExchanges, setFetchedExchanges] = useState([]);

  useEffect(() => {
    setToken(_token);
  }, [_token]);

  const handlePageChange = async (page) => {
    if (page !== "...") {
      setCurrentPage(page);
      setResponseStatus(0);
      let _response, _data;

      const selectedExchanges = selectedExchange
        .filter((item) => item.value !== "*")
        .map((item) => item.value);

      _response = await fetch(
        `${process.env.REACT_APP_URL}/exchange/search-file`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            dateFrom: searchDateFrom,
            dateTo: searchDateTo,
            version: searchVersion,
            title: searchTitle,
            fileType: searchFileType,
            exchangeId: selectedExchanges,
            page: page,
            pageSize: itemsPerPage,
          }),
        }
      );

      switch (_response.status) {
        case 200:
          _data = await _response.json();
          settTotalItems(_data?.data?.count);
          setDownloads(_data?.data?.rows);
          setResponseStatus(200);
          break;

        case 400:
          setResponseStatus(400);
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
    }
  };

  useEffect(() => {
    const _fetchDownloads = async () => {
      let _response, _data;
      _response = await fetch(
        `${process.env.REACT_APP_URL}/exchange/downloads`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            page: currentPage,
            pageSize: itemsPerPage,
          }),
        }
      );

      switch (_response.status) {
        case 200:
          _data = await _response.json();
          settTotalItems(_data?.data?.count);
          setDownloads(_data?.data?.rows);
          break;

        default:
          break;
      }
    };

    token &&
      !searchDateFrom &&
      !searchDateTo &&
      !searchVersion &&
      !searchTitle &&
      searchFileType == "نوع فایل را انتخاب کنید" &&
      _fetchDownloads();
  }, [
    token,

    setDownloads,
    currentPage,
    itemsPerPage,
    settTotalItems,
    setCurrentPage,
  ]);

  const searchHandler = async (dateFrom, dateTo, version, title, fileType) => {
    setCurrentPage(1);
    setResponseStatus(0);
    let _response, _data;

    const selectedExchanges = selectedExchange
      .filter((item) => item.value !== "*")
      .map((item) => item.value);

console.log('selectedExchanges' ,selectedExchanges);



    _response = await fetch(
      `${process.env.REACT_APP_URL}/exchange/search-file`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          dateFrom,
          dateTo,
          version,
          title,
          fileType,
          exchangeId: selectedExchanges,
          page: currentPage,
          pageSize: itemsPerPage,
        }),
      }
    );

    setSearchDateFrom(null);
    setSearchDateTo(null);

    switch (_response.status) {
      case 200:
        _data = await _response.json();
        settTotalItems(_data?.data?.count);
        setDownloads(_data?.data?.rows);
        setResponseStatus(200);
        break;

      case 400:
        setResponseStatus(400);
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

  const selectAllOption = { value: "*", label: "همه" };

  const options = [
    selectAllOption,
    ...fetchedExchanges?.map((item) => ({
      value: item?.id,
      label: item?.username,
    })),
  ];

  const handleChange = (selectedOptions) => {
    if (selectedOptions.some((option) => option.value === "*")) {
      if (selectedOptions.length === options.length) {
        setSelectedExchange([]);
      } else {
        setSelectedExchange(options);
      }
    } else {
      setSelectedExchange(selectedOptions);
    }
  };

  return (
    <div className="w-[90%] mx-auto my-8">
      <div className="flex flex-row justify-between  w-full mb-8">
        <div className="text-[#1E1B1B] text-lg font-semibold my-auto">
          جست و جوی پیشرفته
        </div>
        <hr className="w-[87%] my-auto border-[#D9D9D9]" />
      </div>

      <div className="w-full mx-auto  grid grid-cols-4">
        <div className="w-[95%]">
          <div className="text-[#221D23] text-right mb-1 leading-[31px] ">
            نوع کاربر
          </div>
          <Select
            onChange={handleChange}
            options={options}
            value={selectedExchange}
            isMulti
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            styles={customStyles}
            components={{ Option }}
            placeholder="نام کاربر را انتخاب کنید"
          />
        </div>

        <div className="w-[95%]">
          <div className="text-[#221D23] text-right mb-1 leading-[31px] ">
            از تاریخ
          </div>
          <div className="bg-[#F7F7F7] flex flex-row justify-between rounded-[8px]">
            <DatePicker
              isGregorian={false}
              timePicker={false}
              placeholder="تاریخ مورد نظر را وارد کنید"
              className="bg-[#F7F7F7] p-4 w-64 rounded-[8px] focus:outline-none "
              value={searchDateFrom}
              onChange={(value) => {
                setSearchDateFrom(value);
              }}
            />
            <img src={calendarIcon} className="ml-4" />
          </div>
        </div>
        <div className="w-[95%]">
          <div className="text-[#221D23] text-right mb-1 leading-[31px] ">
            تا تاریخ
          </div>

          <div className="bg-[#F7F7F7] w-full flex flex-row justify-between rounded-[8px]">
            <DatePicker
              isGregorian={false}
              timePicker={false}
              placeholder="تاریخ مورد نظر را وارد کنید"
              className="bg-[#F7F7F7] w-64 p-4 rounded-[8px] focus:outline-none"
              value={searchDateTo}
              onChange={(value) => {
                setSearchDateTo(value);
              }}
            />

            <img src={calendarIcon} className="ml-4" />
          </div>
        </div>

        <div className="w-[95%]">
          <div className="text-[#221D23] text-right mb-1 leading-[31px] ">
            نسخه
          </div>
          <input
            placeholder="نسخه مورد نظر خود را وارد کنید"
            className="bg-[#F7F7F7] w-full p-4 rounded-[8px] focus:outline-none"
            value={searchVersion}
            onChange={(e) => {
              setSearchVersion(e.target.value);
            }}
          />
        </div>

        <div className="w-[95%]">
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
        <div className="w-[95%] relative">
          <div className="text-[#221D23] text-right mb-1 leading-[31px] ">
            نوع
          </div>
          <div
            onClick={() => {
              setShowFileType((prev) => !prev);
            }}
          >
            <input
              className="bg-[#F7F7F7] w-full p-4 rounded-[8px] focus:outline-none"
              value={searchFileType}
              onChange={(e) => {
                setSearchFileType(e.target.value);
              }}
            />
          </div>

          {showFileType && (
            <>
              <div
                onClick={() => {
                  setShowFileType((prev) => !prev);
                }}
                className="fixed h-screen w-screen top-0 left-0 z-0"
              />

              <div className="shadow-[-4px_3px_10px_1px_rgba(0,0,0,0.19)] rounded-[8px] w-full mt-3 bg-white z-20 absolute py-2">
                <div className="my-1 flex px-4  py-2">
                  <input
                    type="radio"
                    name="options"
                    value="عمومی"
                    className="accent-[#B71F26] my-auto"
                    checked={searchFileType === "عمومی"}
                    onChange={(e) => {
                      setSearchFileType(e.target.value);
                      setShowFileType((prev) => !prev);
                    }}
                  ></input>
                  <div className="my-auto mx-3 text-[#221D23]">عمومی</div>
                </div>

                <div className="my-1 flex px-4 py-2">
                  <input
                    type="radio"
                    className="accent-[#B71F26] my-auto"
                    name="options"
                    value="خصوصی"
                    checked={searchFileType === "خصوصی"}
                    onChange={(e) => {
                      setSearchFileType(e.target.value);
                      setShowFileType((prev) => !prev);
                    }}
                  />
                  <div className="my-auto mx-3 text-[#221D23] "> اختصاصی</div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex place-items-end">
          <div
            onClick={() => {
              searchHandler(
                searchDateFrom,
                searchDateTo,
                searchVersion,
                searchTitle,
                searchFileType
              );
            }}
            className="bg-[#A60014] rounded-[8px] w-14 h-14 flex justify-center"
          >
            <img src={searchIcon} className="w-8 h-8  flex place-self-center" />
          </div>
        </div>
      </div>

      <div className="flex flex-row justify-between  w-full my-8">
        <div className="text-[#1E1B1B] text-lg font-semibold my-auto">
          لیست فایل ها
        </div>
        <hr className="w-[74%] my-auto border-[#D9D9D9]" />
        <div
          onClick={() => navigate("/add-file")}
          className="my-auto bg-[#A60014] py-2  rounded-[50px] flex flex-row px-16 cursor-pointer"
        >
          <img src={addIcon} className="ml-2" />
          <span className="text-white whitespace-nowrap">افزودن فایل</span>
        </div>
      </div>

      <div className="grid grid-cols-7 bg-[#F7F7F7]  text-[#919191] py-2 justify-center rounded-[4px]">
        <div className="text-center">ردیف</div>
        <div className="text-center flex flex-row justify-center items-center">
          <img src={titleIcon} className="my-auto" />
          <span className="my-auto ms-2">عنوان</span>
        </div>

        <div className="text-center flex flex-row justify-center items-center">
          <img src={statusIcon} className="my-auto" />
          <span className="my-auto ms-2"> نوع </span>
        </div>

        <div className="text-center flex flex-row justify-center items-center">
          <img src={userIcon} className="my-auto" />
          <span className="my-auto ms-2">کاربران </span>
        </div>

        <div className="text-center flex flex-row justify-center items-center">
          <img src={versionIcon} className="my-auto" />
          <span className="my-auto ms-2">نسخه</span>
        </div>

        <div className="text-center flex flex-row justify-center items-center">
          <img src={calendarIcon} className="my-auto" />
          <span className="my-auto ms-2">تاریخ انتشار </span>
        </div>

        <div className="text-center flex flex-row justify-center items-center">
          <img src={actionIcon} className="my-auto" />
          <span className="my-auto ms-2">عملیات </span>
        </div>
      </div>

      <div>
        {downloads?.length !== 0 ? (
          responseStatus === 404 ? (
            <div className=" w-fit mx-auto  pt-10 pb-12 px-20 mt-20">
              <div className="w-fit mx-auto mb-4">
                <img src={errIcon} className="w-24 h-24" />
              </div>
              <div className="text-[#6D6F72] text-2xl">هیچ فایلی پیدا نشد.</div>
            </div>
          ) : (
            downloads?.map((item, index) => {
              return (
                <FileDetails
                  key={index}
                  item={item}
                  index={index}
                  setDownloads={setDownloads}
                />
              );
            })
          )
        ) : (
          <div className=" w-fit mx-auto pt-10 pb-12 px-20 mt-20">
            <div className="w-fit mx-auto mb-4">
              <img src={errIcon} className="w-24 h-24" />
            </div>
            <div className="text-[#6D6F72] text-2xl">
              در حال حاضر فایلی وجود ندارد .
            </div>
          </div>
        )}
      </div>

      <div className="">
        {downloads?.length !== 0 && (
          <Pagination
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            current={currentPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      <div className={`${showConfirmBox && " relative"} `}>
        {showConfirmBox &&
          ReactDOM.createPortal(
            <div>
              <div
                className="w-full h-full bg-[#4c4c4c]   opacity-60 fixed top-0 left-0 z-20 "
                onClick={() => setShowConfirmBox(false)}
              />

              <div className="bg-gradient-to-r to-[#B71F26] from-[#640509] font-Peyda  rounded-sm py-10 px-20 w-1/2 z-30 fixed justify-center h-fit mx-auto inset-x-0 my-auto inset-y-0">
                <div className=" w-full mx-auto">
                  <img src={CheckCircleIcon} className=" w-10 h-10 mx-auto" />
                </div>
                <div className="text-xl text-white mx-auto w-fit pt-3">
                  فایل با موفقیت اضافه شد
                </div>
                <div
                  onClick={() => setShowConfirmBox(false)}
                  className="bg-[#1E1B1B] text-white text-lg mx-auto w-fit  mt-10 px-6 py-3 shadow-[0_0_6px_0_rgba(0,0,0,0.5)] rounded-sm cursor-pointer"
                >
                  بازگشت به دانلود ها
                </div>
              </div>
            </div>,

            document.getElementById("modal")
          )}
      </div>
    </div>
  );
};

export default Downloads;
