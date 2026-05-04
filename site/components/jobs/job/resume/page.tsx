"use client";
import React, { useState, useRef, useEffect } from "react";
import Header from "@/components/shared/header/page";
import bgImage from "@/public/images/bg-header.png";
import { useForm } from "react-hook-form";
import Image from "next/image";

import axios, { AxiosProgressEvent } from "axios";
import ulpoadIcon from "@/public/images/Upload_light.svg";
import style from "./style.module.css";
import CheckGreenIcon from "@/public/images/shop/Check_ring-green.svg";
import redIcon from "@/public/images/shop/error-red.svg";
import warningIcon from "@/public/images/shop/error.svg";

const Resume: React.FC<{ title?: string }> = ({ title }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<{
    mobile: string;
    name: string;
    lastName: string;
    email: string;
  }>({
    mode: "all",
  });

  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [toast, setToast] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };
  const handleUpload = async () => {
    setToast("");
    let response;
    if (!selectedFile) return setToast("missing_resume_file");

    const formData = new FormData();
    formData.append("name", getValues("name"));
    formData.append("lastName", getValues("lastName"));
    formData.append("mobile", getValues("mobile"));
    formData.append("email", getValues("email"));
    formData.append("resume", selectedFile);
    try {
      response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/resume/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percent);
            }
          },
        }
      );
    } catch (error) {
      console.error("Upload failed:", error);
    }

    switch (response?.status) {
      case 200:
        setToast("success");
        break;

      default:
        setToast("error");

        break;
    }
  };

  const onSubmit = (data: any) => {
    handleUpload();
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <div>
      <Header
        title=" فرم استخدام"
        text={
          <>
            <span className="text-[#A60014] text-lg ">ارسال رزومه / </span>
            <span className="text-[#919191] text-lg "> {title} </span>
            <span className="text-[#919191] text-lg ">/ موقعیت شغلی /</span>
            <span className="text-[#919191] text-lg "> خانه </span>
          </>
        }
        image={bgImage}
      />

      {toast === "error" && (
        <div className="bg-[#F9BCBC] text-[#940707] fixed right-0 top-[14%] flex flex-row-reverse ml-auto mt-10 pr-14 pl-12 py-2 rounded-s-[8px] ">
          <Image
            src={redIcon}
            width={24}
            height={24}
            alt="info"
            className="ml-2"
          />
          .خطا در بارگزاری رزومه، لطفا بعدا تلاش کنید
        </div>
      )}
      {toast === "missing_resume_file" && (
        <div className="bg-[#FFF099] text-[#D76B00] fixed right-0 top-[14%] flex flex-row-reverse ml-auto mt-10 pr-14 pl-12 py-2 rounded-s-[8px] ">
          <Image
            src={warningIcon}
            width={24}
            height={24}
            alt="info"
            className="ml-2"
          />
          .لطفاً فایل رزومه خود را انتخاب کنید
        </div>
      )}
      {toast === "success" && (
        <div className="bg-[#CBEDCB] text-[#219235] fixed right-0 top-[14%] flex flex-row-reverse ml-auto mt-10 pr-14 pl-12 py-2 rounded-s-[8px] ">
          <Image
            src={CheckGreenIcon}
            width={24}
            height={24}
            alt="info"
            className="ml-2"
          />
          .رزومه شما با موفقیت آپلود شد
        </div>
      )}
      <div className="w-[80%] mx-auto my-24">
        <div className="flex flex-row-reverse justify-between space-x-4 space-x-reverse screen1250:space-x-3 screen1250:space-x-reverse">
          <div className="flex flex-row-reverse justify-start text-[#221D23] text-2xl font-semibold">
            اطلاعات اولیه
          </div>

          <hr className="flex border-[#DFDFDF] flex-grow my-auto" />
        </div>

        <div
          style={{ direction: "rtl" }}
          className="my-16 grid grid-cols-2 gap-x-6 gap-y-12 "
        >
          <input
            style={{ WebkitBoxShadow: "0 0 0 1000px #f7f7f7 inset" }}
            {...register("name", { required: true })}
            dir="rtl"
            className={`bg-[#f7f7f7] placeholder:text-[#919191] text-[#333] py-4 px-9 w-full text-right rounded outline-none
              ${errors.name && "border border-[#A60014]"}
              `}
            placeholder="نام خود را وارد کنید*"
          />

          <input
            style={{ WebkitBoxShadow: "0 0 0 1000px #f7f7f7 inset" }}
            {...register("lastName", { required: true })}
            dir="rtl"
            className={`bg-[#f7f7f7] placeholder:text-[#919191] text-[#333] py-4 px-9 w-full text-right rounded outline-none
              ${errors.lastName && "border border-[#A60014]"}
              `}
            placeholder="نام خانوادگی خود را وارد کنید*"
          />

          <input
            style={{ WebkitBoxShadow: "0 0 0 1000px #f7f7f7 inset" }}
            {...register("mobile", { required: true })}
            dir="rtl"
            className={`bg-[#f7f7f7] placeholder:text-[#919191] text-[#333] py-4 px-9 w-full text-right rounded outline-none
              ${errors.mobile && "border border-[#A60014]"}
              `}
            placeholder="شماره تماس خود را وارد کنید*"
          />

          <input
            style={{ WebkitBoxShadow: "0 0 0 1000px #f7f7f7 inset" }}
            {...register("email", { required: true })}
            dir="rtl"
            className={`bg-[#f7f7f7] placeholder:text-[#919191] text-[#333] py-4 px-9 w-full text-right rounded outline-none
              ${errors.email && "border border-[#A60014]"}
              `}
            placeholder="ایمیل خود را وارد کنید*"
          />
        </div>

        <div>
          <div className="text-[#333] text-[20px] font-semibold bg-[#f7f7f7] text-right py-4 px-9 rounded-t">
            آپلود رزومه
          </div>
          <div className="border border-t-0 rounded-b">
            <div
              onClick={triggerFileSelect}
              className="w-fit mx-auto flex flex-col justify-center items-center pt-14 mb-14 cursor-pointer"
            >
              <Image
                src={ulpoadIcon}
                width={100}
                height={100}
                alt="upload icon"
              />

              <div className="text-[#A60014] text-[20px] underline">
                رزومه خود را بارگزاری کنید
              </div>
            </div>

            {uploadProgress > 0 && (
              <div className="flex flex-row-reverse w-[90%] mx-auto space-x-4 space-x-reverse mb-8">
                <progress
                  value={uploadProgress}
                  max="100"
                  className={`${style.customProgress} rounded-full  w-full my-auto `}
                >
                  {uploadProgress}%
                </progress>

                <p className="text-[#A60014] w-16 my-auto mx-auto  text-center">
                  {uploadProgress}%
                </p>
              </div>
            )}
          </div>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            ref={fileInputRef}
            onChange={handleFileChange}
            hidden
          />

          <button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            className="bg-[#A60014] rounded-full w-full text-center text-white mt-20 mb-10 py-3 text-lg"
          >
            ارسا ل درخواست
          </button>
        </div>
      </div>
    </div>
  );
};

export default Resume;
