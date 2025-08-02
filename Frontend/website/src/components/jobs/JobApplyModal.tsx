// src/components/jobs/JobApplyModal.tsx
import React from "react";
import { Building2, Mail, ExternalLink, X } from "lucide-react";
import { Job } from "@/types";
import ModalWrapper from "./ModalWrapper";

interface JobApplyModalProps {
  job: Job;
  onClose: () => void;
}

const JobApplyModal: React.FC<JobApplyModalProps> = ({ job, onClose }) => {
  return (
    <ModalWrapper onClose={onClose}>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Apply to {job.position}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-700">
            <Building2 size={18} />
            <span className="font-medium">Company:</span>
            <span>{job.companyName}</span>
          </div>
          
          <div className="space-y-2">
            <p className="text-gray-700 font-medium">Send your resume to:</p>
            <a 
              href={`mailto:${job.companyEmail}`} 
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 underline transition-colors"
            >
              <Mail size={16} />
              {job.companyEmail}
            </a>
          </div>
          
          {job.jobLink && (
            <div className="space-y-2">
              <p className="text-gray-700 font-medium">Job posting:</p>
              <a 
                href={job.jobLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 underline transition-colors"
              >
                <ExternalLink size={16} />
                View original job posting
              </a>
            </div>
          )}
        </div>
        
        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default JobApplyModal;