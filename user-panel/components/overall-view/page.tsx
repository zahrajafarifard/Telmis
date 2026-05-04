"use client";

import React from "react";

import Products from "./right-side/product";
import LatestProducts from "./right-side/latest-product/latest";
import LatestOrders from "./right-side/orders/page";
import Profile from "./left-side/profile/page";
import Notification from "./left-side/notifications/page";

const OverallView = () => {
  return (
    <div className="flex flex-row w-[98%] justify-end pt-10 ">
      <div className="w-[28%] bg-[#F7F7F7] rounded-e-[16px] mr-[2%] ">
        <Profile />
        <Notification />
      </div>
      <div className="w-[70%] ">
        <Products />
        <LatestProducts />
        <LatestOrders />
      </div>
    </div>
  );
};

export default OverallView;
