import Banner from "@/components/home-page/banner/page";
import Clients from "@/components/home-page/clients/page";
import HeaderHomePage from "@/components/home-page/header/page";
import ISO from "@/components/home-page/iso/page";
import Members from "@/components/home-page/members/page";
import Services from "@/components/home-page/services/page";
import WhyUs from "@/components/home-page/why-us/page";
import ContactUs from "@/components/shared/contact-us/page";

export default function Home() {
  return (
    <div className="">
      <HeaderHomePage />
      <ISO />
      <Services />
      <WhyUs />
      <Banner />
      <Clients />
      <Members />
      <ContactUs />
    </div>
  );
}
