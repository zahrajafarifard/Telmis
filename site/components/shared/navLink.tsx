import { FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx"; // Helps clean up className conditions

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

const NavLink: FC<NavLinkProps> = ({ href, children }) => {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);
  const isHome = pathname === "/";

  return (
    <Link href={href}>
      <div
        className={clsx(
          "py-1 flex items-center screen1000:px-[5%] screen1000:hover:text-white",
          "screen1250:text-base screen1000:text-2xl screen750:text-xl",
          {
            "text-[#A60014] screen1000:bg-[#A60014] screen1000:text-white": isActive && !isHome,
            "text-[#FFDA8A] screen1000:bg-[#A60014] screen1000:text-white": isActive && isHome,
            "text-[#221D23] hover:text-[#A60014]": !isActive && !isHome,
            "text-white screen1000:text-[#221D23] hover:text-[#FFDA8A]": !isActive && isHome,
          }
        )}
      >
        {children}
      </div>
    </Link>
  );
};

export default NavLink;
