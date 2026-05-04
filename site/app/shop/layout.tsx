import React from "react";

import FetchInterceptor from "@/app/response-interceptor";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "فروشگاه داده پردازان تلمیس",
};
export default function SpecialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <main className="">
        <FetchInterceptor />
        {children}
      </main>
    </div>
  );
}
