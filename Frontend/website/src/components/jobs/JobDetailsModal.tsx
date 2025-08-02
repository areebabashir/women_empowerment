// src/components/jobs/JobDetailsModal.tsx
import React from "react";
import { JobType } from "@/types";
import ModalWrapper from "./ModalWrapper";

interface JobDetailsModalProps {
  job: JobType;
  onClose: () => void;
}

const JobDetailsModal: React.FC<JobDetailsModalProps> = ({ job, onClose }) => {
  return (
    <ModalWrapper onClose={onClose}>
      <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
      <p className="text-sm text-gray-600 mb-1">{job.company} · {job.location} · {job.mode}</p>
      <p className="mt-4 text-sm text-gray-800 whitespace-pre-line">{job.description}</p>
      <div className="mt-6">
        <a href={job.applyLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline mr-4">
          Apply Link
        </a>
        <span className="text-sm text-gray-700">Email: {job.contactEmail}</span>
      </div>
      <div className="mt-6 text-right">
        <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Close</button>
      </div>
    </ModalWrapper>
  );
};

export default JobDetailsModal;
