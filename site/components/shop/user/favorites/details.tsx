import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import starIcon from "@/public/images/shop/star.svg";
import favIcon from "@/public/images/shop/favorite.svg";
import cartIcon from "@/public/images/shop/Basket.svg";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { addToCart, clearResponse } from "@/store/slices/cart";
import Modal from "@/components/shared/modal/page";
import CheckIcon from "@/public/images/shop/Check_ring.svg";
import infoIcon from "@/public/images/shop/Info.svg";

const Details: React.FC<any> = ({ item, setFavoriteProducts }) => {

  const router = useRouter();
  const dispatch = useDispatch();

  const _token = useSelector((state: RootState) => state.token.token);
  ////////////////////////////

  const [favoriteProduct, setFavoriteProduct] = useState<boolean>(false);

  const _responseFromCart = useSelector(
    (state: RootState) => state.cart.response
  );


  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
    dispatch(clearResponse());
  };

  //////////////////////////////

  const total = item?.ProductComments?.reduce(
    (sum: number, obj: { rating: number }) => sum + obj.rating,
    0
  );

  let average =
    total && item?.Product?.ProductComments?.length > 0
      ? total / item?.Product?.ProductComments.length
      : 0;

  const handleAddToCart = () => {
    const options = item?.Product?.ProductVariables?.map((v: any) => ({
      key: v?.variable,
      value: v?.ProductVariableItems[0]?.value ?? "",
    }));

    const _item = {
      id: item?.Product?.id,
      name: item?.Product?.mainTitle,
      price: item?.Product?.price,
      quantity: 1,
      image: item?.Product?.mainImage,
      discount: item?.Product?.discount,
      count: item?.Product?.count,
      options,
    };

    dispatch(addToCart(_item));
  };

  const deleteFavoriteHandler = async () => {
    const _response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/addToFavorite`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + _token,
        },
        body: JSON.stringify({
          productId: item?.Product?.id,
        }),
      }
    );

    switch (_response.status) {
      case 201:
        const _data = await _response.json();

        setFavoriteProducts((prev: any) => {
          return prev.filter((item: any) => item?.id !== _data?.id);
        });

        break;

      default:
        break;
    }
  };

  return (
    <div className="group relative">
      <div className="bg-[#f2f2f2] rounded-[8px] relative">
        <div className="pb-6">
          <div className="absolute top-3 right-4 group-hover:flex flex-col space-y-0.5 w-fit h-fit hidden">
            <div
              className="mb-1"
              onClick={() => {
                deleteFavoriteHandler();
              }}
            >
              <Image
                src={favIcon}
                width={20}
                height={20}
                alt="علاقه مندی"
                className="mx-auto my-auto"
              />
            </div>
            <div
              onClick={() => {
                handleAddToCart();
              }}
            >
              <Image
                src={cartIcon}
                width={20}
                height={20}
                alt="سبد خرید"
                className="mx-auto my-auto brightness-0"
              />
            </div>
          </div>
          {item?.Product?.discount ? (
            <div className="absolute top-4 left-3 bg-white px-2 rounded-[4px] py-[2px]">
              <div className="text-[#A60014] font-semibold text-sm">
                <span>{Number(item?.Product?.discount).toLocaleString()}</span>
                <span className="mr-0.5">تخفیف</span>
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </div>

        <Image
          onClick={() => {
            router.push(`/shop/${item.Product?.id}`);
          }}
          src={
            item?.Product?.mainImage
              ? `${
                  process.env.NEXT_PUBLIC_API_URL
                }/uploads/product/${item?.Product?.mainImage
                  .split(/\\|\//)
                  .pop()}`
              : "/placeholder.jpg"
          }
          alt="File preview"
          width={200}
          height={150}
          className="my-auto mx-auto w-full h-[200px] mt-11 pb-14 px-8 cursor-pointer transition-transform duration-400 group-hover:scale-105"
        />
      </div>
      <div
        onClick={() => {
          router.push(`/shop/${item.Product?.id}`);
        }}
        className="cursor-pointer"
      >
        {average ? (
          <div className="flex flex-row justify-end mt-2 mb-1">
            <span className="my-auto pt-1 text-xs">{average}</span>

            <Image
              src={starIcon}
              alt="rating"
              width={18}
              height={18}
              className="my-auto mr-1"
            />
          </div>
        ) : (
          <div className="flex flex-row justify-end mt-2 mb-1 invisible">
            <span className="my-auto pt-1 text-xs">{average}</span>

            <Image
              src={starIcon}
              alt="rating"
              width={18}
              height={18}
              className="my-auto mr-1"
            />
          </div>
        )}
        <div className="text-[#222222] text-justify text-sm leading-6 line-clamp-1 hover:line-clamp-none">
          {item?.Product?.mainTitle}
        </div>
        <div className="text-[#222222] text-justify text-sm leading-6 line-clamp-1 hover:line-clamp-none">
          {item?.Product?.subTitle}
        </div>

        <div className="flex flex-row justify-between mt-1">
          {item?.Product?.discount ? (
            <div className="text-[#666] line-through">
              {Number(item?.Product?.price).toLocaleString()}
            </div>
          ) : (
            <div></div>
          )}
          <div className="text-[#A60014] font-bold ">
            {Number(
              item?.Product?.price - item?.Product?.discount
            ).toLocaleString()}{" "}
            تومان
          </div>
        </div>
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
          <div className="flex flex-row space-x-5 space-x-reverse w-fit mx-auto">
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
  );
};

export default Details;
