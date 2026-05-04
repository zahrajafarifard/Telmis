"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

import starIcon from "@/public/images/shop/star.svg";
import shareIcon from "@/public/images/shop/share.svg";
import favIcon from "@/public/images/shop/favorite.svg";
import unfavIcon from "@/public/images/shop/unfavorite.svg";
import Description from "./description";
import Comments from "./comments";
import Specifications from "./specifications";
import SimilarProducts from "./similar-products";
import Modal from "@/components/shared/modal/page";
import { useRouter } from "next/navigation";
import CheckIcon from "@/public/images/shop/Check_ring.svg";
import CheckGreenIcon from "@/public/images/shop/Check_ring-green.svg";
import infoIcon from "@/public/images/shop/Info.svg";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  addToCart,
  // clearCart,
  // removeFromCart,
  clearResponse,
} from "@/store/slices/cart";
import Link from "next/link";
import { logOut } from "@/store/slices/token";

import "@/components/shop/shared/style.css";

type ProductCommentType = {
  id: number;
  rating: number;
  name: string;
  mail: string;
  text: string;
  createdAt: string;
};
type ProductVariableType = {
  id: number;
  ProductId: number;
  variable: string;
  ProductVariableItems: [{ id: number; value: string }];
};
type ProductImageType = {
  id: number;
  secondImage?: string;
  thirdImage?: string;
  fourthImage?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  ProductId: number;
};

type ProductType = {
  id: number;
  mainTitle: string;
  subTitle: string;
  // model: string;
  mainImage: string;
  price: number;
  count: number;
  discount: number;
  netPrice: number;
  description: string;
  bestSelling: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  categoryId: number;
  ProductImages: ProductImageType[];
  ProductComments: ProductCommentType[];
  ProductVariables: ProductVariableType[];
  ProductSpecifications: [
    { id: number; key: string; value: string; selected: boolean }
  ];
};

interface Props {
  item: ProductType;
  productId: number;
}

const Product: React.FC<Props> = ({ item, productId }) => {
  const dispatch = useDispatch();

  const router = useRouter();

  const [shareToast, setShareToast] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
    dispatch(clearResponse());
  };

  const nonZeroValues = item?.ProductComments?.filter(
    (num) => num.rating !== 0
  );
  const sum = nonZeroValues?.reduce((acc, num) => acc + num.rating, 0);

  const token = useSelector((state: RootState) => state.token.token);

  const [favoriteProduct, setFavoriteProduct] = useState<boolean>(false);

  const handleAddToCart = () => {
    const dynamicOptions = [];

    for (const [key, value] of Object.entries(selectedValues)) {
      dynamicOptions.push({ key, value });
    }

    let _item = {
      id: item?.id,
      name: item?.mainTitle,
      price: item?.price,
      quantity: 1,
      image: item.mainImage,
      discount: item.discount,
      count: item?.count,
      options: dynamicOptions,
    };

    dispatch(addToCart(_item));
  };

  const images = item?.ProductImages[0];
  const comments = item?.ProductComments;

  const [activeImage, setActiveImage] = useState({
    indicator: 0,
    url: item.mainImage,
  });
  const [selectedItem, setSelectedItem] = useState<number>(1);

  const _responseFromCart = useSelector(
    (state: RootState) => state.cart.response
  );

  // useEffect(() => {
  //   if (_responseFromCart === 400) {
  //     const timer = setTimeout(() => {
  //       dispatch(clearResponse());
  //     }, 3000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [_responseFromCart]);

  useEffect(() => {
    const _favProduct = async () => {
      const _response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/getFavProduct`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            productId: item?.id,
          }),
        }
      );

      switch (_response.status) {
        case 200:
          const _data = await _response.json();

          if (_data?.data) {
            setFavoriteProduct(true);
          }

          break;

        default:
          break;
      }
    };

    if (token) {
      _favProduct();
    }
  }, [token, setFavoriteProduct]);

  const handleShare = () => {
    const currentUrl = window.location.href;
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        setShareToast(true);
      })
      .catch((err) => {
        console.error("Failed to copy URL: ", err);
      });
  };

  const Thumbnail = (imageUrl: string, indicator: number) => {
    return (
      <div>
        <div
          onClick={() => setActiveImage({ indicator, url: imageUrl })}
          className="relative h-[70px] w-20 rounded-[4px] border-[2px] border-[#BFBFBF] "
        >
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/product/${imageUrl
              ?.replace(/\\/g, "/")
              ?.split("/")
              ?.pop()}`}
            fill
            alt="عکس محصول"
            className="object-contain py-2"
            quality={100}
          />
        </div>
        {activeImage.indicator === indicator && (
          <div className="w-full rounded-[50px] h-1.5 bg-[#C4161C] mt-4" />
        )}
      </div>
    );
  };

  const addToFavoriteHandler = async () => {
    const _response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/addToFavorite`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          productId: item?.id,
        }),
      }
    );

    switch (_response.status) {
      case 201:
        const _data = await _response.json();

        if (_data?.data) {
          setFavoriteProduct(true);
        } else {
          setFavoriteProduct(false);
        }

        break;

      default:
        break;
    }
  };

  useEffect(() => {
    if (shareToast) {
      const timer = setTimeout(() => {
        setShareToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [shareToast]);
  const [selectedValues, setSelectedValues] = useState<any>({});

  const handleChange = (variableId: any, selectedOptionId: any) => {
    setSelectedValues((prev: any) => ({
      ...prev,
      [variableId]: selectedOptionId,
    }));
  };

  useEffect(() => {
    if (item?.ProductVariables) {
      const initialValues: any = {};
      item.ProductVariables.forEach((variable) => {
        const firstOption = variable?.ProductVariableItems?.[0];
        if (firstOption) {
          initialValues[variable.variable] = firstOption.value;
        }
      });
      setSelectedValues(initialValues);
    }
  }, [item]);

  return (
    <div>
      <hr className="border-[1px] border-[#d9d9d9]" />
      <div className="w-[80%] mx-auto screen750:w-[90%]">
        {shareToast && (
          <div className="bg-[#CBEDCB] text-[#219235] fixed top-28 z-50 right-0 flex flex-row-reverse pr-14 w-80 py-2 rounded-s-[8px] ">
            <Image
              src={CheckGreenIcon}
              width={24}
              height={24}
              alt="info"
              className="ml-4"
            />
            .لینک در کلیپ بورد کپی شد
          </div>
        )}

        <div className="text-right my-14 flex flex-row justify-end">
          <div
            style={{ direction: "rtl" }}
            className="text-[#221D23] text-lg tracking-[0.22px]"
          >
            {item?.mainTitle}
          </div>
          <span
            style={{ direction: "ltr" }}
            className="text-[#221D23] text-lg tracking-[0.22px]"
          >
            /
          </span>
          <span className="text-[#919191] text-lg tracking-[0.22px]">
            فروشگاه/
          </span>
          <span className="text-[#919191] text-lg tracking-[0.22px]">خانه</span>
        </div>
        <div
          style={{ direction: "rtl" }}
          className="bg-[#D9D9D9] pt-[42px] pb-[51px] rounded-[8px]  grid grid-cols-3 relative mb-8  screen950:pb-8 screen950:pt-3
          screen630:flex screen630:flex-col screen630:items-center screen630:gap-6"
        >
          <div className="absolute col-span-1 col-start-1 w-[90%] mx-auto my-auto inset-0 screen630:absolute   screen630:w-full screen630:flex screen630:justify-center">
            <div className="relative h-full screen630:h-[300px] screen630:w-[90%]">
              <Image
                src={`${
                  process.env.NEXT_PUBLIC_API_URL
                }/uploads/product/${activeImage?.url
                  ?.replace(/\\/g, "/")
                  ?.split("/")
                  ?.pop()}`}
                fill
                alt="عکس محصول"
                className="object-contain w-full h-full"
                quality={100}
              />
            </div>
          </div>
          <div className="col-start-2 col-span-2 w-[90%] screen1270:w-[94%] screen630:w-full screen630:text-center screen630:mt-[220px]">
            <h1 className="text-[#2B2B2B] text-right font-bold text-[50px] mb-3 screen1270:text-[40px] screen630:text-center screen630:text-[32px] screen630:px-2">
              {item?.mainTitle}
            </h1>
            <h2 className="text-[#848484] text-right font-bold mb-3 text-[24px] screen630:text-center screen630:text-[24px] screen630:px-2">
              {item?.subTitle}
            </h2>

            <div className="flex flex-row space-x-3 space-x-reverse my-4 screen630:flex-col ">
              <div
                style={{ direction: "rtl" }}
                className="text-[#3CCE94] text-[36px] font-bold text-right my-auto screen1270:text-[18px] screen630:text-center"
              >
                <span className="screen630:text-[32px] ">
                  {Number(item?.price - item?.discount).toLocaleString()}
                </span>
                <span className="screen630:text-[24px] ">تومان</span>
              </div>

              {item?.price - item?.discount === item?.price ? (
                <div></div>
              ) : (
                <div
                  style={{ direction: "rtl" }}
                  className="text-[#919191] text-lg font-bold text-right line-through my-auto screen1270:text-[16px] screen630:text-center screen630:text-[18px] "
                >
                  <span>{Number(item?.price).toLocaleString()}</span>
                  <span className="">تومان</span>
                </div>
              )}
            </div>

            <div className="flex flex-row space-x-3 space-x-reverse">
              {item?.ProductSpecifications?.filter((s) => s.selected)?.map(
                (element) => {
                  return (
                    <div
                      key={element.id}
                      className="bg-[#EDEDF3] rounded-[12px] flex-grow p-2"
                    >
                      <div className="mb-2 text-[#919191]">{element?.key}</div>
                      <div className="text-[#221D23]">{element?.value}</div>
                    </div>
                  );
                }
              )}

              {item?.ProductSpecifications?.length ? (
                <Link
                  href="#moreInfo"
                  className="bg-[#EDEDF3] rounded-[12px] w-[70px] flex justify-center items-center"
                >
                  <span className="w-1 h-1 rounded-full bg-[#33363F]"></span>
                  <span className="w-1 h-1 rounded-full bg-[#33363F] mx-0.5"></span>
                  <span className="w-1 h-1 rounded-full bg-[#33363F]"></span>
                </Link>
              ) : null}
            </div>

            {item?.ProductVariables?.map((element) => {
              return (
                <div key={element?.id} className="flex flex-row my-6">
                  <div className="text-[#221D23] text-lg text-right w-[20%] my-auto">
                    {element?.variable} :
                  </div>

                  <select
                    value={selectedValues[element?.variable]}
                    onChange={(e) =>
                      handleChange(element?.variable, e.target.value)
                    }
                    className="w-[50%] py-2 px-4 rounded-md outline-none my-auto"
                  >
                    {element?.ProductVariableItems.map((i) => (
                      <option key={i.id} value={i.value}>
                        {i.value}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}

            <div className="flex flex-row justify-between mt-14 screen1050:flex-col screen630:items-center">
              <div
                onClick={handleAddToCart}
                className="button w-fit py-3 px-8 cursor-pointer"
              >
                <span className="button-hover-effect"></span>
                <div className="button-hover-effect-text text-lg screen1270:text-base screen630:text-[18px] ">
                  افزودن به سبد خرید
                </div>
              </div>

              <div className="flex flex-row-reverse space-x-4 mt-auto screen1270:space-x-2 screen1050:ml-auto screen1050:mt-5 screen630:items-center screen630:mx-auto">
                <Image
                  onClick={() => {
                    if (!token) {
                      //open login form
                      // setIsModalOpen(true); //modal login
                    } else {
                      addToFavoriteHandler();
                    }
                  }}
                  src={favoriteProduct ? favIcon : unfavIcon}
                  width={30}
                  height={30}
                  alt="مورد علاقه"
                  className="my-auto screen1270:w-7 screen1270:h-7 cursor-pointer"
                />
                <Image
                  onClick={handleShare}
                  src={shareIcon}
                  width={30}
                  height={30}
                  alt="اشتراک گذاری"
                  className="my-auto screen1270:w-7 screen1270:h-7 cursor-pointer"
                />
                <Image
                  src={starIcon}
                  width={30}
                  height={30}
                  alt="ستاره"
                  className="my-auto screen1270:w-7 screen1270:h-7"
                />

                <span className="text-[#919191] text-lg my-auto screen1270:text-[16px] screen630:text-[18px] ">
                  (دیدگاه کاربر
                  {nonZeroValues?.length
                    ? (sum / nonZeroValues?.length).toFixed(1)
                    : "0"}
                  )
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row space-x-4 ">
          {item.mainImage && Thumbnail(item.mainImage, 0)}
          {images?.secondImage && Thumbnail(images.secondImage, 1)}
          {images?.thirdImage && Thumbnail(images.thirdImage, 2)}
          {images?.fourthImage && Thumbnail(images.fourthImage, 3)}
        </div>

        <div id="moreInfo" className="my-40 screen750:my-20">
          <div className="relative flex flex-row-reverse justify-between">
            <div className="flex flex-row-reverse space-x-14 space-x-reverse">
              <div
                onClick={() => setSelectedItem(1)}
                className={`py-4  cursor-pointer text-2xl screen1250:text-xl screen750:text-[18px] screen750:leading-[36px] ${
                  selectedItem === 1
                    ? "border-b-4 border-b-red-700 text-[#221D23]"
                    : "text-[#D9D9D9]"
                }`}
              >
                توضیحات
              </div>
              <div
                onClick={() => setSelectedItem(2)}
                className={`py-4  cursor-pointer text-2xl screen1250:text-xl screen750:text-[18px] screen750:leading-[36px] ${
                  selectedItem === 2
                    ? "border-b-4 border-b-red-700 text-[#221D23]"
                    : "text-[#D9D9D9]"
                }`}
              >
                مشخصات
              </div>
              <div
                onClick={() => setSelectedItem(3)}
                className={`py-4  cursor-pointer text-2xl screen1250:text-xl screen750:text-[18px] screen750:leading-[36px] ${
                  selectedItem === 3
                    ? "border-b-4 border-b-red-700 text-[#221D23]"
                    : "text-[#D9D9D9]"
                }`}
              >
                نظرات ({item?.ProductComments?.length})
              </div>
            </div>
            <div className="w-full border absolute bottom-[1px] -z-10" />
          </div>

          {selectedItem === 1 ? (
            <div>
              <Description item={item?.description} />
            </div>
          ) : selectedItem === 2 ? (
            <div>
              <Specifications item={item?.ProductSpecifications} />
            </div>
          ) : (
            <div>
              <Comments productId={item?.id} comments={comments} />
            </div>
          )}
        </div>

        <div>
          <SimilarProducts
            categoryId={item?.categoryId}
            productId={productId}
          />
        </div>

        {_responseFromCart == 400 && (
          <Modal isOpen={true} onClose={closeModal}>
            <Image
              src={infoIcon}
              width={84}
              height={84}
              alt="ایکن عملیات موفق"
              className="mx-auto screen1250:w-16 screen1250:h-16"
            />
            <div
              style={{ direction: "rtl" }}
              className="text-white text-center  mt-3 mb-6 text-xl px-4 screen850:text-base screen620:text-sm "
            >
              تعداد کالای انتخابی بیشتر از موجودی است.
            </div>

            <div
              onClick={() => {
                closeModal();

                dispatch(clearResponse());
              }}
              className="bg-[#FFDA8A] w-fit px-6 py-1 mx-auto  rounded-[50px] text-lg cursor-pointer screen850:text-base screen620:text-sm "
            >
              بازگشت به فروشگاه
            </div>
          </Modal>
        )}

        {_responseFromCart == 200 && (
          <Modal isOpen={true} onClose={closeModal}>
            <Image
              src={CheckIcon}
              width={84}
              height={84}
              alt="ایکن عملیات موفق"
              className="mx-auto screen1250:w-16 screen1250:h-16"
            />
            <div
              style={{ direction: "rtl" }}
              className="text-white text-center  mt-3 mb-6 text-xl px-4 screen850:text-base screen620:text-sm "
            >
              این کالا به سبد خرید اضافه شد!
            </div>
            <div className="flex flex-row-reverse space-x-5 space-x-reverse w-fit mx-auto">
              <div
                onClick={() => {
                  closeModal();
                  router.push("/shop/cart");
                  dispatch(clearResponse());
                }}
                className="bg-[#FFDA8A] w-fit px-6 py-1 mx-auto  rounded-[50px] text-lg cursor-pointer screen850:text-base screen620:text-sm "
              >
                برو به سبد خرید
              </div>
              <div
                onClick={() => {
                  closeModal();
                  dispatch(clearResponse());
                }}
                className="bg-[#FFF] w-fit px-6 py-1 mx-auto text-[#6D6F72] rounded-[50px] text-lg cursor-pointer screen850:text-base screen620:text-sm "
              >
                ادامه دادن خرید
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Product;
