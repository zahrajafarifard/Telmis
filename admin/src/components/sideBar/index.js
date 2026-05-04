import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useDispatch } from "react-redux";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { Logout } from "../../store/action";

import Check from "../../assets/images/Check_ring.svg";
import Logo from "../../assets/images/logo.png";
import sideBar from "../../assets/images/side-bar.png";
import ArticleIcon from "../../assets/images/blog.svg";
import lightArticleIcon from "../../assets/images/blog_light_Icon.svg";

import NewUserIcon from "../../assets/images/new-user.svg";
import lightUserIcon from "../../assets/images/light_user.svg";

import ProdIcon from "../../assets/images/shop.svg";
import lightProdIcon from "../../assets/images/shop_light_Icon.svg";

import JobIcon from "../../assets/images/job.svg";
import lightJobIcon from "../../assets/images/job_light_Icon.svg";

import FileIcon from "../../assets/images/files-sidebar.svg";
import lightFileIcon from "../../assets/images/file-sidebar_light_Icon.svg";

import FinancialIcon from "../../assets/images/financial.svg";
import lightFinancialIcon from "../../assets/images/financial_light_Icon.svg";

import BannerIcon from "../../assets/images/banner.svg";
import lightBanner from "../../assets/images/banner_light_Icon.svg";

import modalImage from "../../assets/images/modalBack.png";
import contactIcon from "../../assets/images/contactUs.svg";
import lightContactIcon from "../../assets/images/lightContact_Icon.svg";
import lightIcon from "../../assets/images/light_Icon.svg";
import darkIcon from "../../assets/images/dark_Icon.svg";
import LogoutIcon from "../../assets/images/logout.svg";

function Sidebar() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);

  const getInitialShowItems = () => {
    if (["/", "/new-user", "/profile"].includes(location.pathname))
      return "users";
    if (
      [
        "/products",
        "/add-product",
        "/categories",
        "/orders",
        "/shipping",
        "/comments",
        "/edit-product",
      ].includes(location.pathname)
    )
      return "products";

    if (
      ["/files", "/add-file", "/edit-file", "/file-types"].includes(
        location.pathname
      )
    )
      return "files";

    if (
      [
        "/job-positions",
        "/add-job-position",
        "/job-positions-categories",
        "/resume",
        "/edit-job-position",
      ].includes(location.pathname)
    )
      return "jobs";
    if (
      [
        "/articles",
        "/add-new-article",
        "/article-categories",
        "/edit-article",
      ].includes(location.pathname)
    )
      return "articles";
    if (location.pathname === "/notifications") return "notifications";
    if (location.pathname === "/contact-us") return "contactUs";
    return "";
  };

  const [showItems, setShowItems] = useState(getInitialShowItems());

  useEffect(() => {
    setShowItems(getInitialShowItems());
  }, [location.pathname]);

  const _LogoutBox = (
    <div
      style={{
        background: `url(${modalImage})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
      className="py-24 px-20 w-full mx-auto  flex flex-col text-center bg-gradient-to-r to-[#B71F26] from-[#640509] text-white  rounded-[8px]
        screen1000:px-16
        screen850:pt-8
        screen850:pb-10
        screen850:px-4"
    >
      <img src={Check} className="w-20 h-20 mx-auto" />
      <div className="w-full mx-auto text-2xl  screen1000:text-xl screen850:text-base">
        آیا مطمئن هستید که می‌خواهید خارج شوید؟
      </div>
      <div
        className="flex flex-row-reverse justify-center items-center place-items-center gap-2 w-[70%]  mx-auto mt-10
        screen1000:w-[80%]  "
      >
        <button
          onClick={() => {
            setShowModal(false);
            navigate("/", { replace: true });
            dispatch(Logout());
          }}
          className="w-[45%] mx-auto border border-[#FFDA8A]  text-black font-bold rounded-[50px] bg-[#FFDA8A] py-3  text-lg 
            screen1000:text-base screen850:text-xs"
        >
          خروج
        </button>
        <button
          onClick={() => {
            setShowModal(false);
          }}
          className="w-[45%] mx-auto border font-bold py-3 bg-white text-[#919191]  rounded-[50px] text-lg 
            screen1000:text-base screen850:text-xs"
        >
          لغو
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-1/4  shadow-[0_0_4px_0_rgba(0,0,0,0.13)] sticky top-0  h-full min-h-screen">
      <div className="w-full mx-auto py-5 flex justify-center">
        <img src={Logo} className="w-1/3" />
      </div>
      <div className="text-base text-[#6D6F72]">
        <div className="relative">
          <NavLink
            to="/new-user"
            onClick={() =>
              setShowItems((prev) => (prev !== "users" ? "users" : ""))
            }
          >
            <div
              className={`flex flex-row p-4 ${
                ["/", "/new-user", "/profile"].includes(location.pathname)
                  ? "bg-[#A60014] text-white"
                  : ""
              }`}
            >
              <div className="flex flex-row justify-between w-full">
                <div className="flex flex-row">
                  <img
                    src={
                      ["/", "/new-user", "/profile"].includes(location.pathname)
                        ? lightUserIcon
                        : NewUserIcon
                    }
                    className="w-6 h-6 my-auto"
                  />
                  <span className="px-6">مدیریت کاربران </span>
                </div>
                <img
                  src={showItems === "users" ? lightIcon : darkIcon}
                  className={`w-6 h-6 my-auto `}
                />
              </div>
            </div>
          </NavLink>

          {showItems === "users" && (
            <div className="static top-10 right-0 my-7">
              <NavLink
                to="/new-user"
                className="flex px-4 justify-start py-2 mb-3"
              >
                <input
                  type="radio"
                  className="accent-[#A60014]"
                  checked={["/", "/new-user"].includes(location.pathname)}
                  onChange={() => null}
                />
                <span className="ps-6">کاربران جدید</span>
              </NavLink>
              <NavLink to="/profile" className="flex px-4 py-2 justify-start">
                <input
                  type="radio"
                  className="accent-[#A60014]"
                  checked={["/profile"].includes(location.pathname)}
                  onChange={() => null}
                />
                <span className="ps-6">پروفایل کاربران </span>
              </NavLink>
            </div>
          )}
        </div>

        {/* <NavLink to="/files">
          <div
            className={`flex flex-row p-4 ${
              ["/files", "/add-file", "/edit-file"].includes(location.pathname)
                ? "bg-[#A60014] text-white"
                : ""
            }`}
          >
            <div className="flex flex-row">
              <img
                src={
                  ["/files", "/add-file", "/edit-file"].includes(
                    location.pathname
                  )
                    ? lightFileIcon
                    : FileIcon
                }
                className="w-6 h-6 my-auto"
              />
              <span className="px-6">مدیریت فایل‌ها</span>
            </div>
          </div>
        </NavLink> */}

        {/* ////////////////////////////////////////////// */}

        <div className="relative">
          <NavLink
            to="/files"
            onClick={() =>
              setShowItems((prev) => (prev !== "files" ? "files" : ""))
            }
          >
            <div
              className={`flex flex-row p-4 ${
                ["/files", "/add-file", "/edit-file", "/file-types"].includes(
                  location.pathname
                )
                  ? "bg-[#A60014] text-white"
                  : ""
              }`}
            >
              <div className="flex flex-row justify-between w-full">
                <div className="flex flex-row">
                  <img
                    src={
                      [
                        "/files",
                        "/add-file",
                        "/edit-file",
                        "/file-types",
                      ].includes(location.pathname)
                        ? lightFinancialIcon
                        : FinancialIcon
                    }
                    className="w-6 h-6 my-auto"
                  />
                  <span className="px-6">مدیریت فایل‌ها </span>
                </div>
                <img
                  src={showItems === "files" ? lightIcon : darkIcon}
                  className={`w-6 h-6 my-auto `}
                />
              </div>
            </div>
          </NavLink>

          {showItems === "files" && (
            <div className="static top-10 right-0 my-7">
              <NavLink
                to="/files"
                className="flex px-4 justify-start py-2 mb-3"
              >
                <input
                  type="radio"
                  className="accent-[#A60014]"
                  checked={["/files"].includes(location.pathname)}
                  onChange={() => null}
                />
                <span className="ps-6">فایل ها </span>
              </NavLink>
              <NavLink
                to="/file-types"
                className="flex px-4 justify-start py-2 mb-3"
              >
                <input
                  type="radio"
                  className="accent-[#A60014]"
                  checked={["/file-types"].includes(location.pathname)}
                  onChange={() => null}
                />
                <span className="ps-6"> تنظیمات دسته بندی </span>
              </NavLink>
            </div>
          )}
        </div>

        {/* ///////////////////////////////////////////// */}

        <NavLink to="/receipts">
          <div
            className={`flex flex-row p-4 ${
              ["/receipts", "/add-receipt", "/edit-receipt"].includes(
                location.pathname
              )
                ? "bg-[#A60014] text-white"
                : ""
            }`}
          >
            <div className="flex flex-row">
              <img
                src={
                  ["/receipts", "/add-receipt", "/edit-receipt"].includes(
                    location.pathname
                  )
                    ? lightFinancialIcon
                    : FinancialIcon
                }
                className="w-6 h-6 my-auto"
              />
              <span className="px-6">مدیریت مالی </span>
            </div>
          </div>
        </NavLink>

        <div className="relative">
          <NavLink
            to="/products"
            onClick={() =>
              setShowItems((prev) => (prev !== "products" ? "products" : ""))
            }
          >
            <div
              className={`flex flex-row p-4 ${
                [
                  "/products",
                  "/add-product",
                  "/categories",
                  "/orders",
                  "/shipping",
                  "/comments",
                  "/edit-product",
                ].includes(location.pathname)
                  ? "bg-[#A60014] text-white"
                  : ""
              }`}
            >
              <div className="flex flex-row justify-between w-full">
                <div className="flex flex-row">
                  <img
                    src={
                      [
                        "/products",
                        "/add-product",
                        "/categories",
                        "/orders",
                        "/shipping",
                        "/comments",
                        "/edit-product",
                      ].includes(location.pathname)
                        ? lightProdIcon
                        : ProdIcon
                    }
                    className="w-6 h-6 my-auto"
                  />
                  <span className="px-6">مدیریت فروشگاه</span>
                </div>
                <img
                  src={showItems === "products" ? lightIcon : darkIcon}
                  className={`w-6 h-6 my-auto `}
                />
              </div>
            </div>
          </NavLink>

          {showItems === "products" && (
            <div className="static top-10 right-0 my-7">
              <NavLink
                to="/products"
                className="flex px-4 justify-start py-2 mb-3"
              >
                <input
                  type="radio"
                  className="accent-[#A60014]"
                  checked={["/products"].includes(location.pathname)}
                  onChange={() => null}
                />
                <span className="ps-6">مشاهده محصولات </span>
              </NavLink>

              <NavLink
                to="/categories"
                className="flex px-4 justify-start py-2 mb-3"
              >
                <input
                  type="radio"
                  className="accent-[#A60014]"
                  onChange={() => null}
                  checked={["/categories"].includes(location.pathname)}
                />
                <span className="ps-6">مدیریت دسته بندی ها</span>
              </NavLink>
              <NavLink
                to="/orders"
                className="flex px-4 justify-start py-2 mb-3"
              >
                <input
                  type="radio"
                  className="accent-[#A60014]"
                  onChange={() => null}
                  checked={["/orders"].includes(location.pathname)}
                />
                <span className="ps-6">فاکتور سفارشات</span>
              </NavLink>
              <NavLink
                to="/shipping"
                className="flex px-4 justify-start py-2 mb-3"
              >
                <input
                  type="radio"
                  className="accent-[#A60014]"
                  checked={["/shipping"].includes(location.pathname)}
                  onChange={() => null}
                />
                <span className="ps-6">تنظیمات ارسال محصول </span>
              </NavLink>
              <NavLink
                to="/comments"
                className="flex px-4 justify-start py-2 mb-3"
              >
                <input
                  type="radio"
                  className="accent-[#A60014]"
                  checked={["/comments"].includes(location.pathname)}
                  onChange={() => null}
                />
                <span className="ps-6">نظر مشتری </span>
              </NavLink>
            </div>
          )}
        </div>

        <div className="relative">
          <NavLink
            to="/articles"
            onClick={() =>
              setShowItems((prev) => (prev !== "articles" ? "articles" : ""))
            }
          >
            <div
              className={`flex flex-row p-4 ${
                [
                  "/articles",
                  "/add-new-article",
                  "/article-categories",
                  "/edit-article",
                ].includes(location.pathname)
                  ? "bg-[#A60014] text-white"
                  : ""
              }`}
            >
              <div className="flex flex-row justify-between w-full">
                <div className="flex flex-row">
                  <img
                    src={
                      [
                        "/articles",
                        "/add-new-article",
                        "/article-categories",
                        "/edit-article",
                      ].includes(location.pathname)
                        ? lightArticleIcon
                        : ArticleIcon
                    }
                    className="w-6 h-6 my-auto"
                  />
                  <span className="px-6">مدیریت وبلاگ </span>
                </div>
                <img
                  src={showItems === "articles" ? lightIcon : darkIcon}
                  className={`w-6 h-6 my-auto `}
                />
              </div>
            </div>
          </NavLink>

          {showItems === "articles" && (
            <div className="static top-10 right-0 my-7">
              <NavLink
                to="/articles"
                className="flex px-4 justify-start py-2 mb-3"
              >
                <input
                  type="radio"
                  className="accent-[#A60014]"
                  checked={["/articles"].includes(location.pathname)}
                  onChange={() => null}
                />
                <span className="ps-6">مشاهده مقالات </span>
              </NavLink>

              <NavLink
                to="/article-categories"
                className="flex px-4 justify-start py-2 mb-3"
              >
                <input
                  type="radio"
                  className="accent-[#A60014]"
                  checked={["/article-categories"].includes(location.pathname)}
                  onChange={() => null}
                />
                <span className="ps-6">مدیریت دسته بندی ها </span>
              </NavLink>
            </div>
          )}
        </div>

        <div className="relative">
          <NavLink
            to="/job-positions"
            onClick={() =>
              setShowItems((prev) => (prev !== "jobs" ? "jobs" : ""))
            }
          >
            <div
              className={`flex flex-row p-4 ${
                [
                  "/job-positions",
                  "/add-job-position",
                  "/job-positions-categories",
                  "/resume",
                  "/edit-job-position",
                ].includes(location.pathname)
                  ? "bg-[#A60014] text-white"
                  : ""
              }`}
            >
              <div className="flex flex-row justify-between w-full">
                <div className="flex flex-row">
                  <img
                    src={
                      [
                        "/job-positions",
                        "/add-job-position",
                        "/job-positions-categories",
                        "/resume",
                        "/edit-job-position",
                      ].includes(location.pathname)
                        ? lightJobIcon
                        : JobIcon
                    }
                    className="w-6 h-6 my-auto"
                  />
                  <span className="px-6">مدیریت فرصت‌‌های شغلی </span>
                </div>
                <img
                  src={showItems === "jobs" ? lightIcon : darkIcon}
                  className={`w-6 h-6 my-auto `}
                />
              </div>
            </div>
          </NavLink>

          {showItems === "jobs" && (
            <div className="static top-10 right-0 my-7">
              <NavLink
                to="/job-positions"
                className="flex px-4 justify-start py-2 mb-3"
              >
                <input
                  type="radio"
                  className="accent-[#A60014]"
                  checked={["/job-positions"].includes(location.pathname)}
                  onChange={() => null}
                />
                <span className="ps-6">مشاهده فرصت‌‌های شغلی </span>
              </NavLink>

              <NavLink
                to="/job-positions-categories"
                className="flex px-4 justify-start py-2 mb-3"
              >
                <input
                  type="radio"
                  className="accent-[#A60014]"
                  checked={["/job-positions-categories"].includes(
                    location.pathname
                  )}
                  onChange={() => null}
                />
                <span className="ps-6">مدیریت دسته بندی شغلی </span>
              </NavLink>

              <NavLink
                to="/resume"
                className="flex px-4 justify-start py-2 mb-3"
              >
                <input
                  type="radio"
                  className="accent-[#A60014]"
                  checked={["/resume"].includes(location.pathname)}
                  onChange={() => null}
                />
                <span className="ps-6">مشاهده رزومه ها</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* <NavLink
          to="/notifications"
          onClick={() =>
            setShowItems((prev) =>
              prev !== "notifications" ? "notifications" : ""
            )
          }
        >
          <div
            className={`flex flex-row  p-4  ${
              location.pathname === "/notifications" &&
              "bg-[#A60014] text-white"
            }`}
          >
            <img
              src={
                location.pathname.includes("/notifications")
                  ? lightNotiIcon
                  : NotiIcon
              }
              className="w-6 h-6 my-auto"
            />
            <span className="px-6">اعلانات</span>
          </div>
        </NavLink> */}

        <NavLink
          to="/banners"
          onClick={() =>
            setShowItems((prev) => (prev !== "banners" ? "banners" : ""))
          }
        >
          <div
            className={`flex flex-row p-4 ${
              location.pathname.includes("/banners") &&
              "bg-[#A60014] text-white"
            }`}
          >
            <img
              src={
                location.pathname.includes("/banners")
                  ? lightBanner
                  : BannerIcon
              }
              className="w-6 h-6 my-auto"
            />
            <span className="px-6"> مدیریت بنرها </span>
          </div>
        </NavLink>
        <NavLink
          to="/contact-us"
          onClick={() =>
            setShowItems((prev) => (prev !== "contactUs" ? "contactUs" : ""))
          }
        >
          <div
            className={`flex flex-row p-4 ${
              location.pathname.includes("/contact-us") &&
              "bg-[#A60014] text-white"
            }`}
          >
            <img
              src={
                location.pathname.includes("/contact-us")
                  ? lightContactIcon
                  : contactIcon
              }
              className="w-6 h-6 my-auto"
            />
            <span className="px-6">ارتباط با ما </span>
          </div>
        </NavLink>

        <Link
          onClick={() => {
            setShowModal(true);
          }}
          // to="/"
        >
          <div className="flex flex-row  p-4">
            <img
              src={LogoutIcon}
              className={`w-6 h-6 my-auto ${
                location.pathname === "" && "brightness-0 invert"
              }`}
            />
            <span className="px-6 text-[#B71F26]">خروج از حساب</span>
          </div>
        </Link>
        <div
          className={` ${
            ["", "notifications", "contactUs"].includes(showItems)
              ? "mt-40"
              : "mt-auto"
          } `}
        >
          <img src={sideBar} className="w-fit mx-auto" />
        </div>
      </div>

      <div className={`${showModal && " relative"} `}>
        {showModal &&
          ReactDOM.createPortal(
            <>
              <div
                className="w-full h-full bg-[#4c4c4c]   opacity-60 fixed top-0 left-0 z-20 "
                onClick={() => {
                  setShowModal(false);
                }}
              />

              <div
                className="z-30 fixed justify-center h-fit mx-auto inset-x-0 my-auto inset-y-0  font-Peyda 
                  w-[45%]
                  screen1350:w-1/2
                  screen1250:w-[60%]
                  screen620:w-[80%]
                  screen440:w-[95%]"
              >
                {_LogoutBox}
              </div>
            </>,

            document.getElementById("modal")
          )}
      </div>
    </div>
  );
}

export default Sidebar;
