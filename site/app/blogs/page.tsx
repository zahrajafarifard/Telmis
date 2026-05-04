import React from "react";
import BlogsCmp from "@/components/blogs/blogs/page";

const Blogs = ({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) => {
  const sort = searchParams?.sort;
  const category = searchParams?.category;

  return (
    <div>
      <BlogsCmp sort={sort} category={category} />
    </div>
  );
};

export default Blogs;
