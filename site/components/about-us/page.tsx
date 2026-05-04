import React from "react";
import Header from "./header";
import ContactUs from "../shared/contact-us/page";
import FirstChild from "./first-child";
import SecondChild from "./second-child";
import ThirdChild from "./third-child";

const AboutUs = () => {
  return (
    <div>
      <Header
        title="درباره ما"
        text="داده پردازان تلمیس، از 0 تا 1 همراه شما"
      />
      <FirstChild />
      <SecondChild />
      <ThirdChild />

      <ContactUs />
    </div>
  );
};

export default AboutUs;
