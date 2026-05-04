import React, { useState, useEffect, useReducer } from "react";
import { useSelector } from "react-redux";

import { useForm } from "react-hook-form";
import moment from "moment-jalaali";
import Select from "react-select";

import modalImage from "../../../../assets/images/modalBack.png";
import CheckCircleIcon from "../../../../assets/images/Check_ring.svg";
import WarningIcon from "../../../../assets/images/error.svg";
import ErrIcon from "../../../../assets/images/error2.svg";

const messages = {
  420: "بازه ی زمانی به درستی انتخاب نشده است .",
  421: "تاریخ شروع و پایان به درستی تنظیم نشده است .",
  422: "ساعت شروع و پایان به درستی تنظیم نشده است.",
  423: "تنظیمات مورد نظر تکراری می باشد .",
};

const daysOptions = [
  { value: "6", label: "شنبه" },
  { value: "0", label: "یکشنبه" },
  { value: "1", label: "دوشنبه" },
  { value: "2", label: "سه‌شنبه" },
  { value: "3", label: "چهارشنبه" },
  { value: "4", label: "پنج‌شنبه" },
  { value: "5", label: "جمعه" },
];

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
    backgroundColor: "#FAF5F5",
    margin: "10px 0",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.18)",
    padding: "10px 20px",
  }),
  option: (provided, state) => ({
    ...provided,
    // borderBottom: state.isLastOption ? "none" : "1px solid #ccc",
  }),
};

const CustomOption = (props) => {
  const { data, isSelected, innerRef, innerProps } = props;

  return (
    <div
      ref={innerRef}
      {...innerProps}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "6px",

        cursor: "pointer",
      }}
    >
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => null}
        style={{ marginLeft: "10px", accentColor: "#A60014" }}
      />
      <label style={{ cursor: "pointer" }}>{data.label}</label>
    </div>
  );
};

const Advanced = () => {
  const _token = useSelector((state) => state.reducer.token);
  const [token, setToken] = useState("");
  const [responseStatus, setResponseStatus] = useState("");

  useEffect(() => {
    setToken(_token);
  }, [_token]);

  useEffect(() => {
    const timer = setTimeout(() => {
      responseStatus !== 200 && responseStatus !== "" && setResponseStatus("");
    }, 4000);

    return () => clearTimeout(timer);
  }, [responseStatus]);

  const [daysOfWeek, setDaysOfWeek] = useState([
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
  ]);

  const selectedOptions = daysOfWeek
    .map((value, index) =>
      value === "1"
        ? daysOptions.find((day) => day.value === index.toString())
        : null
    )
    .filter((option) => option !== null);

  const handleSelectChange = (selected) => {
    const updatedDaysOfWeek = ["0", "0", "0", "0", "0", "0", "0"];
    if (selected) {
      selected.forEach((option) => {
        updatedDaysOfWeek[parseInt(option.value, 10)] = "1";
      });
    }
    setDaysOfWeek(updatedDaysOfWeek);
  };

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isDirty, isValid },
  } = useForm({
    mode: "all",
  });

  const registerOptions = {
    startHour: {
      required: "فیلد  نمی تواند خالی باشد ",
    },
    startMinute: {
      required: "فیلد  نمی تواند خالی باشد ",
    },
    endMinute: {
      required: "فیلد  نمی تواند خالی باشد ",
    },
    endHour: {
      required: "فیلد  نمی تواند خالی باشد ",
    },
    persons: {
      required: "فیلد  نمی تواند خالی باشد ",
    },
    slotDuration: {
      required: "فیلد  نمی تواند خالی باشد ",
    },
    shippingCost: {
      required: "فیلد  نمی تواند خالی باشد ",
      onChange: (e) => {
        const rawValue = e.target.value.replace(/,/g, "");
        if (!isNaN(rawValue)) {
          const formatted = Number(rawValue).toLocaleString();
          e.target.value = formatted;
        }
      },
    },
    startYear: {
      required: "فیلد  نمی تواند خالی باشد ",
    },
    startMonth: {
      required: "فیلد  نمی تواند خالی باشد ",
    },
    startDay: {
      required: "فیلد  نمی تواند خالی باشد ",
    },
    endYear: {
      required: "فیلد  نمی تواند خالی باشد ",
    },
    endMonth: {
      required: "فیلد  نمی تواند خالی باشد ",
    },
    endDay: {
      required: "فیلد  نمی تواند خالی باشد ",
    },
    daysCheckBox: {
      required: "فیلد  نمی تواند خالی باشد ",
    },
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    let response;
    try {
      response = await fetch(
        `${process.env.REACT_APP_URL}/delivery/advanced-config-days-Of-year`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            startHour: getValues("startHour"),
            startMinute: getValues("startMinute"),
            endHour: getValues("endHour"),
            endMinute: getValues("endMinute"),
            persons: getValues("persons"),
            slotDuration: getValues("slotDuration"),
            shippingCost: getValues("shippingCost")?.replace(/,/g, ""),
            startDay: getValues("startDay"),
            startMonth: getValues("startMonth"),
            startYear: getValues("startYear"),
            endDay: getValues("endDay"),
            endMonth: getValues("endMonth"),
            endYear: getValues("endYear"),
            daysOfWeek: daysOfWeek,
          }),
        }
      );
    } catch (error) {
      console.log(error);
    }

    switch (response.status) {
      case 200:
      case 420:
      case 421:
      case 422:
      case 423:
        setResponseStatus(response.status);
        break;
      default:
        setResponseStatus(500);
        break;
    }
  };

  useEffect(() => {
    const listener = (event) => {
      if (event.code === "Enter") {
        event.preventDefault();
        submitHandler(event);
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [submitHandler]);

  return (
    <div className="mx-auto w-full justify-center">
      {messages[responseStatus] && (
        <div className="w-fit text-[#434242] text-sm flex flex-row  fixed top-20 right-[20%] bg-[#FFF099] py-2 pr-14 pl-24  rounded-sm my-auto">
          <img src={WarningIcon} alt="آیکن هشدار" className="my-auto w-6 h-6" />

          <div
            style={{ direction: "rtl" }}
            className="my-auto mr-2 text-[#D76B00]"
          >
            {messages[responseStatus]}
          </div>
        </div>
      )}
      {responseStatus === 500 && (
        <div className="w-fit text-[#434242] text-sm flex flex-row  fixed top-20 right-[20%] bg-[#F9BCBC] py-2 pr-14 pl-24  rounded-sm my-auto">
          <img src={ErrIcon} alt="آیکن هشدار" className="my-auto w-6 h-6" />

          <div
            style={{ direction: "rtl" }}
            className="my-auto mr-2 text-[#940707]"
          >
            خطای سمت سرور ، دوباره تلاش کنید
          </div>
        </div>
      )}

      {responseStatus === 200 && (
        <div
          style={{
            background: `url(${modalImage})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
          className={`font-Peyda rounded-[15px] py-10 px-20 w-1/3 z-30 fixed mx-auto my-auto inset-0 h-fit text-white `}
        >
          <div
            style={{ direction: "rtl" }}
            className="text-center text-[24px] caret-transparent"
          >
            <div className=" w-full mx-auto">
              <img src={CheckCircleIcon} className=" w-20 h-20 mx-auto" />
            </div>
            <p className="pt-3">ثبت عملیات با موفقیت انجام شد</p>
          </div>
          <div
            onClick={() => {
              setResponseStatus("");
            }}
            className="bg-[#FFDA8A] text-[#221D23] text-center text-lg mx-auto py-2 rounded-[50px] cursor-pointer w-44 mt-4"
          >
            بازگشت به پنل
          </div>
        </div>
      )}
      <form
        onSubmit={(e) => {
          handleSubmit(submitHandler(e));
        }}
      >
        <div className="flex flex-row-reverse justify-between space-x-3  my-10 w-full">
          <div className="w-1/3">
            <p className="whitespace-nowrap my-auto  caret-transparent text-right text-xl mb-2">
              بازه زمانی
            </p>
            <input
              className="w-[100%] mx-auto bg-[#F7F7F7] py-4 px-8 text-[#8F8F8F]  text-right outline-none rounded-lg"
              dir="rtl"
              type="number"
              name="slotDuration"
              placeholder="0"
              min="30"
              step={30}
              {...register("slotDuration", registerOptions.slotDuration)}
            />

            {errors.slotDuration && (
              <div className="text-[#A60014] text-xs mt-1 text-right">
                {errors.slotDuration.message}
              </div>
            )}
          </div>

          <div className="w-1/3">
            <div className=" whitespace-nowrap my-auto caret-transparent text-right text-xl mb-2">
              تعداد نفر
            </div>
            <input
              dir="rtl"
              className="w-[100%] mx-auto bg-[#F7F7F7] py-4 px-8 text-[#8F8F8F] text-right outline-none rounded-lg"
              type="number"
              name="persons"
              placeholder="0"
              min="1"
              {...register("persons", registerOptions.persons)}
            />
            {errors.persons && (
              <div className="text-[#A60014] text-xs mt-1 text-right">
                {errors.persons.message}
              </div>
            )}
          </div>

          <div className="w-1/3">
            <div className="whitespace-nowrap my-auto  caret-transparent text-right text-xl mb-2">
              هزینه ارسال
            </div>
            <input
              className="w-[100%] mx-auto bg-[#F7F7F7]  py-4  px-8 text-[#8F8F8F]  text-right outline-none rounded-lg"
              dir="rtl"
              name="shippingCost"
              placeholder="هزینه ارسال را وارد کنید"
              {...register("shippingCost", registerOptions.shippingCost)}
            />
            {errors.shippingCost && (
              <div className="text-[#A60014] text-xs mt-1 text-right">
                {errors.shippingCost.message}
              </div>
            )}
          </div>
        </div>

        <div style={{ direction: "rtl" }} className="w-full my-9">
          <p className="text-right mb-2 w-full caret-transparent text-xl">
            تاریخ شروع نوبت دهی
          </p>

          <div className="flex flex-row-reverse justify-between space-x-3">
            <div
              className={`w-1/3 bg-[#FAF5F5] rounded-lg ${
                errors.startYear && "border border-[#A60014]"
              } `}
            >
              <select
                name="startYear"
                id="year"
                className="w-[95%] mx-auto bg-[#FAF5F5]  p-4  text-[#221D23]  text-right outline-none"
                {...register("startYear", registerOptions.startYear)}
              >
                <option
                  value={moment()
                    .format("jYYYY")
                    .replace(
                      /[۰-۹]/g,
                      (d) => "0123456789"["۰۱۲۳۴۵۶۷۸۹".indexOf(d)]
                    )}
                >
                  {moment().format("jYYYY")}
                </option>
                <option
                  value={moment()
                    .add(1, "year")
                    .format("jYYYY")
                    .replace(
                      /[۰-۹]/g,
                      (d) => "0123456789"["۰۱۲۳۴۵۶۷۸۹".indexOf(d)]
                    )}
                >
                  {moment().add(1, "year").format("jYYYY")}
                </option>
              </select>
            </div>

            <div
              className={`w-1/3 bg-[#FAF5F5] rounded-lg ${
                errors.startMonth && "border border-[#A60014]"
              } `}
            >
              <select
                name="startMonth"
                className="w-[95%] mx-auto bg-[#FAF5F5] p-4 text-[#221D23] text-right outline-none"
                {...register("startMonth", registerOptions.startMonth)}
              >
                <option value="">ماه</option>
                {[
                  "فروردین",
                  "اردیبهشت",
                  "خرداد",
                  "تیر",
                  "مرداد",
                  "شهریور",
                  "مهر",
                  "آبان",
                  "آذر",
                  "دی",
                  "بهمن",
                  "اسفند",
                ].map((month, index) => (
                  <option key={index} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            <div
              className={`w-1/3 bg-[#FAF5F5] rounded-lg ${
                errors.startDay && "border border-[#A60014]"
              } `}
            >
              <select
                name="startDay"
                id="day"
                className="w-[95%] mx-auto bg-[#FAF5F5] p-4 text-[#221D23] text-right outline-none"
                {...register("startDay", registerOptions.startDay)}
              >
                <option value="">روز</option>
                {Array.from({ length: 31 }, (_, index) => (
                  <option key={index + 1} value={index + 1}>
                    {index + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div style={{ direction: "rtl" }} className="w-full ">
          <p className="text-right mb-2 w-full caret-transparent text-xl">
            تاریخ پایان نوبت دهی
          </p>

          <div className="flex flex-row-reverse justify-between space-x-3">
            <div
              className={`w-1/3 bg-[#FAF5F5] rounded-lg ${
                errors.endYear && "border border-[#A60014]"
              } `}
            >
              <select
                name="endYear"
                id="endYear"
                className="w-[95%] mx-auto bg-[#FAF5F5]  p-4  text-[#221D23]  text-right outline-none"
                {...register("endYear", registerOptions.endYear)}
              >
                <option
                  value={moment()
                    .format("jYYYY")
                    .replace(
                      /[۰-۹]/g,
                      (d) => "0123456789"["۰۱۲۳۴۵۶۷۸۹".indexOf(d)]
                    )}
                >
                  {moment().format("jYYYY")}
                </option>
                <option
                  value={moment()
                    .add(1, "year")
                    .format("jYYYY")
                    .replace(
                      /[۰-۹]/g,
                      (d) => "0123456789"["۰۱۲۳۴۵۶۷۸۹".indexOf(d)]
                    )}
                >
                  {moment().add(1, "year").format("jYYYY")}
                </option>
              </select>
            </div>

            <div
              className={`w-1/3 bg-[#FAF5F5] rounded-lg ${
                errors.endMonth && "border border-[#A60014]"
              } `}
            >
              <select
                name="endMonth"
                id="endMonth"
                className="w-[95%] mx-auto bg-[#FAF5F5] p-4 text-[#221D23] text-right outline-none"
                {...register("endMonth", registerOptions.endMonth)}
              >
                <option value="">ماه</option>
                {[
                  "فروردین",
                  "اردیبهشت",
                  "خرداد",
                  "تیر",
                  "مرداد",
                  "شهریور",
                  "مهر",
                  "آبان",
                  "آذر",
                  "دی",
                  "بهمن",
                  "اسفند",
                ].map((month, index) => (
                  <option key={index + 1} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            <div
              className={`w-1/3 bg-[#FAF5F5] rounded-lg ${
                errors.endDay && "border border-[#A60014]"
              } `}
            >
              <select
                name="endDay"
                id="endDay"
                className="w-[95%] mx-auto bg-[#FAF5F5] p-4 text-[#221D23] text-right outline-none"
                {...register("endDay", registerOptions.endDay)}
              >
                <option value="">روز</option>
                {Array.from({ length: 31 }, (_, index) => (
                  <option key={index + 1} value={index + 1}>
                    {index + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className=" w-full flex flex-row justify-between space-x-3 space-x-reverse my-9">
          <div className="w-1/3">
            <p className="text-right mb-2 w-full caret-transparent text-xl">
              ساعت شروع
            </p>

            <div className="w-full flex flex-row-reverse justify-between space-x-3 ">
              <div
                className={`w-1/2 bg-[#FAF5F5] rounded-lg pl-1 ${
                  errors.startHour && "border border-[#A60014]"
                } `}
              >
                <select
                  name="startHour"
                  id="startHour"
                  dir="rtl"
                  className="w-[95%] mx-auto bg-[#FAF5F5] p-4 text-[#221D23] text-right outline-none"
                  {...register("startHour", registerOptions.startHour)}
                >
                  <option value="">ساعت</option>
                  {[
                    { label: "صبح", hours: [9, 10, 11, 12] },
                    { label: "عصر", hours: [13, 14, 15, 16, 17] },
                  ].map((group, index) => (
                    <optgroup key={index} label={group.label}>
                      {group.hours.map((hour) => (
                        <option key={hour} value={hour}>
                          {hour > 12 ? hour - 12 : hour}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div
                className={`w-1/2 bg-[#FAF5F5] rounded-lg pl-1 ${
                  errors.startMinute && "border border-[#A60014]"
                } `}
              >
                <select
                  name="startMinute"
                  id="startMinute"
                  dir="rtl"
                  className="w-[95%] mx-auto bg-[#FAF5F5]  p-4  text-[#221D23]  text-right outline-none"
                  {...register("startMinute", registerOptions.startMinute)}
                >
                  <option value="">دقیقه</option>

                  <option value="00">00</option>
                  <option value="30">30</option>
                </select>
              </div>
            </div>
          </div>

          <div className="w-1/3">
            <p className="text-right mb-2 w-full caret-transparent text-xl">
              ساعت پایان
            </p>

            <div className="flex flex-row-reverse justify-between space-x-3 w-full">
              <div
                className={`w-full bg-[#FAF5F5] rounded-lg pl-1 ${
                  errors.endHour && "border border-[#A60014]"
                } `}
              >
                <select
                  name="endHour"
                  id="endHour"
                  dir="rtl"
                  className="w-[95%] mx-auto bg-[#FAF5F5] p-4 text-[#221D23] text-right outline-none"
                  {...register("endHour", registerOptions.endHour)}
                >
                  <option value="">ساعت</option>
                  {[
                    { label: "صبح", hours: [9, 10, 11, 12] },
                    { label: "عصر", hours: [13, 14, 15, 16, 17] },
                  ].map((group, index) => (
                    <optgroup key={index} label={group.label}>
                      {group.hours.map((hour) => (
                        <option key={hour} value={hour}>
                          {hour > 12 ? hour - 12 : hour}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div
                className={`w-full bg-[#FAF5F5] rounded-lg pl-1 ${
                  errors.endMinute && "border border-[#A60014]"
                } `}
              >
                <select
                  name="endMinute"
                  id="endMinute"
                  dir="rtl"
                  className="w-[95%] mx-auto bg-[#FAF5F5]  p-4  text-[#221D23]  text-right outline-none"
                  {...register("endMinute", registerOptions.endMinute)}
                >
                  <option value="">دقیقه</option>
                  <option value="00">00</option>
                  <option value="30">30</option>
                </select>
              </div>
            </div>
          </div>

          <div className="w-1/3">
            <p
              style={{ direction: "rtl" }}
              className="text-right mb-2 text-xl font-normal"
            >
              تکرار برای روزهای
            </p>

            <Select
              styles={customStyles}
              components={{ Option: CustomOption }}
              options={daysOptions}
              isMulti
              hideSelectedOptions={false}
              closeMenuOnSelect={false}
              value={selectedOptions}
              placeholder="روزها را انتخاب کنید"
              onChange={handleSelectChange}
            />

            {selectedOptions?.length === 0 && (
              <div className="text-[#A60014] text-xs mt-1 text-right">
                لطفا روزها را انتخاب کنید
              </div>
            )}
          </div>
        </div>

        <div className="mt-40">
          <input
            type="submit"
            value="ذخیره"
            className="w-full rounded-[50px] py-2 bg-[#A60014] text-centerp-2 cursor-pointer text-white text-lg
              disabled:bg-[#D9D9D9] disabled:cursor-not-allowed disabled:text-[#919191] "
            disabled={!isDirty || !isValid || selectedOptions?.length === 0}
          />
        </div>
      </form>
    </div>
  );
};

export default Advanced;
