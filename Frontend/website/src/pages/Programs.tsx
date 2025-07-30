import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { isAuthenticated } from "../utils/auth";
import { User, Event, Program, Donation, TabType, ApiErrorResponse } from "../types";
import { apiCall } from "@/api/apiCall";
import toast from "react-hot-toast";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar } from "lucide-react";
import { getAllPrograms } from "@/services/api";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const Programs = () => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [viewMoreProgram, setViewMoreProgram] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [search, setSearch] = useState("");

  useEffect(() => {
    scrollTo(0,0)
    async function fetchPrograms() {
      try {
        const data = await getAllPrograms();
        setPrograms(Array.isArray(data) ? data : data.programs || data.data || []);
      } catch (err) {
        setError("Failed to load programs");
      } finally {
        setLoading(false);
      }
    }
    fetchPrograms();
  }, []);

  const handleparticipate = async (programId: string) => {
    if (!isAuthenticated()) {
      toast.error("Authentication Required - You need to log in to participate in programs.");
      navigate("/login");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await apiCall({
        url: `${API_BASE_URL}/programs/add/${programId}/participants`,
        method: 'POST',
        requiresAuth: true,
      });
      if (res.success) {
        toast.success("Success! You have successfully registered for the program!");
      } else {
        const errorData = res.data as ApiErrorResponse;
        if (res.status === 400 && errorData.message?.includes("already registered")) {
          toast.error("Already Registered - You are already registered for this program.");
        } else {
          toast.error(`Error - ${errorData.message || "Something went wrong. Please try again."}`);
        }
      }
    } catch (err) {
      toast.error("Network Error - Network error. Please try again later.");
      console.error("Participation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = (program) => {
    setSelectedProgram(program);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const filteredPrograms = programs.filter((program) =>
    program.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="pt-20 lg:pt-24 pb-16 bg-gradient-to-br from-section-soft to-lilac mt-14 ">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-primary mb-6">
            Explore Our Core Programs
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Engage in transformative opportunities designed for empowerment.
          </p>
        </div>

        <div className="max-w-md mx-auto flex gap-2 mt-8">
          <div className="container mx-auto px-4 mb-2">
            <Input
              type="text"
              placeholder="Search programs by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xl mx-auto"
            />
          </div>
          <Button onClick={() => {}}>Search</Button>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-primary mb-12">
            Core Programs
          </h2>
          {loading ? (
            <div className="text-center py-10">Loading programs...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-10">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPrograms.map((program, index) => (
                <Card
                  key={program._id || index}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative group aspect-video">
                    <img
                      src={`http://localhost:8000/uploads/${program.image}`}
                      alt={program.title}
                      className="w-full h-full object-cover rounded-t-md"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-primary">{program.title}</CardTitle>
                    <div className="text-sm text-muted-foreground mb-2">
                      <Calendar className="inline-block h-4 w-4 mr-2" />
                      {new Date(program.startingDate).toLocaleDateString()} -{" "}
                      {new Date(program.endingDate).toLocaleDateString()} ({program.day} {program.time})
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4 line-clamp-3">
                      {program.description?.slice(0, 100)}...
                      <span
                        onClick={() => setViewMoreProgram(program)}
                        className="text-primary cursor-pointer ml-1"
                      >
                        View more
                      </span>
                    </CardDescription>
                    <Button className="w-full" onClick={() => handleparticipate(program._id)}>
                      Enroll
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Register Popup */}
      {selectedProgram && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-xl font-bold text-primary mb-2">
              Register for {selectedProgram.title}
            </h3>
            <Input name="firstName" placeholder="First Name" onChange={handleChange} />
            <Input name="lastName" placeholder="Last Name" onChange={handleChange} />
            <Input name="email" type="email" placeholder="Email" onChange={handleChange} />
            <Input name="phone" placeholder="Phone Number" onChange={handleChange} />
            <Button className="w-full">Enroll</Button>
            <Button
              variant="ghost"
              className="w-full text-sm text-muted-foreground "
              onClick={() => setSelectedProgram(null)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* View More Popup */}
      {viewMoreProgram && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 space-y-4 overflow-y-auto max-h-[90vh]">
            <img
              src={`http://localhost:8000/uploads/${viewMoreProgram.image}`}
              alt={viewMoreProgram.title}
              className="w-full h-64 object-cover rounded-md mb-4"
            />
            <h3 className="text-2xl font-bold text-primary">{viewMoreProgram.title}</h3>
            <p className="text-sm text-muted-foreground mb-2">
              {new Date(viewMoreProgram.startingDate).toLocaleDateString()} -{" "}
              {new Date(viewMoreProgram.endingDate).toLocaleDateString()} (
              {viewMoreProgram.day} {viewMoreProgram.time})
            </p>
            <p className="text-base text-gray-700 whitespace-pre-line">
              {viewMoreProgram.description}
            </p>
            <Button
              variant="ghost"
              className="text-sm text-muted-foreground bg-pink-100"
              onClick={() => setViewMoreProgram(null)}
            >
              Close
            </Button>
          </div>
        </div>
      )}

      <div className="h-1 w-full bg-gradient-to-r from-primary to-soft-purple rounded-full"></div>
      <Footer />
    </div>
  );
};

export default Programs;
