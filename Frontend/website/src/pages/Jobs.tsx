// src/pages/Jobs.tsx
import React, { useEffect, useState } from "react";
import JobCard from "@/components/jobs/JobCard";
import JobApplyModal from "@/components/jobs/JobApplyModal";
import JobDetailsModal from "@/components/jobs/JobDetailsModal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Job, ApiErrorResponse } from "@/types";
import { apiCall } from "@/api/apiCall";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applyJob, setApplyJob] = useState<Job | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchJobs = async () => {
    setLoading(true);
    const res = await apiCall<Job[]>({
      url: `${API_BASE_URL}/jobs/getall`,
      method: "GET",
    });

    if (res.success) {
      setJobs(res.data);
    } else {
      const err = res.data as ApiErrorResponse;
      setError(err.msg || "Failed to load jobs.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) =>
    job.position.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="pt-20 lg:pt-24 pb-16 bg-gradient-to-br from-section-soft to-lilac mt-14">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-primary mb-6">
            Discover Career Opportunities
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Browse available job openings and apply with ease.
          </p>
        </div>

        <div className="max-w-md mx-auto flex gap-2 mt-8">
          <Input
            type="text"
            placeholder="Search job titles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xl mx-auto"
          />
          <Button>Search</Button>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-primary mb-12">
            Open Positions
          </h2>

          {loading ? (
            <div className="text-center text-gray-500">Loading jobs...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center text-gray-500">No jobs found.</div>
          ) : (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onViewDetailsClick={() => setSelectedJob(job)}
                  onApplyClick={() => setApplyJob(job)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedJob && (
        <JobDetailsModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
      {applyJob && (
        <JobApplyModal job={applyJob} onClose={() => setApplyJob(null)} />
      )}

      <div className="h-1 w-full bg-gradient-to-r from-primary to-soft-purple rounded-full"></div>
      <Footer />
    </div>
  );
}
