import React, { useReducer, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import moment from "moment-jalaali";

import modalImage from "../../../../assets/images/modalBack.png";
import CheckCircleIcon from "../../../../assets/images/Check_ring.svg";
import WarningIcon from "../../../../assets/images/error.svg";
import ErrIcon from "../../../../assets/images/error2.svg";

const messages = {
  420: "روز تحویل به درستی تنظیم نشده است .",
  421: "ساعت شروع و پایان به درستی تنظیم نشده است.",
  422: "تنظیمات مورد نظر تکراری می باشد .",
};

const Daily = () => {
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
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isDirty, isValid },
  } = useForm({
    mode: "all",
  });
  const handleError = (errors) => {
    console.log(errors);
  };

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
    year: {
      required: "فیلد  نمی تواند خالی باشد ",
    },
    month: {
      required: "فیلد  نمی تواند خالی باشد ",
    },
    day: {
      required: "فیلد  نمی تواند خالی باشد ",
    },
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    let response;
    try {
      response = await fetch(
        `${process.env.REACT_APP_URL}/delivery/config-days-Of-year`,
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
            year: getValues("year"),
            month: getValues("month"),
            day: getValues("day"),
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
    <div className="">
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

      <div className="w-full mx-auto ">
        <form
          onSubmit={(e) => {
            handleSubmit(submitHandler(e), handleError);
          }}
        >
          <div className="flex flex-row-reverse justify-between space-x-3  my-10 w-full">
            <div className="w-1/3 ">
              <div className="whitespace-nowrap my-auto  caret-transparent text-right text-xl mb-2">
                تعداد نفر
              </div>

              <input
                dir="rtl"
                className="w-[100%] mx-auto bg-[#F7F7F7]  py-4  px-8 text-[#8F8F8F]  text-right outline-none rounded-lg"
                type="number"
                name="persons"
                placeholder="1"
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
              <div className=" whitespace-nowrap my-auto  caret-transparent text-right text-xl mb-2">
                بازه ی زمانی
              </div>

              <input
                className="w-[100%] mx-auto bg-[#F7F7F7]  py-4  px-8 text-[#8F8F8F]  text-right outline-none rounded-lg"
                type="number"
                name="slotDuration"
                placeholder="10"
                dir="rtl"
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

            <div className="w-1/3 ">
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

          <div style={{ direction: "rtl" }} className="w-full">
            <p className="text-right mb-2 text-xl font-normal">
              تاریخ نوبت دهی
            </p>
            <div className="flex flex-row-reverse space-x-3">
              <div
                className={`w-1/3 bg-[#FAF5F5]  rounded-lg ${
                  errors.year && "border border-[#A60014]"
                }`}
              >
                <select
                  name="year"
                  id="year"
                  className="w-[95%] mx-auto bg-[#FAF5F5]  p-4  text-[#221D23]  text-right outline-none rounded-lg"
                  {...register("year", registerOptions.year)}
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
                className={`w-1/3 bg-[#FAF5F5]  rounded-lg ${
                  errors.month && "border border-[#A60014]"
                }`}
              >
                <select
                  name="month"
                  id="month"
                  className="w-[95%] mx-auto bg-[#FAF5F5]  p-4  text-[#221D23]  text-right outline-none rounded-lg"
                  {...register("month", registerOptions.month)}
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
                className={`w-1/3 bg-[#FAF5F5]  rounded-lg ${
                  errors.day && "border border-[#A60014]"
                }`}
              >
                <select
                  name="day"
                  id="day"
                  className="w-[95%] mx-auto bg-[#FAF5F5]  p-4  text-[#221D23]  text-right outline-none rounded-lg"
                  {...register("day", registerOptions.day)}
                >
                  <option value="">روز</option>
                  {Array.from({ length: 31 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-between space-x-3 space-x-reverse my-14">
            <div className="w-1/2">
              <p className="text-right mb-2 text-xl font-normal">ساعت شروع </p>

              <div className="flex flex-row-reverse space-x-3">
                <div
                  className={`w-1/2 bg-[#FAF5F5]  rounded-lg pl-3 ${
                    errors.startHour && "border border-[#A60014]"
                  }`}
                >
                  <select
                    name="startHour"
                    dir="rtl"
                    id="startHour"
                    className="w-[100%] mx-auto bg-[#FAF5F5]  py-4 px-6 text-[#221D23]  text-right outline-none rounded-lg"
                    {...register("startHour", registerOptions.startHour)}
                  >
                    <option value="">ساعت</option>
                    {[
                      { label: "صبح", hours: [9, 10, 11, 12] },
                      { label: "عصر", hours: [13, 14, 15, 16, 17] },
                    ].map((group, groupIndex) => (
                      <optgroup key={groupIndex} label={group.label}>
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
                  className={`w-1/2 bg-[#FAF5F5]  rounded-lg pl-3 ${
                    errors.startMinute && "border border-[#A60014]"
                  }`}
                >
                  <select
                    name="startMinute"
                    id="startMinute"
                    dir="rtl"
                    className="w-[100%] mx-auto bg-[#FAF5F5]  py-4 px-6 text-[#221D23]  text-right outline-none rounded-lg"
                    {...register("startMinute", registerOptions.startMinute)}
                  >
                    <option value="">دقیقه </option>
                    <option value="00">00</option>
                    <option value="30">30</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="w-1/2">
              <div className="">
                <p className=" text-right mb-2 text-xl font-normal">
                  ساعت پایان
                </p>

                <div className="flex flex-row-reverse space-x-6 ">
                  <div
                    className={`w-1/2 bg-[#FAF5F5]  rounded-lg pl-3 ${
                      errors.endHour && "border border-[#A60014]"
                    }`}
                  >
                    <select
                      name="endHour"
                      id="endHour"
                      dir="rtl"
                      className="w-[100%] mx-auto bg-[#FAF5F5]  py-4 px-6 text-[#221D23]  text-right outline-none rounded-lg"
                      {...register("endHour", registerOptions.endHour)}
                    >
                      <option value="">ساعت</option>
                      {[
                        { label: "صبح", hours: [9, 10, 11, 12] },
                        { label: "عصر", hours: [13, 14, 15, 16, 17] },
                      ].map((group, groupIndex) => (
                        <optgroup key={groupIndex} label={group.label}>
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
                    className={`w-1/2 bg-[#FAF5F5]  rounded-lg pl-3 ${
                      errors.endMinute && "border border-[#A60014]"
                    }`}
                  >
                    <select
                      name="endMinute"
                      id="endMinute"
                      dir="rtl"
                      className="w-[100%] mx-auto bg-[#FAF5F5]  py-4 px-6  text-[#221D23]  text-right outline-none rounded-lg"
                      {...register("endMinute", registerOptions.endMinute)}
                    >
                      <option value="">دقیقه</option>
                      <option value="00">00</option>
                      <option value="30">30</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-64">
            <input
              type="submit"
              value="ذخیره"
              className="w-full rounded-[50px] py-2 bg-[#A60014] text-centerp-2 cursor-pointer text-white text-lg
              disabled:bg-[#D9D9D9] disabled:cursor-not-allowed disabled:text-[#919191]"
              disabled={!isDirty || !isValid}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Daily;
