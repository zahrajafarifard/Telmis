"use client";
import React, { FC, useEffect, useState } from "react";
import Header from "./header";
import Main from "./main";

interface Props {
  id: number;
}

interface positionType {
  id: number;
  title: string;
  description: string;
  pros: string;
  conditions: string;
  duties: string;
  ArticleType: { id: number };
}
const Page: FC<Props> = ({ id }) => {
  const [job, setJob] = useState<positionType>();

  useEffect(() => {
    const _job = async () => {
      const _response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}`
      );

      switch (_response.status) {
        case 200:
          const _data = await _response.json();
          setJob(_data?.data);
          break;

        default:
          break;
      }
    };

    if (id) {
      _job();
    }
  }, [id, setJob]);

  return (
    <div>
      {job && (
        <Header title={job?.title} description={job?.description} id={id} />
      )}
      {job && (
        <Main
          duties={job?.duties}
          articleType={job?.ArticleType?.id}
          articleId={job?.id}
        />
      )}
    </div>
  );
};

export default Page;
