import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import Select from "react-select";
import AddProducImage from "./add-product-image";
import saveLightIcon from "../../../../../assets/images/Check_ring-black.svg";
import cancelIcon from "../../../../../assets/images/cancel.svg";
import cancelLightIcon from "../../../../../assets/images/close.svg";
import addImgIcon from "../../../../../assets/images/add_a_photo.svg";
import infoIcon from "../../../../../assets/images/Info.svg";
import editIcon from "../../../../../assets/images/Edit-profile.svg";
import AddVariables from "./add-variables";
import ProductSpecifications from "./product-specifications";
import addIcon from "../../../../../assets/images/Add.svg";

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

const AddProduct = () => {
  //////////////////////////////////
  const [variables, setVariables] = useState([
    { key: "", items: ["", "", "", "", ""] },
  ]);

  const [showForm, setShowForm] = useState(false);

  const [specifications, setSpecifications] = useState([
    { key: "", value: "", selected: false },
    { key: "", value: "", selected: false },
    { key: "", value: "", selected: false },
    { key: "", value: "", selected: false },
  ]);

  //////////////////////////////////
  const navigate = useNavigate();
  const _token = useSelector((state) => state.reducer.token);
  const [token, setToken] = useState("");

  useEffect(() => {
    setToken(_token);
  }, [_token]);

  const mainImageInputRef = useRef(null);
  const secondImageInputRef = useRef(null);
  const thirdImageInputRef = useRef(null);
  const fourthImageInputRef = useRef(null);

  const [categoryId, setCategoryId] = useState(null);
  const [subCategories, setSubCategories] = useState([]);

  const [previewImages, setPreviewImages] = useState({
    mainImagePreview: null,
    secondImagePreview: null,
    thirdImagePreview: null,
    fourthImagePreview: null,
  });

  const [mainImageError, setMainImageError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    trigger,
  } = useForm({
    mode: "all",
    defaultValues: {
      mainTitle: "",
      identifier: "",
      subTitle: "",
      mainImage: null,
      secondImage: null,
      thirdImage: null,
      fourthImage: null,
      description: "",
      price: "",
      count: "",
      discount: "",
    },
  });

  useEffect(() => {
    const _articleType = async () => {
      let _response, _data;
      _response = await fetch(
        `${process.env.REACT_APP_URL}/categories/getAllSubCategories`,
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
          setSubCategories(_data?.data);

          break;

        default:
          break;
      }
    };

    token && _articleType();
  }, [token]);

  const options = subCategories?.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  const handleChange = (option) => {
    setCategoryId(option);
  };
  const handleFileUpload = (e, fieldName, previewFieldName) => {
    const file = e.target.files[0];
    if (file) {
      setValue(fieldName, file, { shouldValidate: true });
      setPreviewImages({
        ...previewImages,
        [previewFieldName]: URL.createObjectURL(file),
      });
      if (fieldName === "mainImage") {
        setMainImageError(false);
      }
    }
  };

  const triggerFileInput = (inputRef) => {
    inputRef.current.click();
  };

  const onSubmit = async (data) => {
    if (!data.mainImage) {
      setMainImageError(true);
      return;
    }

    let _specifications = specifications.filter(
      (item) => item.key !== "" || item.value !== ""
    );
    let _variables = variables.map((variable) => ({
      ...variable,
      items: variable.items.filter((item) => item !== ""), // Remove empty strings from 'items'
    }));

    const formDataToSend = new FormData();

    _specifications.forEach((spec, index) => {
      formDataToSend.append(`specifications[${index}][key]`, spec.key);
      formDataToSend.append(`specifications[${index}][value]`, spec.value);
      formDataToSend.append(
        `specifications[${index}][selected]`,
        spec.selected
      );
    });
    _variables.forEach((variable, index) => {
      formDataToSend.append(`variables[${index}][key]`, variable.key);

      variable.items.forEach((item, itemIndex) => {
        formDataToSend.append(`variables[${index}][items][${itemIndex}]`, item);
      });
    });

    formDataToSend.append("mainTitle", data.mainTitle);
    formDataToSend.append("subTitle", data.subTitle);
    formDataToSend.append("price", data.price.replace(/,/g, ""));
    formDataToSend.append("identifier", data.identifier);
    formDataToSend.append("count", data.count);
    formDataToSend.append("discount", data.discount.replace(/,/g, ""));
    formDataToSend.append("description", data.description);
    formDataToSend.append("category", categoryId?.value);

    if (data?.mainImage) formDataToSend.append("mainImage", data.mainImage);
    if (data?.secondImage)
      formDataToSend?.append("secondImage", data.secondImage);
    if (data.thirdImage) formDataToSend?.append("thirdImage", data.thirdImage);
    if (data?.fourthImage)
      formDataToSend.append("fourthImage", data.fourthImage);

    for (let pair of formDataToSend.entries()) {
      console.log(pair[0], pair[1]);
    }

    const response = await fetch(
      `${process.env.REACT_APP_URL}/products/newProduct`,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
        body: formDataToSend,
      }
    );

    switch (response.status) {
      case 201:
        navigate("/products");
        break;

      case 400:
        alert("Invalid request");
        break;

      default:
        alert("server error");
        break;
    }
  };
  return (
    <div className="w-[90%] mx-auto">
      <div className="flex flex-row justify-between  space-x-2 space-x-reverse w-full my-8">
        <div className="text-[#1E1B1B] text-lg font-semibold my-auto">
          اطلاعات محصول
        </div>
        <hr className="flex flex-grow my-auto border-[#D9D9D9] " />

        <div
          onClick={() => handleSubmit(onSubmit)()}
          className={`my-auto py-2  rounded-[50px] flex flex-row px-4 cursor-pointer
          ${
            !isValid
              ? "bg-[#D9D9D9] cursor-not-allowed"
              : "bg-[#30AF34] cursor-pointer"
          } `}
        >
          <img
            src={saveLightIcon}
            className="ml-2 w-5 h-5 my-auto brightness-0 invert"
          />
          <span className="whitespace-nowrap text-white">ذخیره اطلاعات</span>
        </div>
        <div
          onClick={() => navigate("/products")}
          className="my-auto bg-[#A60014]  py-2  rounded-[50px] flex flex-row px-4 cursor-pointer"
        >
          <img src={cancelLightIcon} className="ml-2 w-6 h-6 my-auto" />
          <span className="text-[#fff] "> لغو وبازگشت </span>
        </div>
      </div>

      {/* //////sec 1/////////// */}

      <div className="flex flex-row justify-between">
        <div className="w-[30%]">
          <div
            className={`w-full h-[35.8vh] border flex flex-col justify-center 
          items-center border-[#919191] rounded-[10px] overflow-hidden
          ${mainImageError ? "border-[#A60014]" : ""}
          `}
          >
            {previewImages?.mainImagePreview ? (
              <div className="w-full h-full relative">
                <img
                  src={previewImages.mainImagePreview}
                  alt="Main Preview"
                  className="w-full h-full object-contain"
                />

                <div
                  onClick={() => triggerFileInput(mainImageInputRef)}
                  className="absolute bottom-0.5 left-0.5 bg-[#A60014] rounded-[10px] p-2"
                >
                  <img src={editIcon} className="w-6 h-6" />
                </div>
              </div>
            ) : (
              <div onClick={() => triggerFileInput(mainImageInputRef)}>
                <img src={addImgIcon} className="mx-auto mb-2" />
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
              accept="image/*"
              ref={mainImageInputRef}
              style={{ display: "none" }}
              name="mainImage"
              onChange={(e) =>
                handleFileUpload(e, "mainImage", "mainImagePreview")
              }
            />
            {mainImageError && (
              <div className="text-[#A60014] font-bold text-xs mt-1 text-right">
                تصویر اصلی الزامی است
              </div>
            )}
          </div>

          <div className="flex flex-row justify-end mt-5 space-x-4 space-x-reverse">
            <AddProducImage
              previewImage={previewImages.secondImagePreview}
              inputRef={secondImageInputRef}
              handleFileUpload={handleFileUpload}
              fieldName="secondImage"
              previewFieldName="secondImagePreview"
              triggerFileInput={triggerFileInput}
            />
            {previewImages.secondImagePreview && (
              <AddProducImage
                previewImage={previewImages.thirdImagePreview}
                inputRef={thirdImageInputRef}
                handleFileUpload={handleFileUpload}
                fieldName="thirdImage"
                previewFieldName="thirdImagePreview"
                triggerFileInput={triggerFileInput}
              />
            )}
            {previewImages.thirdImagePreview && (
              <AddProducImage
                previewImage={previewImages.fourthImagePreview}
                inputRef={fourthImageInputRef}
                handleFileUpload={handleFileUpload}
                fieldName="fourthImage"
                previewFieldName="fourthImagePreview"
                triggerFileInput={triggerFileInput}
              />
            )}
          </div>
        </div>
        <div className="w-[68%] grid grid-cols-2 gap-x-4">
          <div className="w-full col-span-2 mb-4">
            <div className="text-right text-[#221D23] text-xl leading-[31px] mb-2 ">
              دسته‌بندی محصول
            </div>
            <Select
              // defaultValue={selectedCategory}
              onChange={handleChange}
              options={options}
              value={categoryId}
              hideSelectedOptions={false}
              styles={customStyles}
              components={{ Option }}
              placeholder="انتخاب دسته بندی محصول"
              isClearable
            />
            {!categoryId?.value && (
              <div className="text-[#A60014] text-xs mt-1 text-right">
                لطفا دسته بندی را انتخاب کنید
              </div>
            )}
          </div>

          <div className="w-full mb-4">
            <div className="text-right text-[#221D23] text-xl leading-[31px] mb-2">
              عنوان اصلی محصول
            </div>
            <input
              {...register("mainTitle", {
                required: "عنوان اصلی محصول الزامی است",
                minLength: {
                  value: 3,
                  message: "عنوان اصلی محصول باید حداقل 3 کاراکتر باشد",
                },
              })}
              placeholder="عنوان را وارد کنید"
              className={`bg-[#F7F7F7] rounded-[8px] text-[#919191] w-full p-4 focus:outline-none ${
                errors.mainTitle ? "border border-[#A60014]" : ""
              }`}
            />
            {errors.mainTitle && (
              <div className="text-[#A60014] text-xs mt-1 text-right">
                {errors.mainTitle.message}
              </div>
            )}
          </div>

          <div className="w-full mb-4">
            <div className="text-right  leading-[31px] mb-2 flex flex-row">
              <div className="text-[#221D23] text-xl my-auto">
                عنوان فرعی محصول
              </div>
              <div className="text-[#919191] my-auto text-base">(اختیاری)</div>
              <img src={infoIcon} className="w-6 h-6 my-auto mb-1" />
            </div>
            <input
              {...register("subTitle", {
                required: "عنوان فرعی محصول الزامی است",
                minLength: {
                  value: 3,
                  message: "عنوان فرعی محصول باید حداقل 3 کاراکتر باشد",
                },
              })}
              placeholder="عنوان فرعی محصول را وارد کنید"
              className={`bg-[#F7F7F7] rounded-[8px] text-[#919191] w-full p-4 focus:outline-none ${
                errors.subTitle ? "border border-[#A60014]" : ""
              }`}
            />
            {errors.subTitle && (
              <div className="text-[#A60014] text-xs mt-1 text-right">
                {errors.subTitle.message}
              </div>
            )}
          </div>

          <div className="w-full mb-4">
            <div className="text-right text-[#221D23] text-xl leading-[31px] mb-2 ">
              قیمت محصول
            </div>
            <input
              {...register("price", {
                required: "قیمت محصول الزامی است",
              })}
              placeholder="قیمت را وارد کنید"
              className={`bg-[#F7F7F7] rounded-[8px] text-[#919191] w-full p-4 focus:outline-none ${
                errors.price ? "border border-[#A60014]" : ""
              }`}
              onChange={(e) => {
                const value = e.target.value.replace(/,/g, "");
                if (!isNaN(value) && value.length > 0) {
                  e.target.value = Number(value).toLocaleString();
                }
              }}
            />
            {errors.price && (
              <div className="text-[#A60014] text-xs mt-1 text-right">
                {errors.price.message}
              </div>
            )}
          </div>

          <div className="w-full">
            <div className="text-right text-[#221D23] text-xl leading-[31px] mb-2">
              مقدار تخفیف
            </div>
            <input
              {...register("discount", {
                required: "مقدار تخفیف الزامی است",
              })}
              placeholder="مقدار تخفیف را وارد کنید"
              className={`bg-[#F7F7F7] rounded-[8px] text-[#919191] w-full p-4 focus:outline-none ${
                errors.discount ? "border border-[#A60014]" : ""
              }`}
              onChange={(e) => {
                const value = e.target.value.replace(/,/g, "");
                if (!isNaN(value) && value.length > 0) {
                  e.target.value = Number(value).toLocaleString();
                }
              }}
            />
            {errors.discount && (
              <div className="text-[#A60014] text-xs mt-1 text-right">
                {errors.discount.message}
              </div>
            )}
          </div>

          <div className="w-full mb-4">
            <div className="text-right text-[#221D23] text-xl leading-[31px] mb-2">
              شناسه
            </div>
            <input
              {...register("identifier", {
                required: "شناسه محصول الزامی است",
                minLength: {
                  value: 3,
                  message: "شناسه محصول باید حداقل 3 کاراکتر باشد",
                },
              })}
              placeholder="شناسه محصول را وارد کنید"
              className={`bg-[#F7F7F7] rounded-[8px] text-[#919191] w-full p-4 focus:outline-none ${
                errors.identifier ? "border border-[#A60014]" : ""
              }`}
            />
            {errors.identifier && (
              <div className="text-[#A60014] text-xs mt-1 text-right">
                {errors.identifier.message}
              </div>
            )}
          </div>
          <div className="w-full">
            <div className="text-right text-[#221D23] text-xl leading-[31px] mb-2">
              تعداد محصول
            </div>
            <input
              {...register("count", {
                required: "تعداد محصول الزامی است",
              })}
              placeholder="تعداد محصول را وارد کنید"
              className={`bg-[#F7F7F7] rounded-[8px] text-[#919191] w-full p-4 focus:outline-none ${
                errors.count ? "border border-[#A60014]" : ""
              }`}
            />
            {errors.count && (
              <div className="text-[#A60014] text-xs mt-1 text-right">
                {errors.count.message}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* //////sec 2/////////// */}

      {!showForm ? (
        <>
          <div className="flex flex-row justify-between space-x-2 space-x-reverse w-full my-8">
            <div className="text-[#1E1B1B] text-2xl my-auto">
              متغیرهای محصول
            </div>
            <hr className="flex flex-grow my-auto border-[#D9D9D9]" />
          </div>
          <div className="text-[#6D6F72] text-center leading-8 px-28">
            برای محصولات دارای گزینه‌های قابل انتخاب مثل رنگ، سایز، گارانتی
            و...، می‌تونید تنوع‌های مختلف محصول رو تعریف کنید. برای شروع، روی
            دکمه‌ی «افزودن متغیر جدید» کلیک کنید. افزودن متغیرها اختیاری
            می‌باشد.
          </div>
          <div
            onClick={() => {
              setShowForm(true);
            }}
            className="my-auto py-2 rounded-[50px] flex flex-row w-fit mx-auto px-24 cursor-pointer mt-10 bg-[#A60014]"
          >
            <img
              src={addIcon}
              className="ml-2 w-6 h-6 my-auto invert brightness-0"
            />
            <span className="whitespace-nowrap text-white w-fit mx-auto">
              افزودن متغیر
            </span>
          </div>
        </>
      ) : (
        <AddVariables variables={variables} setVariables={setVariables} />
      )}

      {/* //////sec 2-11/////////// */}

      <div className="flex flex-row justify-between  w-full mt-14 mb-8">
        <div className="text-[#1E1B1B] text-2xl my-auto">توضیحات محصول</div>
        <hr className="w-[85%] my-auto border-[#D9D9D9]" />
      </div>

      <textarea
        {...register("description", {
          required: "توضیحات محصول الزامی است",
        })}
        rows={7}
        placeholder="توضیحات خود را وارد کنید"
        className={`bg-[#F7F7F7] rounded-[8px] text-[#919191] w-full p-4 focus:outline-none ${
          errors.description ? "border border-[#A60014]" : ""
        }`}
      />
      {errors.description && (
        <div className="text-[#A60014] text-xs mt-1 text-right">
          {errors.description.message}
        </div>
      )}

      <ProductSpecifications
        specifications={specifications}
        setSpecifications={setSpecifications}
      />

      <div className="flex flex-row justify-center space-x-3 space-x-reverse">
        <div
          onClick={() => handleSubmit(onSubmit)()}
          className={`py-2 rounded-[50px] flex flex-row justify-center mt-16 mb-12 w-1/3 cursor-pointer
          ${
            !isValid
              ? "bg-[#D9D9D9] cursor-not-allowed"
              : "bg-[#00A67D] cursor-pointer"
          } `}
        >
          <img
            src={saveLightIcon}
            className="ml-2 w-5 h-5 my-auto brightness-0 invert"
          />
          <span className="whitespace-nowrap text-white">ذخیره اطلاعات</span>
        </div>
        <div
          onClick={() => handleSubmit(onSubmit)()}
          className={`py-2 rounded-[50px] border border-[#221D23] flex flex-row justify-center mt-16 mb-12 w-1/3 cursor-pointer
        `}
        >
          <img src={cancelIcon} className="ml-2 w-5 h-5 my-auto" />
          <span className="whitespace-nowrap text-[#221D23]">لغو و بازگشت</span>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
