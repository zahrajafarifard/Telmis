import React from "react";
import ShopHeader from "./shop-header";
import ShopBody from "./shop-body";
import ExchangeHeader from "./exchange-header";

const Banner = () => {
  return (
    <div className="w-[90%] mx-auto my-8">
      <ShopHeader />
      <ShopBody />
      <ExchangeHeader />
    </div>
  );
};

export default Banner;
