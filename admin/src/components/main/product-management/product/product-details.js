import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import dotsIconGray from "../../../../assets/images/dots-gray.svg";
import editIcon from "../../../../assets/images/Edit.svg";
import removeIcon from "../../../../assets/images/Remove.svg";
import CheckCircleIcon from "../../../../assets/images/Check_ring.svg";
import modalImage from "../../../../assets/images/modalBack.png";

const ProductDetails = ({ item, index, setProducts }) => {
  const navigate = useNavigate();
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);

  const _token = useSelector((state) => state.reducer.token);
  const [token, setToken] = useState("");

  useEffect(() => {
    setToken(_token);
  }, [_token]);

  const [showAction, setShowAction] = useState(0);
  const [productId, setProductId] = useState("");

  const deleteHandler = async () => {
    let response;

    response = await fetch(
      `${process.env.REACT_APP_URL}/products/${productId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    await response.json();

    switch (response.status) {
      case 200:
        setProducts((prevStates) =>
          prevStates.filter((prevState) => prevState.id !== productId)
        );

        break;

      default:
        break;
    }
  };

  return (
    <div>
      <div className=" w-full flex  justify-end relative px-4 ">
        <div
          onClick={() => {
            setShowAction(item?.id);
          }}
          className={"bg-[#D9D9D9] rounded-[4px] px-2 py-[7px] "}
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
                  navigate("/edit-product", { state: { id: item.id } })
                }
                className="flex flex-row mb-2 cursor-pointer"
              >
                <img src={editIcon} className="w-5 h-5 my-auto mx-auto ml-2" />
                <span className="text-[#363636] w-24  text-right text-sm my-auto">
                  ویرایش محصول
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
                  حذف محصول
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div
        className={`${
          (index + 1) % 4 === 0 ? "" : "border-l border-[#DFDFDF]"
        }  p-4 `}
      >
        <img
          src={`${process.env.REACT_APP_URL}/uploads/product/${item.mainImage
            ?.replace(/\\/g, "/")
            ?.split("/")
            ?.pop()}`}
          className="mx-auto w-[200px] h-[185px] object-contain"
        />
        <div className="mt-10 mb-5 text-[#221D23] text-center font-semibold">
          {item?.mainTitle}
        </div>
      </div>
      <div className="text-[#27AF37] ">
        <span className="">{Number(item?.price).toLocaleString()}</span>
        <span className="text-[9px] pr-[2px]">تومان</span>
      </div>

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
                  آیا از حذف این محصول مطمئن هستید؟
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

export default ProductDetails;
