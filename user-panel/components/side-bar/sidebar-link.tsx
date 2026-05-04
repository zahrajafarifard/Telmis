"use client"; 

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const SidebarLink = ({ href, iconSrc, hoverIconSrc, label }: {
  href: string;
  iconSrc: string;
  hoverIconSrc: string;
  label: string;
}) => {
  const currentPath = usePathname(); 
  const isActive = currentPath.includes(href); 

  return (
    <Link href={href}>
      <div
        className={`group flex flex-row-reverse pr-10 py-2 mb-5 ${
          isActive ? "bg-[#A60014]" : "hover:bg-[#A60014]"
        }`}
      >
        <Image
          src={iconSrc}
          width={24}
          height={24}
          alt=""
          className={`${isActive ? "hidden" : "group-hover:hidden"}`}
        />
        <Image
          src={hoverIconSrc}
          width={24}
          height={24}
          alt=""
          className={`${isActive ? "block" : "hidden group-hover:block"}`}
        />
        <span
          className={`text-lg leading-[31px] mr-5 ${
            isActive ? "text-white" : "text-[#221D23] group-hover:text-white"
          }`}
        >
          {label}
        </span>
      </div>
    </Link>
  );
};

export default SidebarLink;