// src/components/jobs/JobCard.tsx
import React from "react";
import { JobType } from "@/types";

interface JobCardProps {
  job: JobType;
  onViewDetailsClick: () => void;
  onApplyClick: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onViewDetailsClick, onApplyClick }) => {
  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white space-y-2">
      <h3 className="text-lg font-semibold">{job.title}</h3>
      <p className="text-sm text-gray-600">{job.company}</p>
      <p className="text-sm text-gray-500">{job.location} · {job.mode}</p>
      <div className="flex gap-2 mt-2">
        <button onClick={onViewDetailsClick} className="text-sm text-blue-600 underline">View Details</button>
        <button onClick={onApplyClick} className="text-sm text-green-600 underline">Apply</button>
      </div>
    </div>
  );
};

export default JobCard;
