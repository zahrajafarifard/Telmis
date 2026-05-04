import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import saveIcon from "../../../../../assets/images/Check_ring-gray.svg";
import addImgIcon from "../../../../../assets/images/add_a_photo.svg";
import editIcon from "../../../../../assets/images/Edit-profile.svg";

const AddSubCategory = () => {
  const navigate = useNavigate();
  const imageInputRef = useRef(null);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [subCategoryName, setSubCategoryName] = useState("");

  const _token = useSelector((state) => state.reducer.token);
  const [token, setToken] = useState("");

  useEffect(() => {
    setToken(_token);
  }, [_token]);

  useEffect(() => {
    const _categories = async () => {
      let _response, _data;
      _response = await fetch(
        `${process.env.REACT_APP_URL}/categories/parents`,
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
          setCategories(_data?.data);
          setSelectedCategory(_data?.data[0]?.id);

          break;

        default:
          break;
      }
    };

    token && _categories();
  }, [token, setCategories]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const triggerFileInput = (inputRef) => {
    inputRef.current.click();
  };

  const addSubCategoryHandler = async () => {
    let _response, _data;
    const formData = new FormData();

    formData.append("parent", selectedCategory);
    formData.append("name", subCategoryName);
    formData.append("image", imageFile);

    // for (let pair of formData.entries()) {
    //   console.log(pair[0], pair[1]);
    // }
    _response = await fetch(
      `${process.env.REACT_APP_URL}/categories/addSubCategory`,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
        body: formData,
      }
    );

    switch (_response.status) {
      case 201:
        navigate(-1);
        break;

      default:
        break;
    }
  };

  return (
    <div className="w-[90%] mx-auto">
      <div className="flex flex-row justify-between   w-full my-8">
        <div className="text-[#1E1B1B] text-lg font-semibold my-auto">
          اطلاعات زیر دسته
        </div>
        <hr className="flex flex-grow my-auto border-[#D9D9D9] mx-4 " />

        <button
          disabled={!subCategoryName || !imageFile}
          onClick={() => addSubCategoryHandler()}
          className="my-auto bg-[#A60014]  py-2  rounded-[50px] flex flex-row px-16 cursor-pointer 
          disabled:cursor-not-allowed disabled:bg-[#A60014] disabled:hover:bg-[#A60014]"
        >
          <img src={saveIcon} className="ml-2 invert brightness-0" />
          <span className="text-[#fff] ">ذخیره اطلاعات </span>
        </button>
      </div>

      <div className="flex flex-row justify-between">
        <div className="w-[30%] border flex flex-col justify-center items-center border-[#919191] rounded-[10px] overflow-hidden">
          {previewImage ? (
            <div className="w-full h-72 relative ">
              <img
                src={previewImage}
                alt="Main Preview"
                className="w-full h-full object-contain"
              />

              <div
                onClick={() => triggerFileInput(imageInputRef)}
                className="absolute bottom-0.5 left-0.5 bg-[#A60014] rounded-[10px] p-2"
              >
                <img src={editIcon} className="w-6 h-6" />
              </div>
            </div>
          ) : (
            <div onClick={() => triggerFileInput(imageInputRef)}>
              <img src={addImgIcon} className="mx-auto mb-2 cursor-pointer" />
              <div className="text-[#919191] leading-[20px]">
                تصویر اصلی را وارد کنید.
              </div>
              <div className="text-[#A60014] text-xs leading-[30px] ">
                فرمت تصویر باید PNG با حجم کمتر از 100 کیلوبایت باشد.
              </div>
            </div>
          )}
          <input
            type="file"
            ref={imageInputRef}
            style={{ display: "none" }}
            name="file"
            onChange={(e) => handleFileUpload(e)}
          />
        </div>

        <div className="w-[68%] ">
          <div className="w-full mb-4">
            <div className="text-[#221D23] text-right text-lg mb-2">
              نوع دسته بندی اصلی
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#FAF5F5] text-[#221D23] rounded-[8px] px-3 accent-[#B71F26] w-full py-4 focus:outline-none "
            >
              {categories?.map((item) => {
                return (
                  <option key={item?.id} value={item?.id}>
                    {item.name}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="w-full">
            <div className="text-right text-[#221D23] text-xl leading-[31px] mb-2">
              عنوان اصلی زیر دسته
            </div>
            <input
              value={subCategoryName}
              onChange={(e) => {
                setSubCategoryName(e.target.value);
              }}
              placeholder="عنوان را وارد کنید"
              className="bg-[#F7F7F7] rounded-[8px] text-[#919191] w-full p-4 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSubCategory;
