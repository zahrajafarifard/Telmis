import React from "react";
import Header from "./header";
import Main from "./main";

const Blog = () => {
  return (
    <div>
      <Header showSearch={false} />
      <Main />
    </div>
  );
};

export default Blog;
