"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { logOut } from "@/store/slices/token";
import { useRouter } from "next/navigation";
import editIcon from "@/public/images/shop/edit.svg";
import warningIcon from "@/public/images/shop/error-red.svg";
import Modal from "@/components/shared/modal/page";

type FormValues = {
  name: string;
  mobile: string;
};

const Profile = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const _token = useSelector((state: RootState) => state.token.token);

  const [response, setResponse] = useState<string>("");
  const [showModal, setShowModal] = useState<"" | "name" | "mobile">("");

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "all",
    defaultValues: { name: "", mobile: "" },
  });

  useEffect(() => {
    if (!_token) return;
    const fetchUser = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/clients/fetch-user`,
        {
          headers: { Authorization: `Bearer ${_token}` },
        }
      );
      if (res.ok) {
        const { data } = await res.json();
        setValue("name", data?.name);
        setValue("mobile", data?.mobile);
      }
    };
    fetchUser();
  }, [_token, setValue, showModal]);

  useEffect(() => {
    if (response) {
      const timer = setTimeout(() => setResponse(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [response]);

  const closeModal = () => {
    setShowModal("");
    setResponse("");
  };

  const editHandler = async () => {
    const body = {
      name: getValues("name"),
      mobile: getValues("mobile"),
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${_token}`,
      },
      body: JSON.stringify(body),
    });

    switch (res.status) {
      case 200:
        const { oldMobile } = await res.json();
        if (showModal === "mobile" && body.mobile !== oldMobile) {
          dispatch(logOut());
          router.push("/shop");
        }
        closeModal();
        break;
      case 400:
        setResponse(
          showModal === "name"
            ? "وارد کردن نام الزامی است."
            : "وارد کردن شماره موبایل الزامی است."
        );
        break;
      case 403:
        setResponse("شماره موبایل وارد شده قبلاً ثبت شده است.");
        break;
      case 404:
        setResponse("کاربری با این مشخصات یافت نشد.");
        break;
    }
  };

  const renderModal = (type: "name" | "mobile") => (
    <Modal isOpen={true} onClose={closeModal}>
      {response && (
        <div className="bg-[#F9BCBC] text-[#940707] w-fit flex flex-row mb-10 py-2 pr-14 pl-20 rounded-s-[2px] rounded-e-[8px]">
          <Image
            src={warningIcon}
            width={26}
            height={26}
            alt="warning"
            className="my-auto"
          />
          <div className="mr-2 my-auto">{response}</div>
        </div>
      )}
      <div className="w-[80%] mx-auto text-white">
        <div className="text-center font-semibold text-[32px] mb-6">
          {type === "name" ? "ویرایش نام و نام خانوادگی" : "ویرایش شماره تماس"}
        </div>
        {type === "mobile" && (
          <div className="text-center text-[18px] mb-10">
            برای ثبت این شماره باید آن را تایید کنید. مطمئن شوید که شماره جدید
            صحیح و در دسترس است.
          </div>
        )}
        <div className="mb-2">
          {type === "name" ? "نام و نام خانوادگی" : "شماره تماس"}
        </div>
        <input
          className={`w-full bg-[#F7F7F7] outline-none text-[#221D23] rounded-[8px] p-4 mb-10 ${
            errors[type] ? "border border-[#A60014]" : ""
          }`}
          {...register(type, {
            required:
              type === "name" ? "نام الزامی است" : "شماره تماس الزامی است",
            ...(type === "mobile"
              ? {
                  pattern: {
                    value: /^09\d{9}$/,
                    message: "فرمت شماره تلفن معتبر نیست",
                  },
                }
              : {}),
          })}
        />
        <div className="flex flex-row-reverse space-x-5">
          <button
            onClick={closeModal}
            className="bg-white text-[#6D6F72] w-1/2 py-3 rounded-[50px]"
          >
            لغو
          </button>
          <button
            onClick={editHandler}
            className="bg-[#FFDA8A] text-[#221D23] w-1/2 py-3 rounded-[50px]"
          >
            بروز رسانی
          </button>
        </div>
      </div>
    </Modal>
  );

  return (
    <div dir="rtl" className="w-[80%] mx-auto mt-20 mb-28">
      {["name", "mobile"].map((field) => (
        <div key={field}>
          <div className="text-[20px] text-[#221d23] mb-2 mt-8">
            {field === "name" ? "نام و نام خانوادگی" : "شماره تماس"}
          </div>
          <div className="w-full flex space-x-6 space-x-reverse mb-2">
            <input
              className="outline-none w-[85%] bg-[#F7F7F7] text-[#221D23] rounded-[8px] p-4"
              {...register(field as keyof FormValues)}
            />
            <button
              onClick={() => setShowModal(field as "name" | "mobile")}
              className="bg-[#A60014] w-[15%] py-3 px-5 rounded-full flex justify-center items-center space-x-reverse"
            >
              <Image
                src={editIcon}
                width={24}
                height={24}
                alt="edit"
                className="brightness-0 invert"
              />
              <span className="text-white mr-3 text-lg">ویرایش</span>
            </button>
          </div>
        </div>
      ))}
      {showModal && renderModal(showModal)}
    </div>
  );
};

export default Profile;
