"use client";

import React, { useEffect, useState } from "react";
import BlogCmp from "@/components/blogs/blog/page";
import Newest from "@/components/blogs/third";

interface BlogProps {
  params: Promise<{ id: number }>;
}

interface ArticleType {
  id: number;
  articleTitle: string;
  shortDescription: string;
  author: string;
  mainImage: string;
  ArticleType: { id: number; type: string };
  createdAt: string;
  sectionOneTitle: string;
  sectionOneText: string;
  sectionTwoImage: string;
  sectionTwoTitle: string;
  sectionTwoText: string;
  sectionThreeTitle: string;
  sectionThreeText: string;
}

const Blog: React.FC<BlogProps> = ({ params }) => {
  const [article, setArticle] = useState<ArticleType | null>(null);
  const [id, setId] = useState<number | null>(null);

  // Resolve the `params` promise and extract `id`
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };

    resolveParams();
  }, [params]);

  // Fetch article once `id` is resolved
  useEffect(() => {
    // if (!id) return;

    const fetchArticle = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/articles/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setArticle(data?.data);
        } else {
          console.error("Failed to fetch article. Status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching article:", error);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  return (
    <div>
      {article ? <BlogCmp item={article} /> : <p>Loading article...</p>}
      <Newest />
    </div>
  );
};

export default Blog;
