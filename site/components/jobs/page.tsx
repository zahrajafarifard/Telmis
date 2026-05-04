import React from "react";
import HeaderCmp from "./header";
import FirstChild from "./first-child";
import SecondChild from "./why-us/page";
import ContactUs from "../shared/contact-us/page";

const Job = () => {
  return (
    <div>
      <HeaderCmp title="موقعیت شغلی" text="" />
      <FirstChild />
      <SecondChild />
      <ContactUs />
    </div>
  );
};

export default Job;
