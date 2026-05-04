import React from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";

interface MemberDetailsProps {
  img: string | StaticImageData;
  name: string;
  position: string;
  linkedIn: string;
  telegram: string;
  insta: string;
}
const MemberDetails: React.FC<MemberDetailsProps> = ({
  img,
  name,
  position,
  linkedIn,
  telegram,
  insta,
}) => {
  return (
    <div className="flex flex-col items-center mx-4   min-w-48 screen1050:mx-3  pb-2">
      <Image
        src={img}
        width={310}
        height={290}
        alt="عکس"
        className="rounded-[10px] "
      />
      <div className="text-[#333] text-lg mt-2">{name}</div>
      <div className="text-[#919191] text-sm ">{position}</div>
      <div className="w-full flex flex-row mx-auto justify-center mt-4">
        <Link
          target="_blank"
          rel="noreferrer"
          href={linkedIn}
          className=" p-2.5 rounded-full shadow-md transform transition-transform duration-700 hover:scale-110"
        >
          <Image
            src="/images/footer-linkedIn.svg"
            width={20}
            height={20}
            alt="لینکداین"
          />
        </Link>
        <Link
          target="_blank"
          rel="noreferrer"
          href={telegram}
          className="mx-4 p-2.5 rounded-full shadow-md transform transition-transform duration-700 hover:scale-110"
        >
          <Image
            src="/images/footer-telegram.svg"
            width={20}
            height={20}
            alt="تلگرام"
          />
        </Link>
        <Link
          target="_blank"
          rel="noreferrer"
          href={insta}
          className=" p-2.5 rounded-full shadow-md transform transition-transform duration-700 hover:scale-110"
        >
          <Image
            src="/images/footer-instagram.svg"
            width={20}
            height={20}
            alt="اینستاگرام"
          />
        </Link>
      </div>
    </div>
  );
};

export default MemberDetails;
