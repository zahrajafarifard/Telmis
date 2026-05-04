import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Footer from "@/components/footer/page";
import Header from "@/components/header/page";
import { ReduxProvider } from "@/store/ReduxProvider";

const PeydaRegular = localFont({
  src: "../public/fonts/PeydaFaNum-Regular.ttf",
  // variable: "--font-geist-sans",
  // weight: "100 900",
});
const PeydaBlack = localFont({
  src: "../public/fonts/Peyda-Black.ttf",
  // variable: "--font-geist-sans",
  // weight: "100 900",
});

export const metadata: Metadata = {
  title: "داده پردازان تلمیس",
  description:
    "شرکت داده‌پردازان تلمیس ارائه‌دهنده خدمات تخصصی شبکه، برنامه‌نویسی، طراحی سامانه‌های نرم‌افزاری و پشتیبانی فناوری اطلاعات برای سازمان‌ها و کسب‌وکارها.",

  icons: {
    icon: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa">
      <body className={PeydaRegular.className}>
        <ReduxProvider>
          <header
            className="screen1000:sticky
            screen1000:z-40 screen1000:top-0   "
          >
            <Header />
          </header>
          {children}
          <div id="modal" />
          <footer>
            <Footer />
          </footer>
        </ReduxProvider>
      </body>
    </html>
  );
}

export { PeydaBlack };
