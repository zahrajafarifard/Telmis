"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import userFill from "@/public/images/shop/User_fill.svg";
import User_AuthorizedIcon from "@/public/images/shop/User_Authorized.svg";
import cartIcon from "@/public/images/shop/Basket.svg";
import favIcon from "@/public/images/shop/bx-heart.svg";
import locIcon from "@/public/images/shop/loc.svg";
import backIcon from "@/public/images/shop/back.svg";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "@/store/slices/token";
import { RootState } from "@/store/store";

import Modal from "@/components/shared/modal/page";

const AutorizedUser = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const _token = useSelector((state: RootState) => state.token.token);

  const [name, setName] = useState<string>("");

  const [showUserAuthorized, setShowUserAuthorized] = useState<
    boolean | string
  >(false);

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const closeLogoutModal = () => {
    setIsLogoutModalOpen(false);
  };

  useEffect(() => {
    const _fetchUser = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/clients/fetch-user`,

        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + _token,
          },
        }
      );

      switch (response.status) {
        case 200:
          const data = await response.json();

          setName(data?.data?.name);

          break;

        default:
          break;
      }
    };

    if (_token) _fetchUser();
  }, [_token]);

  return (
    <div className="relative">
      <div
        onClick={() => {
          setShowUserAuthorized((prev) => !prev);
        }}
        className="bg-[#A60014]  my-auto rounded-full w-12 h-12  flex justify-center items-center "
      >
        <Image
          src={userFill}
          className={`my-auto mx-auto `}
          alt="کاربر"
          width={32}
          height={32}
        />
      </div>

      {showUserAuthorized ? (
        <div>
          <div
            onClick={() => {
              setShowUserAuthorized(false);
            }}
            className="w-screen h-screen top-0 left-0 z-20 fixed"
          />
          <div className="bg-white absolute top-14 z-50 cursor-pointer left-0 w-56 p-5 rounded-[12px] shadow-[0px_2px_14px_0px_rgb(0,0,0,0.15)] ">
            <div
              onClick={() => {
                router.push("/shop/user/profile");
                setShowUserAuthorized(false);
              }}
              className="flex flex-row space-x-2 space-x-reverse mb-5"
            >
              <Image
                src={User_AuthorizedIcon}
                width={28}
                height={28}
                alt="user icon"
                className="my-auto"
              />
              <span className="my-auto mx-auto"> {name}</span>
            </div>
            <hr />
            <div
              onClick={() => {
                router.push("/shop/user/orders");
                setShowUserAuthorized(false);
              }}
              className="mt-5 flex flex-row space-x-2 space-x-reverse cursor-pointer"
            >
              <Image
                src={cartIcon}
                width={24}
                height={24}
                alt="cart icon"
                className="my-auto brightness-0"
              />
              <span className="my-auto mx-auto">سفارش‌ها</span>
            </div>
            <div
              onClick={() => {
                router.push("/shop/user/favorites");
                setShowUserAuthorized(false);
              }}
              className="my-5 flex flex-row space-x-2 space-x-reverse cursor-pointer"
            >
              <Image
                src={favIcon}
                width={23}
                height={23}
                alt="favorite icon"
                className="my-auto"
              />
              <span className="my-auto mx-auto">علاقه‌مندی‌ها</span>
            </div>

            <div
              onClick={() => {
                router.push("/shop/user/addresses");
                setShowUserAuthorized(false);
              }}
              className="mb-5 flex flex-row space-x-2 space-x-reverse cursor-pointer"
            >
              <Image
                src={locIcon}
                width={26}
                height={26}
                alt="location icon"
                className="my-auto"
              />
              <span className="my-auto mx-auto">آدرس ها</span>
            </div>
            <hr />
            <div
              onClick={() => {
                setIsLogoutModalOpen(true);
              }}
              className="mt-5 flex flex-row space-x-2 space-x-reverse cursor-pointer"
            >
              <Image
                src={backIcon}
                width={28}
                height={28}
                alt="back icon"
                className="my-auto"
              />
              <span className="my-auto mx-auto text-[#A60014]">
                خروج از حساب
              </span>
            </div>
          </div>

          {isLogoutModalOpen ? (
            <Modal isOpen={true} onClose={closeLogoutModal}>
              <div className="w-[80%] mx-auto py-10">
                <div className="text-[32px] text-white text-center mb-10 font-semibold">
                  آیا مطمئن هستید که می‌خواهید خارج شوید؟
                </div>

                <div className="flex flex-row space-x-6 space-x-reverse">
                  <div
                    onClick={() => {
                      dispatch(setToken(""));
                      setShowUserAuthorized(false);
                      router.push("/shop");
                    }}
                    className={`bg-[#FFDA8A] w-1/2 py-3 mx-auto text-center rounded-[50px] text-lg 
                   screen850:text-base screen620:text-sm   `}
                  >
                    خروج
                  </div>
                  <div
                    onClick={() => {
                      closeLogoutModal();
                      router.push("/shop/cart");
                      setShowUserAuthorized(false);
                    }}
                    className="bg-[#fff] w-1/2 py-3 mx-auto text-center rounded-[50px] text-lg cursor-pointer screen850:text-base screen620:text-sm"
                  >
                    لغو
                  </div>
                </div>
              </div>
            </Modal>
          ) : (
            <div></div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default AutorizedUser;
