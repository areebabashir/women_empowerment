// src/components/jobs/JobSearchFilters.tsx
import React, { useState } from "react";

const JobSearchFilters = () => {
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("all");
  const [location, setLocation] = useState("");

  return (
    <div className="flex flex-col md:flex-row items-center gap-4">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search job title..."
        className="border px-3 py-2 rounded w-full md:w-1/3"
      />

      <select
        value={mode}
        onChange={(e) => setMode(e.target.value)}
        className="border px-3 py-2 rounded w-full md:w-1/4"
      >
        <option value="all">All Modes</option>
        <option value="remote">Remote</option>
        <option value="onsite">Onsite</option>
        <option value="hybrid">Hybrid</option>
      </select>

      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Location..."
        className="border px-3 py-2 rounded w-full md:w-1/4"
      />
    </div>
  );
};

export default JobSearchFilters;
