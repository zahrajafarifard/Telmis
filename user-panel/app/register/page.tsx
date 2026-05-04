"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Image from "next/image";
import Link from "next/link";

import Modal from "@/components/shared/modal/page";
import RegisterImg from "@/public/images/register.png";
import Logo from "@/public/images/Telmis-Logo-Red.png";
import ErrorIcon from "@/public/images/error.svg";
import Border from "@/public/images/login-border.png";
import "@/components/shared/style.css";

const Login = () => {
  const router = useRouter();

  const [responseStatus, setResponseStatus] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    getValues,
    formState: { errors, isValid, isDirty, isSubmitting },
  } = useForm<{ mobile: string; name: string }>({
    mode: "all",
  });

  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      // responseStatus !== 201 && responseStatus !== 0 && setResponseStatus(0);

      if (responseStatus !== 201 && responseStatus !== 0) {
        setResponseStatus(0);
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [responseStatus]);

  const registerHandler = async () => {
    setResponseStatus(0);
    if (!getValues("mobile") || !getValues("name")) {
      return setResponseStatus(409);
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/clients/signUp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mobile: getValues("mobile"),
            name: getValues("name"),
          }),
        }
      );

      switch (response.status) {
        case 201:
          router.push("/log-in");
          break;
        case 403:
          setResponseStatus(403);
          break;
        case 422:
          setResponseStatus(422);

          break;
        case 500:
          // Handle 500 error
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Error registering:", error);
    }
  };

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.code === "Enter") {
        event.preventDefault();
        registerHandler();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [registerHandler]);

  return (
    <div>
      {responseStatus === 422 && (
        <div className="fixed top-10 right-0 rounded-s-[8px] bg-[#FFF099] flex flex-row-reverse w-fit pl-14 pr-16">
          <Image src={ErrorIcon} width={20} height={20} alt="آیکن هشدار" />
          <div className=" text-[#D76B00]  py-4 mr-2">
            اطلاعات وارد شده در سیستم موجود می باشد
          </div>
        </div>
      )}
      {responseStatus === 409 && (
        <div className="fixed top-10 right-0 rounded-s-[8px] bg-[#FFF099] flex flex-row-reverse w-fit pl-14 pr-16">
          <Image src={ErrorIcon} width={20} height={20} alt="آیکن هشدار" />
          <div className=" text-[#D76B00]  py-4 mr-2">
            فیلد (ها) را به درستی پر کنید
          </div>
        </div>
      )}
      {responseStatus === 403 && (
        <div className="fixed top-10 right-0 rounded-s-[8px] bg-[#FFF099] flex flex-row-reverse w-fit pl-14 pr-16">
          <Image src={ErrorIcon} width={20} height={20} alt="آیکن هشدار" />
          <div className=" text-[#D76B00]  py-4 mr-2">
            اطلاعات وارد شده تکراری می باشد
          </div>
        </div>
      )}

      {responseStatus === 201 && (
        <Modal
          isOpen={isModalOpen}
          // onClose={closeModal}
        >
          <div className="text-white text-center text-2xl screen850:text-lg screen620:text-base ">
            ثبت نام
          </div>
          <div
            style={{ direction: "rtl" }}
            className="text-white text-center  my-6 text-xl px-4 screen850:text-base screen620:text-sm "
          >
            اطلاعات شما ثبت شد. حساب کاربری شما پس از احراز هویت ایجاد می شود.
            به محض ایجاد حساب کاربری از طریق پیامک به شما اطلاع داده می شود.
          </div>
          <div
            onClick={() => {
              closeModal();
            }}
            className="bg-[#FFDA8A] w-fit px-3 py-1 mx-auto mt-10 rounded-[50px] text-lg cursor-pointer screen850:text-base screen620:text-sm "
          >
            بازگشت به صفحه ورود
          </div>
        </Modal>
      )}
      <div className="flex flex-row justify-between ">
        <div className="w-1/2 relative h-screen">
          <Image
            src={RegisterImg}
            className="w-full h-full"
            fill
            alt="عکس صفحه ثبت نام پرتال مشتریان تلمیس"
            sizes="50vw"
            quality={40}
            priority={true}
          />
        </div>
        <div style={{ direction: "rtl" }} className="w-1/2 my-auto">
          <div className="w-[70%] mx-auto">
            <Image
              src={Logo}
              className="w-30 mb-5"
              width={150}
              height={10}
              alt="لوگو شرکت داده پردازان تلمیس"
            />
            <h1 className="text-right text-[#221D23] font-bold text-[38px]  leading-[58px] mb-2">
              ثبت نام کنید.
            </h1>
            <h4 className="text-right text-[#8F8F8F] leading-[31px] ">
              در قسمت نام کاربری، نام شرکت، مدیر عامل یا صرافی خود را وارد کنید.
            </h4>

            <Image
              src={Border}
              className="w-full my-5"
              width={1000}
              height={10}
              alt="حاشیه"
            />

            <div className="mb-6">
              <p className="text-right text-[#221D23] leading-[31px] mb-2">
                نام و نام خانوادگی <span className="text-[#A60014]">*</span>
              </p>
              <input
                placeholder="نام و نام خانوادگی خود راوارد کنید "
                className={`w-full p-4 bg-[#f7f7f7] rounded-[8px] focus:outline-none ${
                  errors.name && "border border-[#B3323A]"
                }`}
                // value={name}
                // onChange={(e) => setName(e.target.value)}

                {...register("name", {
                  required: true,
                })}
              />

              {errors.name && (
                <p className="text-[#B3323A] text-xs text-right mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="mb-6">
              <p className="text-right text-[#221D23] leading-[31px] mb-2">
                شماره تماس
                <span className="text-[#A60014]">*</span>
              </p>
              <input
                placeholder="شماره تماس خود را وارد کنید"
                className={`w-full p-4 bg-[#f7f7f7] rounded-[8px] focus:outline-none ${
                  errors.mobile && "border border-[#B3323A]"
                } `}
                {...register("mobile", {
                  required: "شماره تماس اجباری است",
                  pattern: {
                    value: /^[0-9]{11}$/,
                    message: "شماره تماس معتبر نیست",
                  },
                })}
              />
              {errors.mobile && (
                <p className="text-[#B3323A] text-xs text-right mt-1">
                  {errors.mobile.message}
                </p>
              )}
            </div>

            <div className="mt-16 mb-5">
              <button
                disabled={!isValid || !isDirty || isSubmitting}
                onClick={registerHandler}
                className="button w-full py-2 bg-[#A60014] rounded-[50px] text-white text-lg disabled:cursor-not-allowed "
              >
                <span className="button-hover-effect"></span>
                <p className="button-hover-effect-text ">ثبت نام</p>
              </button>
            </div>

            <p className="leading-[31px] text-center">
              <span className="text-[#221D23]">قبلا حساب ساخته اید؟ </span>
              <Link href={"/log-in"}>
                <span className="text-[#A60014] underline cursor-pointer">
                  ورود
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
