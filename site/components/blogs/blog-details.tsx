import React, { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import moment from "moment-jalaali";

interface Blog {
  id: number;
  articleTitle: string;
  shortDescription: string;
  author: string;
  mainImage: string;
  ArticleType: { id: number; type: string };
  createdAt: string;
}
interface Props {
  item: Blog;
}
const BlogDetails: FC<Props> = ({ item }) => {
  moment.loadPersian({ usePersianDigits: true, dialect: "persian-modern" });

  return (
    <div className="h-full group relative">
      <div
        className="rounded-[23px] p-6 h-full "
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(29,29,29,0.00), rgba(0,0,0,0.89)),url("${process.env.NEXT_PUBLIC_API_URL}/uploads/article/${item?.mainImage}")`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          direction: "rtl",
        }}
      >
        <div
          className="absolute flex flex-col  justify-center items-center inset-0 group-hover:bg-gradient-to-b from-[#A60014]/75 via-black/80 to-[#000]
           z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[23px]"
        >
          <div className="text-white px-10 text-[27px] leading-[43px] font-semibold text-center shadow-[0px_4px_6px_1px_rgba(0,0,0,0.13)]">
            {item?.articleTitle}
          </div>
          <div className="text-white px-10 text-center my-3 leading-[32px] line-clamp-2">
            {item?.shortDescription}
          </div>
          <Link href={`blog/${item?.id}`} className="cursor-pointer ">
            <div className="text-white bg-[#A60014] rounded-[50px] py-2 px-12 text-lg ">
              مطالعه بیشتر
            </div>
          </Link>
        </div>

        <div className="bg-gradient-to-r from-[#A60014] to-[#600B0E] text-white w-fit  text-center px-5 py-2 rounded-[6px] mb-4">
          {item?.ArticleType?.type}
        </div>

        <div
          className="text-white  text-2xl leading-[43px] font-[600]  pt-64 mb-9
        screen1650:pt-52
        screen1540:pt-40
        screen1460:text-xl
        screen1460:leading-[34px]
        screen1360:pt-36
        screen1150:pt-32
        screen1000:pt-40
        "
        >
          {item?.articleTitle}
        </div>

        <div className="flex flex-row-reverse justify-between my-auto mt-14">
          <div
            className="text-[#A3A3A3] leading-[31px] my-auto left-8 absolute bottom-5
          screen1150:text-sm
          screen1150:bottom-6
          screen1150:left-7
          "
          >
            {moment(item?.createdAt).format("jDD jMMMM  jYYYY")}
          </div>
          <div className="flex flex-row justify-between absolute bottom-6 right-6">
            <div
              className="ml-4 w-10 h-10 rounded-full border my-auto
            screen1150:ml-2
            "
            >
              <Image src="/images/avatar.png" width={40} height={40} alt="" />
            </div>
            <div>
              <div className="text-white  leading-[25px] font-bold ">
                {item?.author}
              </div>
              <div className="flex flex-row">
                <span className="">
                  <Image
                    src="/images/Icon  3.png"
                    width={20}
                    height={20}
                    alt=""
                  />
                </span>
                <span className="text-[#A3A3A3]  text-xs my-auto">
                  نویسنده مقاله
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
