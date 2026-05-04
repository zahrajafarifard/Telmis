import React from "react";
import Header from "@/components/header/page";
import SideBar from "@/components/side-bar/page";

export default function SpecialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row-reverse">
      <aside className="w-[23%] shadow-[0_0_7px_0_rgba(0,0,0,0.17)]">
        <SideBar />
      </aside>

      <div className="w-[77%]  ">
        <header className="">
          <Header />
        </header>

        <main className="">{children}</main>
      </div>
    </div>
  );
}
