"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";

import { RootState } from "@/store/store";
import LoginDetails from "./loginDetails";
import Pagination from "@/components/shared/pagination/page";
import "@/components/shared/style.css";

interface loginType {
  id: number;
  name: string;
  mobile: string;
  image: string;
  ip: string;
  device: string;
  login: string;
}
const Profile = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loginHistory, setLoginHistory] = useState<loginType[]>([]);

  const [name, setName] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const _token = useSelector((state: RootState) => state.client.token);

  const [totalItems, setTotalItems] = useState<number>(0);
  const itemsPerPage: number = 8;
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handlePageChange = (page: number | string) => {
    if (page !== "...") {
      setCurrentPage(Number(page));
    }
  };
  const handleAddPhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      setProfileImage(file);

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setProfilePreview(reader.result.toString());
        }
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const fetchedClient = async () => {
      let _data;
      const _response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/clients`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + _token,
          },
          body: JSON.stringify({
            page: currentPage,
            pageSize: itemsPerPage,
          }),
        }
      );

      switch (_response.status) {
        case 200:
          _data = await _response.json();

          setLoginHistory(_data?.loginHistory?.rows);
          setTotalItems(_data?.loginHistory?.count);

          setMobile(_data?.client?.mobile);
          setName(_data?.client?.name);

          // _data?.client?.image &&
          //   setProfilePreview(
          //     `${process.env.NEXT_PUBLIC_API_URL}/uploads/${_data?.client?.image
          //       ?.split(/[\/\\]/)
          //       ?.pop()}`
          //   );

          if (_data?.client?.image) {
            setProfilePreview(
              `${process.env.NEXT_PUBLIC_API_URL}/uploads/${_data?.client?.image
                ?.split(/[\/\\]/)
                ?.pop()}`
            );
          }

          break;
      }
    };

    // _token && fetchedClient();

    if (_token) {
      fetchedClient();
    }
  }, [_token, currentPage, setCurrentPage, setTotalItems, itemsPerPage]);

  const editClientHandler = async () => {
    let _data;

    const formData = new FormData();

    formData.append("name", name);
    formData.append("mobile", mobile);

    // profileImage && formData.append("image", profileImage);

    if (profileImage) {
      formData.append("image", profileImage);
    }

    const _response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/clients`,
      {
        method: "PATCH",
        headers: {
          Authorization: "Bearer " + _token,
        },
        body: formData,
      }
    );

    switch (_response.status) {
      case 200:
        _data = await _response.json();

        // _data?.data?.image &&
        //   setProfilePreview(
        //     `${process.env.NEXT_PUBLIC_API_URL}/uploads/${_data?.data?.image
        //       ?.split(/[\/\\]/)
        //       .pop()}`
        //   );

        if (_data?.data?.image) {
          setProfilePreview(
            `${process.env.NEXT_PUBLIC_API_URL}/uploads/${_data?.data?.image
              ?.split(/[\/\\]/)
              .pop()}`
          );
        }
        break;

      case 404:
        break;

      case 500:
        break;

      default:
        break;
    }
  };

  return (
    <div className="w-[80%] mx-auto pt-12">
      <div className="flex flex-row-reverse gap-4 mb-8 ">
        <p className="my-auto text-[#221D23] text-2xl leading-[24px]">
          اطلاعات کاربری
        </p>
        <hr className="flex-grow my-auto border-[#D9D9D9]" />
      </div>

      <div className="flex flex-row justify-between space-x-10 mb-10">
        <div className="w-2/3  ">
          <div className="w-full flex flex-col items-end mb-2">
            <div className="text-[#221D23] text-[20px] leading-[31px] mb-2">
              نام کاربری
            </div>
            <input
              dir="rtl"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[#F7F7F7] text-[#919191] rounded-[8px] w-full p-4 outline-none"
              placeholder="نام کاربری خود را وارد کنید"
            />
          </div>
          <div className="w-full flex flex-col items-end">
            <div className="text-[#221D23] text-[20px] leading-[31px] mb-2">
              شماره تماس
            </div>
            <div className="w-full flex flex-row-reverse  justify-between">
              <input
                dir="rtl"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="bg-[#F7F7F7] text-[#919191] rounded-[8px] w-[80%] p-4 outline-none"
                placeholder="شماره تماس خود را وارد کنید"
              />
              <div
                onClick={editClientHandler}
                className="button bg-[#A60014] rounded-[50px] w-[18%] text-white flex flex-row-reverse items-center justify-center  "
              >
                <span className="button-hover-effect"></span>
                <Image
                  src="/images/update.svg"
                  alt=""
                  className="button-hover-effect-text"
                  width={26}
                  height={26}
                />
                <span className="mr-2 button-hover-effect-text">بروزرسانی</span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[28%]">
          {profilePreview ? (
            <div className="relative h-full rounded-[19px]">
              <Image
                src={profilePreview!}
                alt=""
                fill
                className="rounded-[19px] object-contain"
              />
              <div
                onClick={handleAddPhotoClick}
                className=" w-10 h-10 bg-[#A60014] text-white absolute bottom-0.5 left-0.5 cursor-pointer flex flex-col justify-center items-center rounded-[10px]"
              >
                <Image src={"/images/edit.svg"} width={22} height={22} alt="" />
              </div>
            </div>
          ) : (
            <div className="border border-[#919191] rounded-[10px] h-full my-auto flex flex-col justify-center items-center">
              <Image
                onClick={handleAddPhotoClick}
                src="/images/add_a_photo.svg"
                alt=""
                width={60}
                height={50}
                className="flex items-center mx-auto mb-1 cursor-pointer"
              />
              <p
                onClick={handleAddPhotoClick}
                className="text-center text-[#919191] leading-[36px] cursor-pointer"
              >
                افزودن تصویر
              </p>
            </div>
          )}

          <input
            type="file"
            accept="image/jpeg, image/png, image/jpg"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
      </div>

      <div className="mx-auto rounded-sm">
        <div className="flex flex-row-reverse justify-between  w-full pb-10">
          <div className="text-[#1E1B1B] text-lg font-semibold my-auto ml-4">
            تاریخچه ورود ها
          </div>
          <hr className="flex-grow my-auto border-[#D9D9D9]" />
        </div>

        <div
          style={{ direction: "rtl" }}
          className="grid grid-cols-5 bg-[#F7F7F7]  w-[90%] mx-auto py-2 rounded-[4px] text-sm text-[#919191]"
        >
          <div className="my-auto mx-auto">ردیف</div>
          <div className="my-auto mx-auto flex flex-row ">
            <Image
              src={"/images/finacial-title-gray.svg"}
              alt=""
              width={20}
              height={20}
              className=""
            />
            <span className="mr-2">دستگاه</span>
          </div>
          <div className="my-auto mx-auto flex flex-row ">
            <Image
              src={"/images/finacial-calendar-gray.svg"}
              alt=""
              width={20}
              height={20}
              className=""
            />

            <span className="mr-2">تاریخ</span>
          </div>
          <div className="my-auto mx-auto flex flex-row ">
            <Image
              src={"/images/finacial-price-gray.svg"}
              alt=""
              width={20}
              height={20}
              className=""
            />

            <span className="mr-2">آدرس IP</span>
          </div>

          <div></div>
        </div>
        <div className=" w-[90%] mx-auto">
          {loginHistory?.length !== 0 ? (
            loginHistory?.map((item, index) => {
              return <LoginDetails item={item} key={item.id} index={index} />;
            })
          ) : (
            <div className="pt-10 pb-12 px-20 w-fit mx-auto  mt-12">
              <Image
                src={"/images/error-red.svg"}
                alt=""
                width={84}
                height={84}
                className="mx-auto"
              />

              <div className="text-[#6D6F72] mt-3 text-xl">
                .هیچ تاریخچه ورودی وجود ندارد
              </div>
            </div>
          )}
        </div>

        <div style={{ direction: "rtl" }} className="my-10">
          {totalItems > 0 && (
            <Pagination
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              current={currentPage}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
