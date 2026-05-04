import Resume from "@/components/jobs/job/resume/page";
import React from "react";

const UploadResume = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) => {
  const resolvedParams = await searchParams;
  const title = resolvedParams?.title;
  return (
    <div>
   
      <Resume title={title} />
    </div>
  );
};

export default UploadResume;
