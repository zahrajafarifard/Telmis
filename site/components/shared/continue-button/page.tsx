import React from "react";
import Link from "next/link";
interface PropsType {
  link: string;
}
const ContinueButton: React.FC<PropsType> = ({ link }) => {
  return (
    <div>
      <Link href={link}>
        <div
          className="w-fit text-lg text-white rounded-full py-3 px-20 bg-[#C4161C]  mt-10 relative overflow-hidden group
            screen1100:mt-8 screen1100:py-2 screen1100:px-14 screen890:mt-4 screen890:py-1.5 screen890:px-12 screen890:text-base
            screen750:py-1 screen750:px-10 screen690:text-lg screen690:px-16 screen690:py-3 screen500:py-2 "
        >
          <span className="absolute bottom-0 right-0 w-80 h-80 transition-all duration-700 opacity-0 scale-0 bg-[#FFDA8A] rounded-full group-hover:opacity-100 group-hover:scale-150"></span>
          <span className="relative z-0 group-hover:text-black">ادامه بده</span>
        </div>
      </Link>
    </div>
  );
};

export default ContinueButton;
