import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Select from "react-select";
import { useForm } from "react-hook-form";

import EditProducImage from "./edit-product-image";
import saveIcon from "../../../../../assets/images/Check_ring-gray.svg";
import editIcon from "../../../../../assets/images/Edit-profile.svg";
import infoIcon from "../../../../../assets/images/Info.svg";
import EditVariables from "./edit-variables";
import ProductSpecifications from "./edit-specifications";

// Image preloading utility
const preloadImage = (src) => {
  if (!src) return;
  const img = new Image();
  img.src = src;
};

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

const EditProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const _prodId = location?.state?.id;

  const [variables, setVariables] = useState([
    { key: "", items: ["", "", "", "", ""] },
  ]);

  const [specifications, setSpecifications] = useState([
    { key: "", value: "", selected: false },
    { key: "", value: "", selected: false },
    { key: "", value: "", selected: false },
    { key: "", value: "", selected: false },
  ]);

  const mainImageInputRef = useRef(null);
  const secondImageInputRef = useRef(null);
  const thirdImageInputRef = useRef(null);
  const fourthImageInputRef = useRef(null);

  const _token = useSelector((state) => state.reducer.token);
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [categoryId, setCategoryId] = useState(null);
  const [subCategories, setSubCategories] = useState([]);

  const [previewImages, setPreviewImages] = useState({
    mainImagePreview: null,
    secondImagePreview: null,
    thirdImagePreview: null,
    fourthImagePreview: null,
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
      category: "",
    },
  });

  useEffect(() => {
    setToken(_token);
  }, [_token]);

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

  useEffect(() => {
    const _editProduct = async () => {
      setIsLoading(true);
      let _response, _data;
      _response = await fetch(
        `${process.env.REACT_APP_URL}/products/getProductById/${_prodId}`,
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

          if (_data?.data?.ProductVariables?.length) {
            const transformed = _data?.data?.ProductVariables.map((v) => ({
              key: v.variable,
              items: v.ProductVariableItems.map((item) => item?.value),
            }));

            setVariables(transformed);
          }

          if (_data?.data?.ProductSpecifications) {
            const transformed = _data?.data?.ProductSpecifications.map((s) => ({
              key: s.key,
              value: s.value,
              selected: s.selected,
            }));

            setSpecifications(transformed);
          }
          setValue("mainTitle", _data?.data?.mainTitle);
          setValue("category", _data?.data?.categoryId);
          setValue("identifier", _data?.data?.identifier);
          setValue("subTitle", _data?.data?.subTitle);
          setValue("mainImage", _data?.data?.mainImage);
          setValue(
            "secondImage",
            _data?.data?.ProductImages[0]?.secondImage
              ? _data?.data?.ProductImages[0]?.secondImage
              : null
          );
          setValue(
            "thirdImage",
            _data?.data?.ProductImages[0]?.thirdImage
              ? _data?.data?.ProductImages[0]?.thirdImage
              : null
          );
          setValue(
            "fourthImage",
            _data?.data?.ProductImages[0]?.fourthImage
              ? _data?.data?.ProductImages[0]?.fourthImage
              : null
          );
          setValue("description", _data?.data?.description);
          setValue("price", _data?.data?.price?.toLocaleString());
          setValue("discount", _data?.data?.discount?.toLocaleString());
          setValue("count", _data?.data?.count);

          // Preload images
          if (_data?.data?.mainImage) {
            const mainImageUrl = `${
              process.env.REACT_APP_URL
            }/uploads/product/${_data.data.mainImage
              .replace(/\\/g, "/")
              .split("/")
              .pop()}`;
            preloadImage(mainImageUrl);
          }

          if (_data?.data?.ProductImages?.[0]?.secondImage) {
            const secondImageUrl = `${
              process.env.REACT_APP_URL
            }/uploads/product/${_data.data.ProductImages[0].secondImage
              .replace(/\\/g, "/")
              .split("/")
              .pop()}`;
            preloadImage(secondImageUrl);
          }

          if (_data?.data?.ProductImages?.[0]?.thirdImage) {
            const thirdImageUrl = `${
              process.env.REACT_APP_URL
            }/uploads/product/${_data.data.ProductImages[0].thirdImage
              .replace(/\\/g, "/")
              .split("/")
              .pop()}`;
            preloadImage(thirdImageUrl);
          }

          if (_data?.data?.ProductImages?.[0]?.fourthImage) {
            const fourthImageUrl = `${
              process.env.REACT_APP_URL
            }/uploads/product/${_data.data.ProductImages[0].fourthImage
              .replace(/\\/g, "/")
              .split("/")
              .pop()}`;
            preloadImage(fourthImageUrl);
          }

          setIsLoading(false);
          break;

        default:
          setIsLoading(false);
          break;
      }
    };

    token && _prodId && _editProduct();
  }, [token, _prodId, setValue, getValues]);

  const handleFileUpload = (e, fieldName, previewFieldName) => {
    const file = e.target.files[0];
    if (file) {
      setValue(fieldName, file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewImages({
        ...previewImages,
        [previewFieldName]: objectUrl,
      });

      // Preload the new image
      preloadImage(objectUrl);
    }
  };

  const triggerFileInput = (inputRef) => {
    inputRef.current.click();
  };

  const onSubmit = async (data) => {
    let response;

    const formDataToSend = new FormData();

    let _specifications = specifications.filter(
      (item) => item.key !== "" || item.value !== ""
    );
    let _variables = variables.map((variable) => ({
      ...variable,
      items: variable.items.filter((item) => item !== ""),
    }));

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
    formDataToSend.append("price", data.price?.replace(/,/g, ""));
    formDataToSend.append("count", data.count);
    formDataToSend.append("discount", data.discount?.replace(/,/g, ""));
    formDataToSend.append("identifier", data.identifier);
    formDataToSend.append("description", data.description);
    formDataToSend.append("category", categoryId?.value || data.category);

    if (data.mainImage) formDataToSend.append("mainImage", data.mainImage);
    if (data?.secondImage)
      formDataToSend?.append("secondImage", data.secondImage);
    if (data.thirdImage) formDataToSend?.append("thirdImage", data.thirdImage);
    if (data?.fourthImage)
      formDataToSend.append("fourthImage", data.fourthImage);

    // for (let pair of formDataToSend.entries()) {
    //   console.log(pair[0], pair[1]);
    // }

    try {
      response = await fetch(
        `${process.env.REACT_APP_URL}/products/${_prodId}`,

        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );
    } catch (error) {
      // setResponseStatus(500);
    }

    switch (response?.status) {
      case 200:
        navigate("/products");

        break;
      case 500:
        // setResponseStatus(500);
        alert('server error')
        break;
      default:
        // setResponseStatus(500);
        break;
    }
  };

  const handleChange = (option) => {
    setCategoryId(option);
  };

  return (
    <div className="w-[90%] mx-auto">
      <div className="flex flex-row justify-between   w-full my-8">
        <div className="text-[#1E1B1B] text-lg font-semibold my-auto">
          اطلاعات محصول
        </div>
        <hr className="flex flex-grow my-auto border-[#D9D9D9] mx-4 " />

        <div
          onClick={() => handleSubmit(onSubmit)()}
          className={`my-auto  py-2  rounded-[50px] flex flex-row px-16 cursor-pointer
          ${
            !isValid
              ? "bg-[#D9D9D9] cursor-not-allowed"
              : "bg-[#A60014] cursor-pointer"
          } `}
        >
          <img src={saveIcon} className="ml-2 brightness-0 invert" />
          <span className="text-[#fff]">ویرایش اطلاعات </span>
        </div>
      </div>

      {/* //////sec 1/////////// */}

      <div className="flex flex-row justify-between">
        <div className="w-[30%]">
          <div className="w-full h-[35.8vh] border flex flex-col justify-center items-center border-[#919191] rounded-[10px] overflow-hidden">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A60014]"></div>
              </div>
            ) : previewImages?.mainImagePreview ? (
              <div className="w-full h-full relative ">
                <img
                  src={previewImages.mainImagePreview}
                  alt="Main Preview"
                  className="w-full h-full object-contain"
                  loading="eager"
                />

                <div
                  onClick={() => triggerFileInput(mainImageInputRef)}
                  className="absolute bottom-0.5 left-0.5 bg-[#A60014] rounded-[10px] p-2"
                >
                  <img src={editIcon} className="w-6 h-6" alt="Edit Icon" />
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full">
                <img
                  src={`${
                    process.env.REACT_APP_URL
                  }/uploads/product/${getValues("mainImage")
                    ?.replace(/\\/g, "/")
                    ?.split("/")
                    ?.pop()}`}
                  className="mx-auto w-full h-full object-contain"
                  loading="eager"
                  alt="Main Product Image"
                />

                <div
                  onClick={() => triggerFileInput(mainImageInputRef)}
                  className="absolute bottom-0.5 left-0.5 bg-[#A60014] rounded-[10px] p-2"
                >
                  <img src={editIcon} className="w-6 h-6" alt="Edit Icon" />
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

          <div className="flex flex-row justify-end mt-5 space-x-4 space-x-reverse">
            <EditProducImage
              id={_prodId}
              previewImage={previewImages.secondImagePreview}
              inputRef={secondImageInputRef}
              handleFileUpload={handleFileUpload}
              fieldName="secondImage"
              previewFieldName="secondImagePreview"
              triggerFileInput={triggerFileInput}
              image={getValues("secondImage")}
              isLoading={isLoading}
            />

            {(getValues("secondImage") || previewImages.secondImagePreview) && (
              <EditProducImage
                id={_prodId}
                previewImage={previewImages.thirdImagePreview}
                inputRef={thirdImageInputRef}
                handleFileUpload={handleFileUpload}
                fieldName="thirdImage"
                previewFieldName="thirdImagePreview"
                triggerFileInput={triggerFileInput}
                image={getValues("thirdImage")}
                isLoading={isLoading}
              />
            )}

            {(previewImages.thirdImagePreview || getValues("thirdImage")) && (
              <EditProducImage
                id={_prodId}
                previewImage={previewImages.fourthImagePreview}
                inputRef={fourthImageInputRef}
                handleFileUpload={handleFileUpload}
                fieldName="fourthImage"
                previewFieldName="fourthImagePreview"
                triggerFileInput={triggerFileInput}
                image={getValues("fourthImage")}
                isLoading={isLoading}
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
              defaultValue={categoryId}
              onChange={handleChange}
              options={options}
              // value={categoryId}
              hideSelectedOptions={false}
              styles={customStyles}
              components={{ Option }}
              placeholder="انتخاب دسته بندی محصول"
              isClearable
            />
          </div>
          <div className="w-full">
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
            {/* <div className="text-right text-[#221D23] text-xl leading-[31px] mb-2">
              مدل محصول
            </div> */}
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
              placeholder=" عنوان فرعی محصول را وارد کنید"
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

          <div className="w-full">
            <div className="text-right text-[#221D23] text-xl leading-[31px] mb-2 ">
              قیمت محصول
            </div>
            <input
              {...register("price", {
                required: "قیمت محصول الزامی است",
              })}
              onChange={(e) => {
                const value = e.target.value.replace(/,/g, "");
                if (!isNaN(value) && value.length > 0) {
                  e.target.value = Number(value).toLocaleString();
                }
              }}
              placeholder="قیمت را وارد کنید"
              className={`bg-[#F7F7F7] rounded-[8px] text-[#919191] w-full p-4 focus:outline-none ${
                errors.price ? "border border-[#A60014]" : ""
              }`}
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

          <div className="w-full">
            <div className="text-right text-[#221D23] text-xl leading-[31px] mb-2 ">
              شناسه محصول
            </div>
            <input
              {...register("identifier", {
                required: " شناسه محصول الزامی است",
                minLength: {
                  value: 3,
                  message: " شناسه محصول باید حداقل 3 کاراکتر باشد",
                },
              })}
              placeholder=" شناسه محصول را وارد کنید"
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
              تعداد
            </div>
            <input
              {...register("count", {
                required: "تعداد محصول الزامی است",
              })}
              placeholder="قیمت نهایی را وارد کنید"
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

      {/* ??????????????????????????????????? */}
      <EditVariables variables={variables} setVariables={setVariables} />

      <ProductSpecifications
        specifications={specifications}
        setSpecifications={setSpecifications}
      />

      {/* ??????????????????????????????????? */}

      {/* //////sec 2/////////// */}

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
    </div>
  );
};

export default EditProduct;
