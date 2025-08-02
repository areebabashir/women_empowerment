// src/pages/Jobs.tsx
import React, { useState } from "react";
import JobCard from "@/components/jobs/JobCard";
import JobApplyModal from "@/components/jobs/JobApplyModal";
import JobDetailsModal from "@/components/jobs/JobDetailsModal";
import JobSearchFilters from "@/components/jobs/JobSearchFilters";
import { JobType } from "@/types";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const jobs: JobType[] = [
  {
    id: "1",
    title: "Frontend Developer",
    company: "Tech Co.",
    location: "Lahore",
    description: "Looking for a React developer.",
    mode: "remote",
    applyLink: "https://apply.com",
    contactEmail: "hr@techco.com",
  },
  {
    id: "2",
    title: "Designer",
    company: "DesignHub",
    location: "Karachi",
    description: "UI/UX designer needed.",
    mode: "onsite",
    applyLink: "https://apply.com",
    contactEmail: "contact@designhub.com",
  },
];

export default function Jobs() {
  const [selectedJob, setSelectedJob] = useState<JobType | null>(null);
  const [applyJob, setApplyJob] = useState<JobType | null>(null);
  const [search, setSearch] = useState("");

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase())
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
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onViewDetailsClick={() => setSelectedJob(job)}
                onApplyClick={() => setApplyJob(job)}
              />
            ))}
          </div>
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
