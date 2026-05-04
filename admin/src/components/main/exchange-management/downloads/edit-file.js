import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import ReactDOM from "react-dom";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import addReceiptIcon from "../../../../assets/images/Add_User.svg";
import modalImage from "../../../../assets/images/modalBack.png";
import CheckCircleIcon from "../../../../assets/images/Check_ring.svg";
import EditIcon from "../../../../assets/images/Edit-profile.svg";

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
        className={` ${
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

const EditFile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const fileInputRef = useRef(null);
  const fileInputRef2 = useRef(null);

  const _id = location?.state?.id;
  const _token = useSelector((state) => state.reducer.token);

  const [responseStatus, setResponseStatus] = useState(0);
  const [token, setToken] = useState("");
  const [fetchedExchanges, setFetchedExchanges] = useState([]);
  const [fileTypes, setFileTypes] = useState([]);

  const [selectedFileType, setSelectedFileType] = useState(null);

  useEffect(() => {
    setToken(_token);
  }, [_token]);

  const [selectedExchange, setSelectedExchange] = useState({
    value: "",
    label: "",
    name: "",
  });

  const [newFile, setNewFile] = useState({
    id: 0,
    fileType: "",
    image: "",
    imagePreview: "",
    title: "",
    version: "",
    file: "",
    description: "",
  });

  useEffect(() => {
    const _fetchReceipt = async () => {
      let _response, _data;
      _response = await fetch(
        `${process.env.REACT_APP_URL}/exchange/file/${_id}`,
        {
          method: "GET",
          headers: { Authorization: "Bearer " + token },
        }
      );

      _data = await _response.json();

      console.log("DDDDDDDDDD", _data?.data);

      setNewFile({
        id: _id,
        fileType: _data?.data?.fileType,
        image: _data?.data?.image,
        imagePreview: "",
        title: _data?.data?.title,
        version: _data?.data?.version,
        file: _data?.data?.file,
        description: _data?.data?.description,
      });

      setSelectedFileType({
        value: _data?.data?.FileTypeId,
        label: _data?.data?.FileType?.type,
      });

      setSelectedExchange({
        value: _data?.data?.ExchangeId,
        label: _data?.data?.Exchange?.username,
        name: _data?.data?.Exchange?.name,
      });
    };

    _id && token && _fetchReceipt();
  }, [_id, token, setNewFile]);

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
  }, [setFetchedExchanges, token]);

  const handleChange = async (option) => {
    setSelectedExchange(option);
  };

  const options = fetchedExchanges?.map((item) => ({
    value: item.id,
    label: item.username,
    name: item.name,
  }));

  useEffect(() => {
    const _fileTypes = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_URL}/exchange/getFileTypes`,
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
          setFileTypes(data?.data);

          break;

        default:
          break;
      }
    };

    token && _fileTypes();
  }, [token, setFileTypes]);

  const handleButtonClick = () => {
    fileInputRef2.current.click();
  };

  const handleFileChange = async (e) => {
    setNewFile((prev) => ({
      ...prev,
      file: e.target.files[0],
    }));
  };

  const EditFilesHandler = async () => {
    setResponseStatus(0);
    let _response;
    const formData = new FormData();

    formData.append("fileType", newFile.fileType);
    formData.append("selectedFileType", selectedFileType?.value);
    formData.append("id", _id);
    formData.append("title", newFile.title);
    formData.append("version", newFile.version);
    formData.append("description", newFile.description);
    formData.append(`exchangeId`, selectedExchange?.value);
    formData.append("files", newFile.file);
    formData.append("images", newFile.image);

    _response = await fetch(
      `${process.env.REACT_APP_URL}/exchange/updateFile`,
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
        setResponseStatus(200);
        break;
      case 400:
        setResponseStatus(400);
        break;
      case 500:
        setResponseStatus(500);
        break;

      default:
        setResponseStatus(500);

        break;
    }
  };

  const fileTypeOptions = fileTypes?.map((item) => ({
    value: item.id,
    label: item.type,
  }));

  const handleFileTypeChange = (selectedOptions) => {
    setSelectedFileType(selectedOptions);
  };

  return (
    <div className="bg-white px-8 py-6 w-[90%] mx-auto font-Peyda  text-[#1E1B1B] rounded-sm">
      <div className="flex flex-row justify-between  w-full  mt-4 mb-10">
        <div className="text-[#1E1B1B] text-lg font-semibold my-auto">
          به روز رسانی فایل
        </div>
        <hr className="w-[90%] my-auto border-[#D9D9D9]" />
      </div>

      <div style={{ direction: "rtl" }} className="grid grid-cols-3">
        <div className="w-full">
          <div className="w-full">
            <div className="text-[#221D23] text-right text-lg mb-2">
              نوع فایل
            </div>

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
        </div>

        <div className="mx-4">
          <div className="text-[#221D23] text-right text-lg mb-2">
            فرمت فایل
          </div>
          {/* <select
            value={newFile.selectedFileType}
            onChange={(e) => {
              setNewFile((prev) => ({
                ...prev,
                selectedFileType: e.target.value,
              }));
            }}
            className="w-full mx-auto border- bg-[#FAF5F5] text-[#221D23] rounded-[8px] px-3 accent-[#B71F26] py-4  mb-4 focus:outline-none"
          >
            {fileTypes?.map((file) => {
              return (
                <option key={file?.id} value={file?.id}>
                  {file?.type}
                </option>
              );
            })}
          </select> */}

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
          <div className="text-[#221D23] text-[20px] mb-2 text-right">
            انتخاب کاربر
          </div>

          <Select
            defaultValue={selectedExchange}
            onChange={handleChange}
            options={options}
            value={selectedExchange}
            components={{ Option }}
            hideSelectedOptions={false}
            styles={customStyles}
            placeholder="نام کاربر را انتخاب کنید"
          />
        </div>
      </div>

      <div
        style={{ direction: "rtl" }}
        className="grid grid-cols-2 gap-4 mt-10"
      >
        <div>
          <div className="text-[#221D23] text-[20px] mb-2 text-right">
            تصویر فایل
          </div>

          <input
            type="file"
            accept="image/jpeg, image/png, image/jpg"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageChange}
          />

          {newFile?.imagePreview ? (
            <div className="relative border border-[#919191] rounded-[10px] w-full h-[18vh] overflow-hidden flex justify-center items-center">
              <img
                src={newFile?.imagePreview}
                className="w-1/2  mx-auto object-cover  "
              />
              <div
                onClick={handleAddPhotoClick}
                className="absolute bottom-0.5 left-0.5 bg-[#A60014] rounded-[10px] p-2 cursor-pointer"
              >
                <img src={EditIcon} className="w-6 h-6" />
              </div>
            </div>
          ) : (
            <div className="border relative border-[#919191] rounded-[10px] w-full h-[18vh] overflow-hidden flex justify-center items-center">
              <img
                src={`${process.env.REACT_APP_URL}/${newFile?.image}`}
                className="w-1/2  mx-auto object-cover  "
              />
              <div
                onClick={handleAddPhotoClick}
                className="absolute bottom-0.5 left-0.5 bg-[#A60014] rounded-[10px] p-2 cursor-pointer"
              >
                <img src={EditIcon} className="w-6 h-6" />
              </div>
            </div>
          )}
        </div>

        <div className="justify-between flex flex-col">
          <div className="mb-5">
            <div className="text-[#221D23] text-[20px] mb-2 text-right">
              عنوان
            </div>
            <input
              value={newFile.title}
              onChange={(e) => {
                setNewFile((prev) => ({
                  ...prev,
                  title: e.target.value,
                }));
              }}
              className="bg-[#F7F7F7] w-full text-[#919191] rounded-sm p-4 focus:outline-none"
              placeholder="عنوان فایل را وارد کنید"
            />
          </div>

          <div className="mb-12">
            <div className="text-[#221D23] text-[20px] mb-2 text-right">
              نسخه
            </div>
            <input
              value={newFile.version}
              onChange={(e) => {
                setNewFile((prev) => ({
                  ...prev,
                  version: e.target.value,
                }));
              }}
              className="bg-[#F7F7F7] w-full text-[#919191] rounded-sm p-4 focus:outline-none"
              placeholder="نام نسخه را وارد کنید"
            />
          </div>
        </div>

        <div>
          <div className="text-[#221D23] text-[20px] mb-2 text-right">
            فایل نصبی
          </div>

          {newFile?.file?.name ? (
            <div className="relative">
              <div
                style={{ direction: "ltr" }}
                className="w-full h-[16vh] border border-[#919191] rounded-[10px] flex items-center justify-center text-sm break-all"
              >
                {newFile.file.name}
              </div>

              <div
                onClick={handleButtonClick}
                className="absolute bottom-0.5 left-0.5 bg-[#A60014] rounded-[10px] p-2 cursor-pointer"
              >
                <img src={EditIcon} className="w-6 h-6" />
              </div>
            </div>
          ) : (
            <div className="relative">
              <div
                style={{ direction: "ltr" }}
                className="w-full h-[16vh] border border-[#919191] rounded-[10px] flex items-center justify-center text-sm text-red-800 text-center"
              >
                {newFile?.file}
              </div>

              <div
                onClick={handleButtonClick}
                className="absolute bottom-0.5 left-0.5 bg-[#A60014] rounded-[10px] p-2 cursor-pointer"
              >
                <img src={EditIcon} className="w-6 h-6" />
              </div>
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef2}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <div>
          <div className="text-[#221D23] text-[20px] mb-2 text-right">
            توضیحات
          </div>
          <textarea
            value={newFile.description}
            onChange={(e) => {
              setNewFile((prev) => ({
                ...prev,
                description: e.target.value,
              }));
            }}
            rows={5}
            className="bg-[#F7F7F7] text-[#919191] w-full rounded-[10px] p-4 focus:outline-none"
            placeholder="توضیحات فایل را وارد کنید"
          />
        </div>
      </div>

      <div className="w-full  mx-auto flex flex-row mt-20 ">
        <button
          onClick={EditFilesHandler}
          className="bg-[#A60014] text-white flex flex-row px-3 py-2 rounded-[50px] w-1/2 mx-auto text-center justify-center
          disabled:bg-[#AFAFAF] disabled:text-white disabled:cursor-not-allowed"
        >
          <img src={addReceiptIcon} className="my-auto ml-2" />
          <span className="my-auto"> بروز رسانی</span>
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
                  فایل با موفقیت بروزرسانی شد
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

export default EditFile;
