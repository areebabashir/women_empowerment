import React, { useState, useEffect } from "react";
import { Briefcase, Plus, Edit, Trash2, Search, ExternalLink, Building, X ,Mail ,LocateIcon} from "lucide-react";
import { apiCall } from "../../api/apiCall";
import toast from "react-hot-toast";

// import { Job } from "../../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

interface Job {
  _id: string;
  position: string;
  jobLink: string;
  description: string;
  location:string;
  workMode: string;
  company: string;  
  companyName: string;
  companyEmail: string;
  postedAt: string;
}

interface CompanyJobsProps {
  user: any;
}

// Mock apiCall function - replace with your actual implementation
// const apiCall = async ({ url, method, data, requiresAuth }) => {
//   console.log('API Call:', { url, method, data, requiresAuth });
//   // Simulate API response
//   return {
//     success: true,
//     data: method === 'GET' && url.includes('/jobs/company/jobs') 
//       ? [
//           {
//             _id: '1',
//             position: 'Senior Frontend Developer',
//             jobLink: 'https://example.com/job1',
//             description: 'We are looking for an experienced frontend developer to join our team...',
//             workMode: 'Remote',
//             company: 'comp1',
//             companyName: 'Tech Solutions Inc',
//             companyEmail: 'hr@techsolutions.com',
//             postedAt: '2024-01-15T10:00:00Z'
//           },
//           {
//             _id: '2',
//             position: 'Backend Engineer',
//             jobLink: 'https://example.com/job2',
//             description: 'Join our backend team to build scalable applications...',
//             workMode: 'Hybrid',
//             company: 'comp1',
//             companyName: 'Tech Solutions Inc',
//             companyEmail: 'hr@techsolutions.com',
//             postedAt: '2024-01-10T14:30:00Z'
//           }
//         ]
//       : { message: 'Success' }
//   };
// };

const CompanyJobs: React.FC<CompanyJobsProps> = ({ user }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [jobToUpdate, setJobToUpdate] = useState<Job | null>(null);

  useEffect(() => {
    fetchCompanyJobs();
  }, []);

  const fetchCompanyJobs = async () => {
    try {
      console.log('🔍 Fetching company jobs...');
      
      const response = await apiCall({
        url: `${API_BASE_URL}/jobs/company/jobs`,
        method: 'GET',
        requiresAuth: true
      });

      console.log('📡 Jobs API Response:', response);

      if (response.success) {
        const jobsData = response.data || [];
        console.log('📊 Jobs received:', jobsData);
        setJobs(jobsData);
      } else {
        console.error('❌ API call failed:', response);
      }
    } catch (error) {
      console.error('❌ Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      const response = await apiCall({
        url: `${API_BASE_URL}/jobs/delete/${jobId}`,
        method: 'DELETE',
        requiresAuth: true
      });

      if (response.success) {
        toast.success('Job deleted successfully!');
        fetchCompanyJobs();
      } else {
        toast.error('Failed to delete job');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Error deleting job');
    }
  };

  const handleUpdateJob = (job: Job) => {
    setJobToUpdate(job);
    setShowUpdateModal(true);
  };

  const filteredJobs = jobs.filter(job =>
    job.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase()) || job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.workMode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <h1 className="text-3xl font-bold text-[#7F264B]">My Jobs</h1>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7F264B]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#7F264B]">My Jobs</h1>
        <button 
          className="bg-[#7F264B] hover:bg-[#6a1f3f] text-white px-4 py-2 rounded-md flex items-center transition-colors"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Post New Job
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7F264B] focus:border-transparent"
        />
      </div>

      {/* Jobs List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <div key={job._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-semibold text-gray-900 line-clamp-2 flex-1 mr-2">{job.position}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                  job.workMode.toLowerCase() === 'remote' 
                    ? 'bg-green-100 text-green-800' 
                    : job.workMode.toLowerCase() === 'hybrid'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {job.workMode}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{job.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <LocateIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{job.location}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Building className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{job.companyName}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{job.companyEmail}</span>
                </div>
               
                <div className="flex items-center text-sm text-gray-500">
                  <Briefcase className="w-4 h-4 mr-2 flex-shrink-0" />
                  Posted on {new Date(job.postedAt).toLocaleDateString()}
                </div>
                {job.jobLink && (
                  <div className="flex items-center text-sm text-blue-600">
                    <ExternalLink className="w-4 h-4 mr-2 flex-shrink-0" />
                    <a 
                      href={job.jobLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:underline truncate"
                    >
                      View Job Link
                    </a>
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <button 
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center"
                  onClick={() => handleUpdateJob(job)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </button>
                <button
                  className="flex-1 px-3 py-2 text-sm border border-red-300 text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center justify-center"
                  onClick={() => handleDeleteJob(job._id)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <Briefcase className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-500">
            {searchTerm ? 'Try adjusting your search terms.' : 'Get started by posting your first job.'}
          </p>
        </div>
      )}

      {/* Create Job Modal */}
      <CreateJobModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={fetchCompanyJobs}
      />

      {/* Update Job Modal */}
      <UpdateJobModal
        isOpen={showUpdateModal}
        onClose={() => {
          setShowUpdateModal(false);
          setJobToUpdate(null);
        }}
        onSuccess={fetchCompanyJobs}
        job={jobToUpdate}
      />
    </div>
  );
};

// Create Job Modal Component
const CreateJobModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    position: "",
    jobLink: "",
    description: "",
    location:"",
    workMode: "On-site"
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.position || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    try {
      const response = await apiCall({
        url: `${API_BASE_URL}/jobs/create`,
        method: 'POST',
        data: formData,
        requiresAuth: true
      });

      if (response.success) {
        toast.success('Job posted successfully!');
        onSuccess();
        onClose();
        // Reset form
        setFormData({
          position: "",
          jobLink: "",
          description: "",
          location:"",
          workMode: "On-site"
        });
      } else {
        toast.error('Failed to post job');
      }
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error('Error posting job');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#7F264B]">Post New Job</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-md hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Position */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Position *
            </label>
            <input
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              placeholder="Enter job position"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7F264B] focus:border-transparent"
            />
          </div>

          {/* Job Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Link
            </label>
            <input
              name="jobLink"
              type="url"
              value={formData.jobLink}
              onChange={handleInputChange}
              placeholder="https://example.com/job-application"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7F264B] focus:border-transparent"
            />
          </div>
          {/* job location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Location *
            </label>
            <input
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Enter job location"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7F264B] focus:border-transparent"
            />
          </div>

          {/* Work Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Work Mode *
            </label>
            <select
              name="workMode"
              value={formData.workMode}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7F264B] focus:border-transparent"
              required
            >
              <option value="On-site">On-site</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter job description, requirements, and responsibilities"
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7F264B] focus:border-transparent"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 bg-[#7F264B] hover:bg-[#6a1f3f] text-white rounded-md transition-colors disabled:opacity-50"
            >
              {loading ? 'Posting...' : 'Post Job'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Update Job Modal Component
const UpdateJobModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  job: Job | null;
}> = ({ isOpen, onClose, onSuccess, job }) => {
  const [formData, setFormData] = useState({
    position: "",
    jobLink: "",
    description: "",
    location:"",
    workMode: "On-site"
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (job) {
      setFormData({
        position: job.position,
        jobLink: job.jobLink || "",
        location:job.location,
        description: job.description,
        workMode: job.workMode
      });
    }
  }, [job]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!job || !formData.position ||!formData.location || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    try {
      // Only send allowed fields based on backend controller
      const allowedUpdates = {
        position: formData.position,
        jobLink: formData.jobLink,
        description: formData.description,
        location: formData.location,
        workMode: formData.workMode
      };

      const response = await apiCall({
        url: `${API_BASE_URL}/jobs/update/${job._id}`,
        method: 'PUT',
        data: allowedUpdates,
        requiresAuth: true
      });

      if (response.success) {
        toast.success('Job updated successfully!');
        onSuccess();
        onClose();
      } else {
        toast.error('Failed to update job');
      }
    } catch (error) {
      console.error('Error updating job:', error);
      toast.error('Error updating job');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#7F264B]">Update Job</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-md hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Position */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Position *
            </label>
            <input
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              placeholder="Enter job position"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7F264B] focus:border-transparent"
            />
          </div>

          {/* Job Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Link
            </label>
            <input
              name="jobLink"
              type="url"
              value={formData.jobLink}
              onChange={handleInputChange}
              placeholder="https://example.com/job-application"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7F264B] focus:border-transparent"
            />
          </div>
          {/* Job location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Location
            </label>
            <input
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Enter job Location"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7F264B] focus:border-transparent"
            />
          </div>

          {/* Work Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Work Mode *
            </label>
            <select
              name="workMode"
              value={formData.workMode}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7F264B] focus:border-transparent"
              required
            >
              <option value="On-site">On-site</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter job description, requirements, and responsibilities"
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7F264B] focus:border-transparent"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 bg-[#7F264B] hover:bg-[#6a1f3f] text-white rounded-md transition-colors disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Job'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyJobs;