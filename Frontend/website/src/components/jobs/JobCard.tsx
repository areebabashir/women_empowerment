// src/components/jobs/JobCard.tsx
import React from "react";
import { MapPin, Building2, Monitor, Eye, Send } from "lucide-react";
import { Job } from "@/types";

interface JobCardProps {
  job: Job;
  onViewDetailsClick: () => void;
  onApplyClick: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onViewDetailsClick, onApplyClick }) => {
  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white space-y-3 hover:shadow-md transition-shadow">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">{job.position}</h3>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Building2 size={16} />
          <span>{job.companyName}</span>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <MapPin size={16} />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Monitor size={16} />
            <span>{job.workMode}</span>
          </div>
        </div>
      </div>
      
      <div className="flex gap-3 pt-2 border-t border-gray-100">
        <button 
          onClick={onViewDetailsClick} 
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          <Eye size={16} />
          View Details
        </button>
        <button 
          onClick={onApplyClick} 
          className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
        >
          <Send size={16} />
          Apply
        </button>
      </div>
    </div>
  );
};

export default JobCard;