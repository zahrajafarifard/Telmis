import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

import addPhoto1 from "../../../../assets/images/add-square-02.svg";
import addPhoto2 from "../../../../assets/images/add_a_photo.svg";
import EditIcon from "../../../../assets/images/Edit-profile.svg";
import addReceiptIcon from "../../../../assets/images/Add_User.svg";
import modalImage from "../../../../assets/images/modalBack.png";
import CheckCircleIcon from "../../../../assets/images/Check_ring.svg";
import Spinner from "../../../shared-component/spinner";

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
  }),
};

const AddNewFile = () => {
  const navigate = useNavigate();
  const _token = useSelector((state) => state.reducer.token);
  const [token, setToken] = useState("");
  const [responseStatus, setResponseStatus] = useState(0);
  const fileInputRef = useRef(null);
  const fileInputRef2 = useRef(null);
  const [selectedExchange, setSelectedExchange] = useState(null);
  const [selectedFileType, setSelectedFileType] = useState(null);
  const [fileTypes, setFileTypes] = useState([]);
  const [fetchedExchanges, setFetchedExchanges] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [newFile, setNewFile] = useState({
    fileType: "عمومی",

    image: "",
    imagePreview: "",
    title: "",
    version: "",
    file: "",
    description: "",
  });

  useEffect(() => {
    setToken(_token);
  }, [_token]);

  useEffect(() => {
    const _fileTypes = async () => {
      let _response, _data;

      _response = await fetch(
        `${process.env.REACT_APP_URL}/exchange/getFileTypes`,
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
          setFileTypes(_data?.data);

          break;

        default:
          break;
      }
    };

    token && _fileTypes();
  }, [token]);

  const handleImageChange = (e) => {
    setNewFile((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));

    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setNewFile((prev) => ({
          ...prev,
          imagePreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPhotoClick = () => {
    fileInputRef.current.click();
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
      value: item.id,
      label: item.username,
      name: item.name,
    })),
  ];

  const fileTypeOptions = fileTypes?.map((item) => ({
    value: item.id,
    label: item.type,
  }));

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

  const handleFileTypeChange = (selectedOptions) => {
    setSelectedFileType(selectedOptions);
  };

  const handleButtonClick = () => {
    fileInputRef2.current.click();
  };

  const handleFileChange = async (e) => {
    setNewFile((prev) => ({
      ...prev,
      file: e.target.files[0],
    }));
  };

  const uploadFilesHandler = async () => {
    setUploading(true);
    let exchangeIds = [];

    selectedExchange
      ?.filter((item) => item.value !== "*")
      .map((item) => {
        exchangeIds.push(item.value);
      });

    const promises = exchangeIds.map((id) => {
      const formData = new FormData();
      formData.append("selectedFileType", selectedFileType?.value);
      formData.append("fileType", newFile.fileType);
      formData.append("title", newFile.title);
      formData.append("version", newFile.version);
      formData.append("description", newFile.description);
      formData.append("exchangeId", id);
      formData.append("files", newFile.file);
      formData.append("images", newFile.image);

      return fetch(`${process.env.REACT_APP_URL}/exchange/uploadFiles`, {
        method: "PATCH",
        headers: {
          Authorization: "Bearer " + token,
        },
        body: formData,
      });
    });

    try {
      const responses = await Promise.all(promises);
      responses.forEach((_response) => {
        switch (_response.status) {
          case 200:
            setUploading(false);
            setResponseStatus(200);
            break;

          default:
            console.error("Error uploading file:", _response.statusText);
            break;
        }
      });
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };

  if (uploading) {
    return <Spinner />;
  }

  return (
    <div className="w-[90%] mx-auto bg-white px-8 py-6 font-Peyda text-[#1E1B1B] rounded-sm ">
      <div className="flex flex-row justify-between  w-full  mt-4 mb-10">
        <div className="text-[#1E1B1B] text-lg font-semibold my-auto">
          اضافه کردن فایل جدید
        </div>
        <hr className="w-[82%] my-auto border-[#D9D9D9]" />
      </div>

      <div className="grid grid-cols-3 mb-12 gap-x-5 ">
        <div className="w-full">
          <div className="text-[#221D23] text-right text-lg mb-1">نوع فایل</div>

          <select
            value={newFile.fileType}
            onChange={(e) => {
              setNewFile((prev) => ({
                ...prev,
                fileType: e.target.value,
              }));
            }}
            className="bg-[#FAF5F5] text-[#221D23] rounded-[8px] px-3 accent-[#B71F26] w-full py-4 focus:outline-none "
          >
            <option value="عمومی">عمومی</option>
            <option value="خصوصی">خصوصی</option>
          </select>
        </div>

        <div className="w-full">
          <div className="text-[#221D23] text-right text-lg mb-1">
            فرمت فایل
          </div>
          <Select
            defaultValue={selectedFileType}
            onChange={handleFileTypeChange}
            options={fileTypeOptions}
            value={selectedFileType}
            components={{ Option }}
            hideSelectedOptions={false}
            styles={customStyles}
            placeholder="فرمت فایل را انتخاب کنید"
          />
        </div>
        <div className="w-full">
          <div className="text-[#221D23] text-right text-lg mb-1">
            انتخاب کاربر
          </div>
          <Select
            defaultValue={selectedExchange}
            onChange={handleChange}
            options={options}
            value={selectedExchange}
            components={{ Option }}
            isMulti
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            styles={customStyles}
            placeholder="نام کاربر را انتخاب کنید"
          />
        </div>
      </div>

      <div style={{ direction: "rtl" }} className="grid grid-cols-2 gap-4">
        <div className="">
          <div className="text-[#221D23] text-right text-lg mb-1">
            تصویر فایل
          </div>

          <input
            type="file"
            accept="image/jpeg, image/png, image/jpg"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageChange}
          />

          {newFile.imagePreview ? (
            <div className="border relative w-full h-[18vh] overflow-hidden flex justify-center items-center border-[#919191]  rounded-[10px] ">
              <img
                src={newFile.imagePreview}
                className="w-1/2 h-[90] mx-auto object-cover"
              />

              <div
                onClick={handleAddPhotoClick}
                className="absolute bottom-0.5 left-0.5 bg-[#A60014] rounded-[10px] p-2 cursor-pointer"
              >
                <img src={EditIcon} className="w-6 h-6" />
              </div>
            </div>
          ) : (
            <div
              onClick={handleAddPhotoClick}
              className="w-full h-[18vh] border flex flex-col items-center justify-center  border-[#919191] rounded-[10px] "
            >
              <img src={addPhoto2} className="w-12 h-12" />
              <div className="text-[#919191] ">افزودن تصویر</div>
            </div>
          )}
        </div>

        <div className="justify-between flex flex-col">
          <div className="mb-5">
            <div className="text-[#221D23] text-right text-lg mb-1">عنوان</div>
            <input
              value={newFile.title}
              onChange={(e) => {
                setNewFile((prev) => ({
                  ...prev,
                  title: e.target.value,
                }));
              }}
              className="text-[#919191] bg-[#F7F7F7] w-full rounded-[8px] p-4  focus:outline-none "
              placeholder="عنوان فایل را وارد کنید"
            />
          </div>

          <div>
            <div className="text-[#221D23] text-right text-lg mb-1">نسخه</div>
            <input
              value={newFile.version}
              onChange={(e) => {
                setNewFile((prev) => ({
                  ...prev,
                  version: e.target.value,
                }));
              }}
              className="text-[#919191] bg-[#F7F7F7] w-full rounded-[8px] p-4 focus:outline-none"
              placeholder="نام نسخه را وارد کنید"
            />
          </div>
        </div>

        <div className="mt-12">
          <div className="flex flex-row justify-between">
            <div className="text-[#221D23] text-right text-lg mb-1">
              فایل نصبی
            </div>
          </div>
          {newFile.file ? (
            <div
              style={{ direction: "ltr" }}
              className="relative w-full h-[18vh] border flex items-center justify-center text-sm border-[#919191]  rounded-[10px]"
            >
              {newFile.file.name}

              <div
                onClick={handleButtonClick}
                className="absolute bottom-0.5 left-0.5 bg-[#A60014] rounded-[10px] p-2"
              >
                <img src={EditIcon} className="w-6 h-6" />
              </div>
            </div>
          ) : (
            <div
              onClick={handleButtonClick}
              className="w-full h-[18vh] border  flex flex-col items-center justify-center border-[#919191]  rounded-[10px]"
            >
              <img src={addPhoto1} className="w-12 h-12 " />
              <div className="text-[#919191] leading-[36px] "> افزودن فایل</div>
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef2}
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="mt-0.5 w-full text-xs text-right text-[#A60014]">
            در صورت بارگذاری عکس برای این بخش، لطفاً ابتدا آن را فشرده (زیپ)
            نمایید.
          </div>
        </div>

        <div className="mt-12">
          <div className="text-[#221D23] text-right text-lg mb-1">توضیحات</div>
          <textarea
            value={newFile.description}
            onChange={(e) => {
              setNewFile((prev) => ({
                ...prev,
                description: e.target.value,
              }));
            }}
            rows={6}
            className="text-[#919191] bg-[#F7F7F7] w-full rounded-[8px] p-4 focus:outline-none"
            placeholder="توضیحات فایل را وارد کنید"
          />
        </div>
      </div>

      <div className="w-full  mx-auto flex flex-row mt-20 ">
        <button
          disabled={
            !selectedFileType?.value ||
            !newFile.image ||
            !newFile.file ||
            !newFile.version ||
            !newFile.description ||
            !newFile.title ||
            !selectedExchange ||
            uploading
          }
          onClick={uploadFilesHandler}
          className="bg-[#A60014] text-white flex flex-row px-3 py-2 rounded-[50px] w-1/2 mx-auto text-center justify-center
          disabled:bg-[#AFAFAF] disabled:text-white disabled:cursor-not-allowed"
        >
          <img src={addReceiptIcon} className="my-auto ml-2" />
          <span className="my-auto"> افزودن فایل</span>
        </button>
        <button
          onClick={() => {
            navigate(-1);
          }}
          className="border border-[#B71F26]  text-[#B71F26]  w-1/2 justify-center flex flex-row px-3 py-2 rounded-[50px] mr-2 "
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
                  فایل (ها) با موفقیت اضافه شد
                </div>

                <div
                  onClick={() => {
                    setResponseStatus(0);
                    navigate(-1);
                  }}
                  className="bg-[#FFDA8A] text-[#221D23] text-center text-lg py-2 rounded-[50px] cursor-pointer w-44 mx-auto"
                >
                  بازگشت به فایل ها
                </div>
              </div>
            </div>,

            document.getElementById("modal")
          )}
      </div>
    </div>
  );
};

export default AddNewFile;
