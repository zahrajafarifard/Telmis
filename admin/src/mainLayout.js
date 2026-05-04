import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import moment from "moment-jalaali";

import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

import Sidebar from "./components/sideBar";
import CreateUser from "./components/main/user-management/create-user";
import Profile from "./components/main/user-management/profile";
import Financial from "./components/main/exchange-management/financial";
import AddReceipt from "./components/main/exchange-management/financial/add-new-receipt";
import EditReceipt from "./components/main/exchange-management/financial/edit-receipt";
import Downloads from "./components/main/exchange-management/downloads";
import FileType from "./components/main/exchange-management/downloads/file-type";
import AddNewFile from "./components/main/exchange-management/downloads/add-new-file";
import EditFile from "./components/main/exchange-management/downloads/edit-file";
import Notification from "./components/main/notification";
import Admin from "./components/main/admin";
import Article from "./components/main/article-management";
import NewArticle from "./components/main/article-management/add-new-article";
import EditArticle from "./components/main/article-management/edit-article";
import Jobs from "./components/main/job-management/job-position";
import NewJob from "./components/main/job-management/job-position/add-job";
import EditJob from "./components/main/job-management/job-position/edit-job";
import Products from "./components/main/product-management/product";
import NewProduct from "./components/main/product-management/product/add-product/add-product";
import EditProduct from "./components/main/product-management/product/edit-product/edit-product";
import ProductsPerSubCategory from "./components/main/product-management/product/products";
import Category from "./components/main/product-management/categories";
import EditSubCategory from "./components/main/product-management/categories-old/sub-categories/edit-subCateory";
import AddSubCategory from "./components/main/product-management/categories-old/sub-categories/add-subCategory";
import JobCategory from "./components/main/job-management/job-position/config";
import ArticleCategory from "./components/main/article-management/article-categories";
import Banner from "./components/main/banner-management";

// import search from "./assets/images/search.svg";
// import cart from "./assets/images/cart.svg";
import user from "./assets/images/User.Icon.svg";
import notif from "./assets/images/notif-2.svg";
import Shipping from "./components/main/product-management/shipping-config";
import Orders from "./components/main/product-management/orders";
import OrderDetails from "./components/main/product-management/orders/order-details";
import { Logout } from "./store/action";
import Comments from "./components/main/product-management/product/comment";
import Resume from "./components/main/job-management/resume";
import ContactUs from "./components/main/contact-us";

function MainLayout() {
  moment.loadPersian({ usePersianDigits: true, dialect: "persian-modern" });

  const [now, setNow] = useState(moment());

  useEffect(() => {
    const timer = setTimeout(() => {
      setNow(moment());
    }, 10000);

    return () => clearTimeout(timer);
  }, [now]);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const constantMock = window.fetch;
  window.fetch = function () {
    let response;

    return new Promise((resolve, reject) => {
      constantMock
        .apply(this, arguments)
        .then((response) => {
          if (response.status === 401) {
            navigate("/", { replace: true });
            dispatch(Logout());
          }
          return resolve(response);
        })
        .catch((error) => {
          reject(response);
        });
    });
  };

  return (
    <div style={{ direction: "rtl" }} className="flex h-full font-Peyda ">
      <Sidebar />
      <div className="flex flex-col w-full ">
        <div className="bg-gradient-to-r from-[#A60014] to-[#600B0E] py-8 text-white">
          <div className="w-[90%] mx-auto flex flex-row justify-between">
            {now && (
              <div style={{ direction: "rtl" }} className="my-auto">
                {`امروز ${now.format("jDD jMMMM ماه jYYYY")} ساعت ${now.format(
                  "HH:mm"
                )}`}
              </div>
            )}
            <div className="flex flex-row space-x-5 space-x-reverse">
              <div
                onClick={() => {
                  navigate("/notifications");
                }}
                className="bg-white w-14 h-14 rounded-full flex justify-center items-center"
              >
                <img src={notif} className="mx-4 w-7 h-7 my-auto" />
              </div>

              <div
                onClick={() => {
                  navigate("/admin-profile");
                }}
                className={` cursor-pointer ${
                  location.pathname === "/admin-profile"
                    ? "bg-[#FFDA8A] "
                    : "bg-white"
                }  flex flex-row px-10 rounded-[50px] py-3 `}
              >
                <img
                  src={user}
                  className={`w-8 h-8 my-auto ${
                    location.pathname === "/admin-profile" &&
                    "brightness-0 invert-0"
                  }`}
                />
                <span
                  className={` ${
                    location.pathname === "/admin-profile"
                      ? "text-[#221D23]"
                      : "text-[#A60014]"
                  }  whitespace-nowrap my-auto text-[20px] mr-2`}
                >
                  حساب کاربری
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-grow p-4">
          <Routes>
            <Route path="/" element={<CreateUser />} />
            <Route path="/new-user" element={<CreateUser />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/receipts" element={<Financial />} />
            <Route path="/add-receipt" element={<AddReceipt />} />
            <Route path="/edit-receipt" element={<EditReceipt />} />
            <Route path="/files" element={<Downloads />} />
            <Route path="/file-types" element={<FileType />} />
            <Route path="/add-file" element={<AddNewFile />} />
            <Route path="/edit-file" element={<EditFile />} />
            <Route path="/notifications" element={<Notification />} />
            <Route path="/admin-profile" element={<Admin />} />
            <Route path="/articles" element={<Article />} />
            <Route path="/add-new-article" element={<NewArticle />} />
            <Route path="/article-categories" element={<ArticleCategory />} />
            <Route path="/edit-article" element={<EditArticle />} />
            <Route path="/job-positions" element={<Jobs />} />
            <Route path="/job-positions-categories" element={<JobCategory />} />
            <Route path="/edit-job-position" element={<EditJob />} />
            <Route path="/add-job-position" element={<NewJob />} />
            <Route path="/products" element={<Products />} />
            <Route path="/add-product" element={<NewProduct />} />
            <Route path="/edit-product" element={<EditProduct />} />
            <Route path="/banners" element={<Banner />} />
            <Route path="/categories" element={<Category />} />
            <Route path="/edit-sub-category" element={<EditSubCategory />} />
            <Route path="/add-sub-category" element={<AddSubCategory />} />

            <Route
              path="/shipping"
              element={<Shipping render={(props) => ({ ...props })} />}
            />
            <Route
              path="/orders"
              element={<Orders render={(props) => ({ ...props })} />}
            />
            <Route
              path="/order-details"
              element={<OrderDetails render={(props) => ({ ...props })} />}
            />
            <Route
              path="/comments"
              element={<Comments render={(props) => ({ ...props })} />}
            />
            <Route
              path="/resume"
              element={<Resume render={(props) => ({ ...props })} />}
            />
            <Route
              path="/contact-us"
              element={<ContactUs render={(props) => ({ ...props })} />}
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
