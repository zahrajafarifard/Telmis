import React from "react";

import JobCmp from "@/components/jobs/job/page";
import ContactUs from "@/components/shared/contact-us/page";

interface JobProps {
  params: {
    id: number;
  };
}

const Job = async ({ params }: JobProps) => {
  const { id } = await params;

  return (
    <div>
      <JobCmp id={id} />
      <ContactUs />
    </div>
  );
};

export default Job;
