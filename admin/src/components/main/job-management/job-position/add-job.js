import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";
import axios from "axios";
import Select from "react-select";
import { useForm } from "react-hook-form";

import WarningIcon from "../../../../assets/images/error.svg";
import saveIcon from "../../../../assets/images/Check_ring-gray.svg";
import CheckCircleIcon from "../../../../assets/images/Check_ring.svg";
import modalImage from "../../../../assets/images/modalBack.png";

const Option = (props) => {
  const { isSelected, label, innerRef, innerProps } = props;

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

const AddJob = () => {
  const navigate = useNavigate();
  const [responseStatus, setResponseStatus] = useState(0);

  const _token = useSelector((state) => state.reducer.token);
  const [token, setToken] = useState("");

  const [categories, setCategories] = useState([]);
  const [militaryServiceTypes, setMilitaryServiceTypes] = useState([]);
  const [employmentTypes, setEmploymentTypes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedEmploymentType, setSelectedEmploymentType] = useState(null);
  const [selectedMilitaryServiceType, setSelectedMilitaryServiceType] =
    useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "all",
    defaultValues: {
      title: "",
      minSalary: "",
      duties: "",
      workExperience: "",
      educationRequirement: "",
    },
  });

  useEffect(() => {
    setToken(_token);
  }, [_token]);

  const onSubmit = async (data) => {
    let response;

    try {
      response = await axios.post(
        `${process.env.REACT_APP_URL}/jobs/add-job`,
        {
          title: data.title,
          minSalary: data.minSalary?.replace(/,/g, ""),
          categoryId: selectedCategory?.value,
          employmentId: selectedEmploymentType?.value,
          duties: data.duties,
          workExperience: data.workExperience,
          educationRequirement: data.educationRequirement,
          gender: selectedGender.value,
          militaryService: selectedMilitaryServiceType.value,
        },
        {
          timeout: 10000,
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
    const timer = setTimeout(() => {
      responseStatus !== 201 && responseStatus !== 0 && setResponseStatus(0);
    }, 4000);
    return () => clearTimeout(timer);
  }, [responseStatus]);

  const genderOptions = [
    { value: 0, label: "خانم" },
    { value: 1, label: "آقا" },
    { value: 2, label: "مهم نیست" },
  ];

  const genderhandleChange = (selectedOption) => {
    setSelectedGender(selectedOption);
  };

  useEffect(() => {
    const _militaryServices = async () => {
      const _response = await fetch(
        `${process.env.REACT_APP_URL}/military-service`,
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
          setMilitaryServiceTypes(data?.data);
          break;

        default:
          break;
      }
    };

    token && _militaryServices();
  }, [token, setMilitaryServiceTypes]);

  const militaryOptions = militaryServiceTypes?.map((item) => ({
    value: item.id,
    label: item.type,
  }));

  const militaryHandleChange = async (option) => {
    setSelectedMilitaryServiceType(option);
  };

  useEffect(() => {
    const _empTypes = async () => {
      const _response = await fetch(
        `${process.env.REACT_APP_URL}/employment-type`,
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
          setEmploymentTypes(data?.data);
          break;

        default:
          break;
      }
    };

    token && _empTypes();
  }, [token, setEmploymentTypes]);

  const empOptions = employmentTypes?.map((item) => ({
    value: item.id,
    label: item.type,
  }));

  const empHandleChange = async (option) => {
    setSelectedEmploymentType(option);
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
    <div className="w-[90%] mx-auto">
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
            اطلاعات شغل مورد نظر
          </div>
        )}
        <hr className="w-[68%] my-auto border-[#D9D9D9]" />
        <div
          onClick={() => handleSubmit(onSubmit)()}
          className={`my-auto  py-2  rounded-[50px] flex flex-row px-16 
            ${
              !isValid ||
              !selectedCategory?.value ||
              !selectedEmploymentType?.value ||
              !selectedMilitaryServiceType?.value ||
              !selectedGender
                ? "bg-[#D9D9D9] cursor-not-allowed"
                : "bg-[#A60014] cursor-pointer"
            }
            `}
        >
          <img
            src={saveIcon}
            className={` ml-2 ${
              isValid &&
              selectedCategory?.value &&
              selectedEmploymentType?.value &&
              selectedMilitaryServiceType?.value &&
              selectedGender &&
              "brightness-0 invert"
            } `}
          />
          <span
            className={`whitespace-nowrap ${
              !isValid ||
              !selectedCategory?.value ||
              !selectedEmploymentType?.value ||
              !selectedMilitaryServiceType?.value ||
              !selectedGender
                ? "text-[#919191]"
                : "text-white"
            } `}
          >
            بارگذاری شغل
          </span>
        </div>
      </div>

      {/* ////////////////////////////////// */}
      <div className="grid grid-cols-2 gap-x-3">
        <div className="w-full mb-5">
          <div className="text-right text-[#221D23] leading-[31px] mb-2 text-xl">
            عنوان آگهی
          </div>

          <input
            {...register("title", {
              required: "عنوان آگهی الزامی است",
              minLength: {
                value: 3,
                message: "عنوان آگهی باید حداقل 3 کاراکتر باشد",
              },
            })}
            placeholder="انتخاب عنوان شغلی مناسب، مثلا: طراح گرافیک"
            className={`bg-[#F7F7F7] text-[#8F8F8F] w-full p-4 rounded-[8px] focus:outline-none  ${
              errors.title ? "border border-[#A60014]" : ""
            }`}
          />
          {errors.title && (
            <div className="text-[#A60014] text-xs mt-1 text-right">
              {errors.title.message}
            </div>
          )}
        </div>

        <div className="mb-5">
          <div className="text-right text-[#221D23] leading-[31px] mb-2 text-xl">
            حداقل حقوق
          </div>

          <input
            {...register("minSalary", {
              required: "حداقل حقوق الزامی است",
            })}
            onChange={(e) => {
              const value = e.target.value.replace(/,/g, "");
              if (!isNaN(value) && value.length > 0) {
                e.target.value = Number(value).toLocaleString("en-US");
              }
            }}
            placeholder="حداقل حقوق را وارد کنید"
            className={`bg-[#F7F7F7] text-[#8F8F8F] w-full p-4 rounded-[8px] focus:outline-none  ${
              errors.minSalary ? "border border-[#A60014]" : ""
            }`}
          />
          {errors.minSalary && (
            <div className="text-[#A60014] text-xs mt-1 text-right">
              {errors.minSalary.message}
            </div>
          )}
        </div>
      </div>

      {/* /////////////////////////////////// */}
      <div className="grid grid-cols-2 gap-x-2">
        <div className="w-full mb-5">
          <div className="text-[#221D23] text-right mb-1 leading-[31px] ">
            دسته‌بندی شغلی
          </div>
          <Select
            defaultValue={selectedCategory}
            onChange={handleChange}
            options={options}
            value={selectedCategory}
            hideSelectedOptions={false}
            styles={customStyles}
            components={{ Option }}
            placeholder="انتخاب دسته بندی شغلی"
            isClearable
          />
          {!selectedCategory?.value && (
            <div className="text-[#A60014] text-xs mt-1 text-right">
              لطفا دسته بندی را انتخاب کنید
            </div>
          )}
        </div>
        <div className="w-full mb-5">
          <div className="text-[#221D23] text-right mb-1 leading-[31px] ">
            نوع همکاری
          </div>
          <Select
            defaultValue={selectedEmploymentType}
            onChange={empHandleChange}
            options={empOptions}
            value={selectedEmploymentType}
            hideSelectedOptions={false}
            styles={customStyles}
            components={{ Option }}
            placeholder="انتخاب نوع همکاری"
            isClearable
          />
          {!selectedEmploymentType?.value && (
            <div className="text-[#A60014] text-xs mt-1 text-right">
              لطفا نوع همکاری را انتخاب کنید
            </div>
          )}
        </div>
      </div>

      <div className="w-full mb-5">
        <div className="text-right text-[#221D23] leading-[31px] mb-2 text-xl">
          شرح شغل / مسئولیت‌ها
        </div>
        <textarea
          {...register("duties", {
            required: "شرح شغل الزامی است",
          })}
          rows={6}
          placeholder="متن مورد نظر را وارد کنید"
          className={`bg-[#F7F7F7] text-[#8F8F8F] w-full p-4 rounded-[8px] focus:outline-none  ${
            errors.duties ? "border border-[#A60014]" : ""
          }`}
        />
        {errors.duties && (
          <div className="text-[#A60014] text-xs mt-1 text-right">
            {errors.duties.message}
          </div>
        )}
      </div>

      {/* ///////////////////////////////////////// */}
      <div className="flex flex-grow space-x-4 space-x-reverse justify-between  w-full mb-5">
        <div className="text-[#1E1B1B] text-lg font-semibold my-auto whitespace-nowrap">
          توضیحات تکمیلی
        </div>
        <hr className="w-full my-auto border-[#D9D9D9]" />
      </div>

      {/* /////////////////////////////////////////////// */}
      <div className="grid grid-cols-2 gap-x-3">
        <div className="w-full mb-5">
          <div className="text-right text-[#221D23] leading-[31px] mb-2 text-xl">
            سابقه کار مرتبط
          </div>
          <input
            {...register("workExperience", {
              required: "سابقه کار مرتبط الزامی است",
            })}
            placeholder="حداقل سابقه کار مورد نظر خود را وارد کنید"
            className={`bg-[#F7F7F7] text-[#8F8F8F] w-full p-4 rounded-[8px] focus:outline-none  ${
              errors.workExperience ? "border border-[#A60014]" : ""
            }`}
          />
          {errors.workExperience && (
            <div className="text-[#A60014] text-xs mt-1 text-right">
              {errors.workExperience.message}
            </div>
          )}
        </div>

        <div className="mb-5">
          <div className="text-right text-[#221D23] leading-[31px] mb-2 text-xl">
            حداقل مدرک تحصیلی مورد نیاز
          </div>
          <input
            {...register("educationRequirement", {
              required: "حداقل مدرک تحصیلی مورد نیاز الزامی است",
            })}
            placeholder="حداقل مدرک تحصیلی مورد نظر خود را وارد کنید"
            className={`bg-[#F7F7F7] text-[#8F8F8F] w-full p-4 rounded-[8px] focus:outline-none  ${
              errors.educationRequirement ? "border border-[#A60014]" : ""
            }`}
          />
          {errors.educationRequirement && (
            <div className="text-[#A60014] text-xs mt-1 text-right">
              {errors.educationRequirement.message}
            </div>
          )}
        </div>
      </div>
      {/* /////////////////////////////////////////////// */}

      <div className="grid grid-cols-2 gap-x-2 mb-40">
        <div className="w-full">
          <div className="text-[#221D23] text-right mb-1 leading-[31px] ">
            جنسیت
          </div>
          <Select
            hideSelectedOptions={false}
            styles={customStyles}
            components={{ Option }}
            placeholder="انتخاب جنسیت مورد نیاز"
            options={genderOptions}
            value={selectedGender}
            onChange={genderhandleChange}
            isClearable
          />
          {!selectedGender && (
            <div className="text-[#A60014] text-xs mt-1 text-right">
              لطفا جنسیت را انتخاب کنید
            </div>
          )}
        </div>
        <div className="w-full">
          <div className="text-[#221D23] text-right mb-1 leading-[31px] ">
            وضعیت خدمت سربازی
          </div>
          <Select
            defaultValue={selectedMilitaryServiceType}
            onChange={militaryHandleChange}
            options={militaryOptions}
            value={selectedMilitaryServiceType}
            hideSelectedOptions={false}
            styles={customStyles}
            components={{ Option }}
            placeholder="انتخاب وضعیت خدمت سربازی"
            isClearable
          />
          {!selectedMilitaryServiceType?.value && (
            <div className="text-[#A60014] text-xs mt-1 text-right">
              لطفا وضعیت خدمت سربازی را انتخاب کنید
            </div>
          )}
        </div>
      </div>
      {/* /////////////////////////////////////////////// */}

      <div
        onClick={() => handleSubmit(onSubmit)()}
        className={`my-auto  py-2  rounded-[50px] flex flex-row px-16 justify-center items-center
            ${
              !isValid ||
              !selectedCategory?.value ||
              !selectedEmploymentType?.value ||
              !selectedMilitaryServiceType?.value ||
              !selectedGender
                ? "bg-[#D9D9D9] cursor-not-allowed"
                : "bg-[#A60014] cursor-pointer"
            }
            `}
      >
        <img
          src={saveIcon}
          className={`ml-2 ${
            isValid &&
            selectedCategory?.value &&
            selectedEmploymentType?.value &&
            selectedMilitaryServiceType?.value &&
            selectedGender &&
            "brightness-0 invert"
          } `}
        />
        <span
          className={`whitespace-nowrap  ${
            !isValid ||
            !selectedCategory?.value ||
            !selectedEmploymentType?.value ||
            !selectedMilitaryServiceType?.value ||
            !selectedGender
              ? "text-[#919191]"
              : "text-white"
          } `}
        >
          بارگذاری شغل
        </span>
      </div>

      {/* /////////////////////////////////////////////// */}

      <div className={`${responseStatus === 201 && " relative"} `}>
        {responseStatus === 201 &&
          ReactDOM.createPortal(
            <div>
              <div
                className="w-full h-full bg-[#4c4c4c] opacity-60 fixed top-0 left-0 z-20"
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
                  موقعیت شغلی با موفقیت اضافه شد .
                </div>

                <div
                  onClick={() => {
                    setResponseStatus(0);
                    navigate("/job-positions");
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

export default AddJob;
