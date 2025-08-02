// src/components/jobs/JobApplyModal.tsx
import React from "react";
import { JobType } from "@/types";
import ModalWrapper from "./ModalWrapper";

interface JobApplyModalProps {
  job: JobType;
  onClose: () => void;
}

const JobApplyModal: React.FC<JobApplyModalProps> = ({ job, onClose }) => {
  return (
    <ModalWrapper onClose={onClose}>
      <h2 className="text-xl font-semibold mb-4">Apply to {job.title}</h2>
      <p className="mb-2">Company: {job.company}</p>
      <p className="mb-2">Send your resume to:</p>
      <a href={`mailto:${job.contactEmail}`} className="text-blue-600 underline">
        {job.contactEmail}
      </a>
      <div className="mt-6 text-right">
        <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Close</button>
      </div>
    </ModalWrapper>
  );
};

export default JobApplyModal;
