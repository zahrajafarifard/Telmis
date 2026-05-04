import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";

import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import axios from "axios";
import Select from "react-select";
import { useForm } from "react-hook-form";

import saveIcon from "../../../assets/images/Check_ring-gray.svg";
import addImgIcon from "../../../assets/images/add_a_photo.svg";
import EditIcon from "../../../assets/images/Edit-profile.svg";
import WarningIcon from "../../../assets/images/error.svg";
import CheckCircleIcon from "../../../assets/images/Check_ring.svg";
import modalImage from "../../../assets/images/modalBack.png";

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
    padding: "10px 10px",
    borderRadius: "10px",
    border: "transparent",
    backgroundColor: "#FAF5F5",
    textAlign: "right",
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

const EditArticle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mainImageInputRef = useRef(null);
  const sectionTwoImageInputRef = useRef(null);
  const _articleId = location?.state?.id;
  const _token = useSelector((state) => state.reducer.token);
  const [token, setToken] = useState("");
  const [responseStatus, setResponseStatus] = useState(0);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [previewImages, setPreviewImages] = useState({
    mainImagePreview: null,
    sectionTwoImagePreview: null,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    getValues,
    watch,
    trigger,
  } = useForm({
    mode: "all",
    defaultValues: {
      articleTitle: "",
      shortDescription: "",
      authorName: "",
      mainImage: null,
      sectionOneTitle: "",
      sectionOneText: "",
      sectionTwoImage: null,
      sectionTwoTitle: "",
      sectionTwoText: "",
      sectionThreeTitle: "",
      sectionThreeText: "",
      categoryId: "",
    },
  });

  useEffect(() => {
    setToken(_token);
  }, [_token]);

  useEffect(() => {
    const timer = setTimeout(() => {
      responseStatus !== 201 && responseStatus !== 0 && setResponseStatus(0);
    }, 4000);
    return () => clearTimeout(timer);
  }, [responseStatus]);

  useEffect(() => {
    const _article = async () => {
      let _response, _data;
      _response = await fetch(
        `${process.env.REACT_APP_URL}/articles/article/${_articleId}`,
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
          setValue("articleTitle", _data?.data?.articleTitle);
          setValue("shortDescription", _data?.data?.shortDescription);
          setValue("authorName", _data?.data?.author);
          setValue("mainImage", _data?.data?.mainImage);
          setValue("sectionOneTitle", _data?.data?.sectionOneTitle);
          setValue("sectionOneText", _data?.data?.sectionOneText);
          setValue("sectionTwoImage", _data?.data?.sectionTwoImage);
          setValue("sectionTwoTitle", _data?.data?.sectionTwoTitle);
          setValue("sectionTwoText", _data?.data?.sectionTwoText);
          setValue("sectionThreeTitle", _data?.data?.sectionThreeTitle);
          setValue("sectionThreeText", _data?.data?.sectionThreeText);
          setValue("categoryId", _data?.data?.ArticleTypeId);

          break;

        default:
          break;
      }
    };

    token && _articleId && _article();
  }, [token, _articleId]);

  const handleFileUpload = (e, fieldName, previewFieldName) => {
    const file = e.target.files[0];
    if (file) {
      setValue(fieldName, file, { shouldValidate: true });
      setPreviewImages({
        ...previewImages,
        [previewFieldName]: URL.createObjectURL(file),
      });
    }
  };

  const triggerFileInput = (inputRef) => {
    inputRef.current.click();
  };

  const onSubmit = async (data) => {
    let response;
    const formDataToSend = new FormData();

    formDataToSend.append("articleId", _articleId);
    formDataToSend.append("articleTitle", data.articleTitle);
    formDataToSend.append("shortDescription", data.shortDescription);
    formDataToSend.append("category", data.categoryId);
    formDataToSend.append("authorName", data.authorName);
    formDataToSend.append("sectionOneTitle", data.sectionOneTitle);
    formDataToSend.append("sectionOneText", data.sectionOneText);
    formDataToSend.append("sectionTwoTitle", data.sectionTwoTitle);
    formDataToSend.append("sectionTwoText", data.sectionTwoText);
    formDataToSend.append("sectionThreeTitle", data.sectionThreeTitle);
    formDataToSend.append("sectionThreeText", data.sectionThreeText);

    if (data?.mainImage) formDataToSend.append("mainImage", data.mainImage);
    if (data?.sectionTwoImage)
      formDataToSend?.append("sectionTwoImage", data.sectionTwoImage);

    // for (let pair of formDataToSend.entries()) {
    //   console.log(pair[0], pair[1]);
    // }

    try {
      response = await axios.patch(
        `${process.env.REACT_APP_URL}/articles/edit-article`,
        formDataToSend,
        {
          timeout: 20000,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      setResponseStatus(500);
    }

    switch (response?.status) {
      case 201:
        setResponseStatus(201);
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
    const _categories = async () => {
      const _response = await fetch(
        `${process.env.REACT_APP_URL}/article-job-cat`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      switch (_response.status) {
        case 200:
          const data = await _response.json();
          setCategories(data?.data);
          break;

        default:
          break;
      }
    };

    token && _categories();
  }, [token, setCategories]);

  const options = categories?.map((item) => ({
    value: item.id,
    label: item.type,
  }));

  const handleChange = async (option) => {
    setSelectedCategory(option);
  };

  return (
    <div className="w-[90%] mx-auto h-screen overflow-y-auto ">
      <div className="flex flex-row justify-between  w-full my-8">
        {responseStatus !== 0 && responseStatus !== 201 ? (
          <div className="w-fit whitespace-nowrap text-[#434242] text-sm flex flex-row   bg-[#FFF099] py-2 pr-14 pl-24  rounded-sm my-auto">
            <img
              src={WarningIcon}
              alt="آیکن هشدار"
              className="my-auto w-6 h-6"
            />
            <div
              style={{ direction: "rtl" }}
              className="my-auto mr-2 text-[#D76B00]"
            >
              خطای سمت سرور، بعدا تلاش کنید .
            </div>
          </div>
        ) : (
          <div className="text-[#1E1B1B] text-lg font-semibold my-auto">
            اطلاعات مقاله
          </div>
        )}
        <hr className="w-[68%] my-auto border-[#D9D9D9]" />

        <div
          onClick={() => handleSubmit(onSubmit)()}
          className={`my-auto  py-2  rounded-[50px] flex flex-row px-16 
            ${
              !isValid
                ? "bg-[#D9D9D9] cursor-not-allowed"
                : "bg-[#A60014] cursor-pointer"
            }
            `}
        >
          <img
            src={saveIcon}
            className={`ml-2 ${isValid && "brightness-0 invert"}`}
          />
          <span
            className={`whitespace-nowrap ${
              !isValid ? "text-[#919191]" : "text-white"
            } `}
          >
            ویرایش مقاله
          </span>
        </div>
      </div>

      <div className="flex flex-row justify-between">
        <div className="w-[30%] border flex flex-col justify-center items-center h-[45vh] border-[#919191] rounded-[10px] overflow-hidden">
          {previewImages?.mainImagePreview ? (
            <div className="w-full h-full relative ">
              <img
                src={previewImages.mainImagePreview}
                alt="Main Preview"
                className="w-full h-full object-cover"
              />

              <div
                onClick={() => triggerFileInput(mainImageInputRef)}
                className="absolute bottom-0.5 left-0.5 bg-[#A60014] rounded-[10px] p-2"
              >
                <img src={EditIcon} className="w-6 h-6" />
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full">
              <img
                src={`${process.env.REACT_APP_URL}/uploads/article/${getValues(
                  "mainImage"
                )}`}
                className="mx-auto w-full h-full object-cover"
              />

              <div
                onClick={() => triggerFileInput(mainImageInputRef)}
                className="absolute bottom-0.5 left-0.5 bg-[#A60014] rounded-[10px] p-2"
              >
                <img src={EditIcon} className="w-6 h-6" />
              </div>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            ref={mainImageInputRef}
            style={{ display: "none" }}
            name="mainImage"
            onChange={(e) =>
              handleFileUpload(e, "mainImage", "mainImagePreview")
            }
          />
        </div>
        <div className="w-[68%] ">
          <div className="w-full mb-5">
            <div className="text-[#221D23] text-right text-xl mb-2 leading-[31px] ">
              دسته بندی مقالات
            </div>
            <Select
              defaultValue={selectedCategory}
              onChange={handleChange}
              options={options}
              value={selectedCategory}
              hideSelectedOptions={false}
              styles={customStyles}
              components={{ Option }}
              placeholder="انتخاب دسته بندی مقالات"
              isClearable
            />
          </div>
          <div className="w-full mb-5">
            <div className="text-right text-[#221D23] text-xl leading-[31px] mb-2">
              عنوان مقاله
            </div>
            <input
              {...register("articleTitle", {
                required: "عنوان مقاله الزامی است",
                minLength: {
                  value: 3,
                  message: "عنوان مقاله باید حداقل 3 کاراکتر باشد",
                },
              })}
              placeholder="عنوان را وارد کنید"
              className={`bg-[#F7F7F7] rounded-[8px] text-[#919191] w-full p-4 focus:outline-none  ${
                errors.articleTitle ? "border border-[#A60014]" : ""
              }`}
            />
            {errors.articleTitle && (
              <div className="text-[#A60014] text-xs mt-1 text-right">
                {errors.articleTitle.message}
              </div>
            )}
          </div>
          <div className="w-full my-5">
            <div className="text-right text-[#221D23] text-xl leading-[31px] mb-2">
              نویسنده مقاله
            </div>
            <input
              {...register("authorName", {
                required: "نویسنده مقاله الزامی است",
                minLength: {
                  value: 3,
                  message: "نویسنده مقاله باید حداقل 3 کاراکتر باشد",
                },
              })}
              placeholder="نویسنده مقاله را وارد کنید"
              className={`bg-[#F7F7F7] rounded-[8px] text-[#919191] w-full p-4 focus:outline-none  ${
                errors.authorName ? "border border-[#A60014]" : ""
              }`}
            />
            {errors.authorName && (
              <div className="text-[#A60014] text-xs mt-1 text-right">
                {errors.authorName.message}
              </div>
            )}
          </div>
          <div className="w-full">
            <div className="text-right text-[#221D23] text-xl leading-[31px] mb-2 ">
              توضیحات کوتاه
            </div>
            <input
              {...register("shortDescription", {
                required: "توضیحات کوتاه الزامی است",
                // minLength: {
                //   value: 10,
                //   message: "توضیحات کوتاه باید حداقل 3 کاراکتر باشد",
                // },
              })}
              placeholder="توضیح کوتاه مقاله را وارد کنید"
              className={`bg-[#F7F7F7] rounded-[8px] text-[#919191] w-full p-4 focus:outline-none  ${
                errors.shortDescription ? "border border-[#A60014]" : ""
              }`}
            />
            {errors.shortDescription && (
              <div className="text-[#A60014] text-xs mt-1 text-right">
                {errors.shortDescription.message}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* ///////////////////sec 2////////////// */}

      <div className="flex flex-row justify-between  w-full mt-14 mb-8">
        <div className="text-[#1E1B1B] text-2xl my-auto">
          بخش اول بدنه مقاله
        </div>
        <hr className="w-[85%] my-auto border-[#D9D9D9]" />
      </div>

      <div className="w-full">
        <div className="text-right text-[#221D23] text-xl leading-[31px] mb-2">
          عنوان بخش اول مقاله
        </div>
        <input
          {...register("sectionOneTitle", {
            required: "عنوان بخش اول الزامی است",
          })}
          placeholder="عنوان را وارد کنید"
          className={`bg-[#F7F7F7] rounded-[8px] text-[#919191] w-full p-4 focus:outline-none  ${
            errors.sectionOneTitle ? "border border-[#A60014]" : ""
          }`}
        />
        {errors.sectionOneTitle && (
          <div className="text-[#A60014] text-xs mt-1 text-right">
            {errors.sectionOneTitle.message}
          </div>
        )}
      </div>

      <div className="w-full mt-5 mb-14">
        <div className="text-right text-[#221D23] text-xl leading-[31px] mb-2">
          متن مقاله
        </div>
        <textarea
          {...register("sectionOneText", {
            required: "متن بخش اول الزامی است",
          })}
          rows={5}
          placeholder="متن خود را وارد کنید"
          className={`bg-[#F7F7F7] rounded-[8px] text-[#919191] w-full p-4 focus:outline-none  ${
            errors.sectionOneText ? "border border-[#A60014]" : ""
          }`}
        />
        {errors.sectionOneText && (
          <div className="text-[#A60014] text-xs mt-1 text-right">
            {errors.sectionOneText.message}
          </div>
        )}
      </div>

      {/* ///////////////////sec 3////////////// */}

      <div className="flex flex-row justify-between  w-full mt-14 mb-8">
        <div className="text-[#1E1B1B] text-2xl my-auto">
          بخش دوم بدنه مقاله
        </div>
        <hr className="w-[85%] my-auto border-[#D9D9D9]" />
      </div>

      <div className="flex flex-row justify-between">
        <div className="w-[30%] h-[32vh] border flex flex-col justify-center items-center border-[#919191] rounded-[10px] overflow-hidden">
          {previewImages?.sectionTwoImagePreview ? (
            <div className="w-full h-full relative ">
              <img
                src={previewImages.sectionTwoImagePreview}
                alt="Section Two Preview"
                className="w-full h-full object-cover"
              />

              <div
                onClick={() => triggerFileInput(sectionTwoImageInputRef)}
                className="absolute bottom-0.5 left-0.5 bg-[#A60014] rounded-[10px] p-2"
              >
                <img src={EditIcon} className="w-6 h-6" />
              </div>
            </div>
          ) : getValues("sectionTwoImage") ? (
            <div className="relative w-full h-full">
              <img
                src={`${process.env.REACT_APP_URL}/uploads/article/${getValues(
                  "sectionTwoImage"
                )}`}
                alt="Section Two Image"
                className="mx-auto w-full h-full object-cover"
              />
              <div
                onClick={() => triggerFileInput(sectionTwoImageInputRef)}
                className="absolute bottom-0.5 left-0.5 bg-[#A60014] rounded-[10px] p-2"
              >
                <img src={EditIcon} className="w-6 h-6" />
              </div>
            </div>
          ) : (
            <div
              onClick={() => triggerFileInput(sectionTwoImageInputRef)}
              className="relative w-full h-full flex flex-col items-center justify-center"
            >
              <img src={addImgIcon} className="mx-auto mb-2" />
              <div className="text-[#919191] leading-[20px]">
                تصویر بخش دوم را وارد کنید.
              </div>
              <div className="text-[#A60014] text-xs leading-[30px] ">
                فرمت تصویر باید PNG با حجم کمتر از 100 کیلوبایت باشد.
              </div>
            </div>
          )}

          <input
            type="file"
            ref={sectionTwoImageInputRef}
            style={{ display: "none" }}
            name="sectionTwoImage"
            onChange={(e) =>
              handleFileUpload(e, "sectionTwoImage", "sectionTwoImagePreview")
            }
          />
        </div>
        <div className="w-[68%] ">
          <div className="w-full mb-5">
            <div className="text-right text-[#221D23] text-xl leading-[31px] mb-2">
              عنوان بخش دوم
            </div>
            <input
              {...register("sectionTwoTitle", {
                required: false,
              })}
              placeholder="عنوان را وارد کنید"
              className={`bg-[#F7F7F7] rounded-[8px] text-[#919191] w-full p-4 focus:outline-none  ${
                errors.sectionTwoTitle ? "border border-[#A60014]" : ""
              }`}
            />
            {errors.sectionTwoTitle && (
              <div className="text-[#A60014] text-xs mt-1 text-right">
                {errors.sectionTwoTitle.message}
              </div>
            )}
          </div>

          <div className="w-full">
            <div className="text-right text-[#221D23] text-xl leading-[31px] mb-2 ">
              متن مقاله
            </div>
            <textarea
              {...register("sectionTwoText", {
                required: false,
              })}
              rows={5}
              placeholder="توضیح کوتاه مقاله را وارد کنید"
              className={`bg-[#F7F7F7] rounded-[8px] text-[#919191] w-full p-4 focus:outline-none  ${
                errors.sectionTwoText ? "border border-[#A60014]" : ""
              }`}
            />
            {errors.sectionTwoText && (
              <div className="text-[#A60014] text-xs mt-1 text-right">
                {errors.sectionTwoText.message}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* ///////////////////sec 4////////////// */}

      <div className="flex flex-row justify-between  w-full mt-14 mb-8">
        <div className="text-[#1E1B1B] text-2xl my-auto">
          بخش سوم بدنه مقاله
        </div>
        <hr className="w-[85%] my-auto border-[#D9D9D9]" />
      </div>

      <div className="w-full">
        <div className="text-right text-[#221D23] text-xl leading-[31px] mb-2">
          عنوان بخش سوم مقاله
        </div>
        <input
          {...register("sectionThreeTitle", {
            required: false,
          })}
          placeholder="عنوان را وارد کنید"
          className={`bg-[#F7F7F7] rounded-[8px] text-[#919191] w-full p-4 focus:outline-none  ${
            errors.sectionThreeTitle ? "border border-[#A60014]" : ""
          }`}
        />
        {errors.sectionThreeTitle && (
          <div className="text-[#A60014] text-xs mt-1 text-right">
            {errors.sectionThreeTitle.message}
          </div>
        )}
      </div>

      <div className="w-full mt-6 mb-14">
        <div className="text-right text-[#221D23] text-xl leading-[31px] mb-2">
          متن مقاله
        </div>
        <textarea
          {...register("sectionThreeText", {
            required: false,
          })}
          rows={5}
          placeholder="متن خود را وارد کنید"
          className={`bg-[#F7F7F7] rounded-[8px] text-[#919191] w-full p-4 focus:outline-none  ${
            errors.sectionThreeText ? "border border-[#A60014]" : ""
          }`}
        />
        {errors.sectionThreeText && (
          <div className="text-[#A60014] text-xs mt-1 text-right">
            {errors.sectionThreeText.message}
          </div>
        )}
      </div>

      {/* ///////////////////sec 5////////////// */}

      <div
        onClick={() => handleSubmit(onSubmit)()}
        className={`my-auto py-2 rounded-[50px] flex flex-row px-16 justify-center items-center mb-5
          ${
            !isValid
              ? "bg-[#D9D9D9] cursor-not-allowed"
              : "bg-[#A60014] cursor-pointer"
          }
        `}
      >
        <img
          src={saveIcon}
          className={`ml-2 ${isValid && "brightness-0 invert"}`}
        />
        <span
          className={`whitespace-nowrap ${
            !isValid ? "text-[#919191]" : "text-white"
          }`}
        >
          ویرایش مقاله
        </span>
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
                <div
                  style={{ direction: "rtl" }}
                  className="text-xl text-white mx-auto w-fit pt-3"
                >
                  مقاله با موفقیت ویرایش شد .
                </div>

                <div
                  onClick={() => {
                    setResponseStatus(0);
                    navigate("/articles");
                  }}
                  className="bg-[#FFDA8A] text-[#221D23] text-center text-lg mx-auto py-2 rounded-[50px] cursor-pointer w-44 mt-4"
                >
                  بازگشت به پنل
                </div>
              </div>
            </div>,

            document.getElementById("modal")
          )}
      </div>
    </div>
  );
};

export default EditArticle;
