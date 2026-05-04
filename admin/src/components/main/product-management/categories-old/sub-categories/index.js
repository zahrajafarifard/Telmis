import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import errIcn from "../../../../../assets/images/error2.svg";
import dotsIconGray from "../../../../../assets/images/dots-gray.svg";
import editIcon from "../../../../../assets/images/Edit.svg";
import removeIcon from "../../../../../assets/images/Remove.svg";
import WarningIcon from "../../../../../assets/images/error.svg";
import CheckCircleIcon from "../../../../../assets/images/Check_ring.svg";
import modalImage from "../../../../../assets/images/modalBack.png";

const SubCateoriesCmp = ({ selectedCategory }) => {
  const navigate = useNavigate();
  const _token = useSelector((state) => state.reducer.token);
  const [token, setToken] = useState("");
  const [response, setResponse] = useState({ code: 0, msg: "" });
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
  const [subCategories, setSubCategories] = useState([]);
  const [showAction, setShowAction] = useState(0);
  const [productId, setProductId] = useState("");

  useEffect(() => {
    setToken(_token);
  }, [_token]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setResponse({ code: 0, msg: "" });
    }, 4000);
    return () => clearTimeout(timer);
  }, [response]);

  useEffect(() => {
    const _jobs = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_URL}/categories/getSubParents`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({ categoryId: selectedCategory }),
        }
      );

      switch (response.status) {
        case 200:
          const data = await response.json();
          setSubCategories(data?.data);
          break;

        default:
          break;
      }
    };

    token && selectedCategory && _jobs();
  }, [token, selectedCategory]);

  const deleteHandler = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_URL}/categories/${productId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );

    switch (response.status) {
      case 200:
        setSubCategories((prevStates) =>
          prevStates.filter((prevState) => prevState.id !== productId)
        );
        break;

      case 403:
        setResponse({
          code: 409,
          msg: "شماقادر به حذف این دسته بندی نیستید",
        });
        break;

      default:
        setResponse({
          code: 500,
          msg: "خطای سمت سرور ، لطفا بعدا تلاش کنید",
        });

        break;
    }
  };

  if (subCategories.length == 0) {
    return (
      <div className=" w-fit mx-auto  pt-10 pb-12 px-20 my-24">
        <div className="w-fit mx-auto mb-4">
          <img src={errIcn} className="w-24 h-24" />
        </div>
        <div className="text-[#6D6F72] text-2xl">
          زیر دسته برای این دسته بندی وجود ندارد.
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 my-20 gap-6">
      {response.code !== 0 && (
        <div className="fixed top-8 right-0 w-fit whitespace-nowrap text-[#434242] text-sm flex flex-row bg-[#FFF099] py-2 pr-14 pl-24  rounded-sm my-auto">
          <img src={WarningIcon} alt="آیکن هشدار" className="my-auto w-6 h-6" />

          <div
            style={{ direction: "rtl" }}
            className="my-auto mr-2 text-[#D76B00]"
          >
            {response.msg}
          </div>
        </div>
      )}
      {subCategories?.map((item, index) => {
        return (
          <div key={item.id} className="hover:bg-[#F7F7F7] rounded-[8px]">
            <div className=" w-full flex  justify-end relative px-4 mt-4">
              <div
                onClick={() => {
                  setShowAction(item?.id);
                }}
                className={
                  "bg-[#D9D9D9] rounded-[4px] px-2 py-[7px] ml-1 cursor-pointer"
                }
              >
                <img
                  src={dotsIconGray}
                  className={`${showAction === item?.id && "brightness-0"}`}
                />
              </div>
              {showAction === item?.id && (
                <div>
                  <div
                    onClick={() => {
                      setShowAction(0);
                    }}
                    className="fixed w-screen h-screen top-0 left-0  "
                  />
                  <div className="absolute top-12 left-4 w-36 bg-white rounded-[4px] p-3 shadow-[0_4px_15px_2px_rgba(0,0,0,0.13)]">
                    <div
                      onClick={() =>
                        navigate("/edit-sub-category", {
                          state: { id: item.id },
                        })
                      }
                      className="flex flex-row mb-2 cursor-pointer"
                    >
                      <img
                        src={editIcon}
                        className="w-5 h-5 my-auto mx-auto ml-2"
                      />
                      <span className="text-[#363636] w-24  text-right text-sm my-auto">
                        ویرایش دسته
                      </span>
                    </div>
                    <div
                      onClick={() => {
                        setProductId(item?.id);
                        setShowDeleteCategoryModal(true);
                      }}
                      className="flex flex-row cursor-pointer"
                    >
                      <img
                        src={removeIcon}
                        className="w-5 h-5 my-auto mx-auto ml-2"
                      />
                      <span className="text-[#A60014] w-24 text-right text-sm my-auto">
                        حذف دسته
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div
              className="cursor-pointer"
              onClick={() => {
                navigate("/products-per-subCat", { state: { id: item?.id } });
              }}
            >
              <div className="mx-auto w-[195px] h-[183px]">
                <img
                  src={`${
                    process.env.REACT_APP_URL
                  }/uploads/product/${item?.image
                    ?.replace(/\\/g, "/")
                    .split("/")
                    ?.pop()}`}
                  className="mx-auto w-full h-full object-contain"
                />
              </div>

              <p className="text-[#221D23] text-xl font-semibold py-8">
                {item?.name}
              </p>
            </div>
          </div>
        );
      })}

      <div className={`${showDeleteCategoryModal && " relative"} `}>
        {showDeleteCategoryModal &&
          ReactDOM.createPortal(
            <div>
              <div
                className="w-full h-full bg-[#4c4c4c]   opacity-60 fixed top-0 left-0 z-20 "
                onClick={() => setShowDeleteCategoryModal(false)}
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
                  <img src={CheckCircleIcon} className=" w-10 h-10 mx-auto" />
                </div>
                <div className="text-xl text-white mx-auto w-fit pt-3">
                  آیا از حذف این دسته بندی مطمئن هستید؟
                </div>
                <div className="mt-10 flex flex-row w-[75%] mx-auto">
                  <div
                    onClick={() => {
                      setShowDeleteCategoryModal(false);
                      setShowAction(0);
                    }}
                    className="border border-white bg-white text-center text-[#919191] text-lg mx-auto  py-2 rounded-[50px] cursor-pointer w-44 mr-2"
                  >
                    لغو
                  </div>

                  <div
                    onClick={() => {
                      setShowDeleteCategoryModal(false);
                      setShowAction(0);
                      deleteHandler();
                    }}
                    className="bg-[#FFDA8A] text-[#221D23] text-center text-lg mx-auto py-2 rounded-[50px] cursor-pointer w-44 ml-2"
                  >
                    حذف
                  </div>
                </div>
              </div>
            </div>,

            document.getElementById("modal")
          )}
      </div>
    </div>
  );
};

export default SubCateoriesCmp;
