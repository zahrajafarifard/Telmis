import React from "react";
import Header from "./header";
import ContactUsCmp from "../shared/contact-us/page";
import FirstChild from "./first-child";
const ContactUs = () => {
  return (
    <div>
      <Header
        title="تماس با ما"
        text="داده پردازان تلمیس، از 0 تا 1 همراه شما"
      />

      <FirstChild />
      <ContactUsCmp />
    </div>
  );
};

export default ContactUs;
