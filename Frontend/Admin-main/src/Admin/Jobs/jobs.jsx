import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import AdminLayout from '../../layouts/AdminLayout';
import { AuthToken } from '../../Api/Api';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

api.interceptors.request.use((config) => {
  const token = AuthToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/jobs/getall');
      setJobs(res.data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      Swal.fire('Error', 'Failed to fetch job listings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (jobId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this job?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/jobs/delete/${jobId}`);
        Swal.fire('Deleted!', 'Job has been deleted.', 'success');
        fetchJobs();
      } catch (err) {
        console.error('Delete error:', err);
        Swal.fire('Error', 'Failed to delete job', 'error');
      }
    }
  };

  const openModal = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedJob(null);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  const JobItem = ({ job }) => (
    <div className="bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <div className="px-6 py-4 grid grid-cols-12 gap-4 items-center">
        {/* Job Title & Company */}
        <div className="col-span-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.position}</h3>
          <div className="flex items-center text-sm text-gray-600">
            <i className="fas fa-building mr-2"></i>
            <span>{job.companyName}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <i className="fas fa-envelope mr-2"></i>
            <span>{job.companyEmail}</span>
          </div>
        </div>

        {/* Description */}
        <div className="col-span-4">
          <p className="text-sm text-gray-800 mb-2">
            {truncateText(job.description)}
          </p>
          <button
            onClick={() => openModal(job)}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
          >
            <i className="fas fa-eye mr-1"></i>
            View Details
          </button>
        </div>

        {/* Job Type */}
        <div className="col-span-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <i className="fas fa-location mr-1"></i>
            {job.location}
          </span>
        </div>
        {/* Job Type */}
        <div className="col-span-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <i className="fas fa-briefcase mr-1"></i>
            {job.workMode}
          </span>
        </div>

        {/* Posted Date */}
        {/* <div className="col-span-2">
          <div className="flex items-center text-sm text-gray-500">
            <i className="fas fa-calendar-alt mr-2"></i>
            <span>{formatDate(job.postedAt)}</span>
          </div>
        </div> */}

        {/* Actions */}
        <div className="col-span-1 flex justify-end space-x-2">
          <a
            href={job.jobLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-800 p-2 rounded-full hover:bg-green-50 transition-colors"
            title="Apply"
          >
            <i className="fas fa-external-link-alt"></i>
          </a>
          <button
            onClick={() => deleteJob(job._id)}
            className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <i className="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
    </div>
  );

  const JobModal = () => {
    if (!selectedJob) return null;

    return (
      <div className={`fixed inset-0 z-50 ${showModal ? 'block' : 'hidden'}`}>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={closeModal}
        ></div>
        
        {/* Modal */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedJob.position}</h2>
                <div className="flex items-center text-gray-600 mt-2">
                  <i className="fas fa-building mr-2"></i>
                  <span className="font-medium">{selectedJob.companyName}</span>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Company Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <i className="fas fa-info-circle mr-2 text-blue-600"></i>
                  Company Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <i className="fas fa-envelope w-5 text-gray-500 mr-3"></i>
                    <span className="text-gray-700">{selectedJob.companyEmail}</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-briefcase w-5 text-gray-500 mr-3"></i>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {selectedJob.workMode}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-location w-5 text-gray-500 mr-3"></i>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {selectedJob.location}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-calendar-alt w-5 text-gray-500 mr-3"></i>
                    <span className="text-gray-700">Posted on {formatDate(selectedJob.postedAt)}</span>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <i className="fas fa-file-alt mr-2 text-green-600"></i>
                  Job Description
                </h3>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {selectedJob.description}
                  </p>
                </div>
              </div>

              {/* Apply Link */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <i className="fas fa-external-link-alt mr-2 text-blue-600"></i>
                  Apply for this Position
                </h3>
                <a
                  href={selectedJob.jobLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <i className="fas fa-external-link-alt mr-2"></i>
                  Visit Application Page
                </a>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <i className="fas fa-briefcase mr-3 text-blue-600"></i>
            Job Listings
          </h1>
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium flex items-center">
            <i className="fas fa-chart-bar mr-2"></i>
            Total Jobs: {jobs.length}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-gray-600">Loading jobs...</span>
          </div>
        ) : jobs.length > 0 ? (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gray-100 px-6 py-4 grid grid-cols-12 gap-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">
              <div className="col-span-3 flex items-center">
                <i className="fas fa-user-tie mr-2"></i>
                Position & Company
              </div>
              <div className="col-span-4 flex items-center">
                <i className="fas fa-file-alt mr-2"></i>
                Description
              </div>
              <div className="col-span-2 flex items-center">
                <i className="fas fa-tag mr-2"></i>
                Location
              </div>
              <div className="col-span-2 flex items-center">
                <i className="fas fa-tag mr-2"></i>
                Type
              </div>
              {/* <div className="col-span-2 flex items-center">
                <i className="fas fa-calendar mr-2"></i>
                Posted
              </div> */}
              <div className="col-span-1 flex items-center justify-end">
                <i className="fas fa-cog mr-2"></i>
                Actions
              </div>
            </div>
            
            {/* Job Items */}
            {jobs.map((job) => (
              <JobItem key={job._id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white shadow rounded-lg">
            <i className="fas fa-briefcase text-gray-300 text-6xl mb-4"></i>
            <p className="text-gray-500 text-xl mb-2">No jobs found</p>
            <p className="text-gray-400">Start by adding some job listings</p>
          </div>
        )}
      </div>
      
      {/* Modal */}
      <JobModal />
    </AdminLayout>
  );
};

export default Jobs;