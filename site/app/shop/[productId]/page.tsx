import React from "react";

import ProductCmp from "@/components/shop/product/page";

interface ProductProps {
  params: {
    productId: string;
  };
}

const Product = async ({ params }: ProductProps) => {
  const { productId } = await params;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/getproductById/${productId}`,
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  // if (!response.ok) {
  //   return <div>Failed to load product data</div>;
  // }

  const product = await response.json();
  const item = await product?.data;

  return (
    <div className="">
      <ProductCmp item={item} productId={+productId} />
    </div>
  );
};

export default Product;
