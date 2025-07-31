import { useEffect, useState } from "react";
import { User, Event, Program, Donation, TabType, ApiErrorResponse } from "../types";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { isAuthenticated } from "../utils/auth";
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
import { getAllEvents } from "@/services/api";
import { apiCall } from "@/api/apiCall";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const Events = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [viewMoreEvent, setViewMoreEvent] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [search, setSearch] = useState("");

  useEffect(() => {
    scrollTo(0, 0);
    async function fetchEvents() {
      try {
        const data = await getAllEvents();
        setEvents(Array.isArray(data) ? data : data.events || data.data || []);
      } catch (err) {
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const handleRegister = (event) => {
    setSelectedEvent(event);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleparticipate = async (eventId: string) => {
    if (!isAuthenticated()) {
      toast.error("Authentication Required - You need to log in to participate in events.");
      navigate("/login");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await apiCall({
        url: `${API_BASE_URL}/events/${eventId}/participants`,
        method: 'POST',
        requiresAuth: true,
      });

      if (res.success) {
        toast.success("Success! You have successfully registered for the event!");
      } else {
        const errorData = res.data as ApiErrorResponse;
        if (res.status === 400 && errorData.message?.includes("already registered")) {
          toast.error("Already Registered - You are already registered for this event.");
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

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-20 lg:pt-24 pb-16 bg-gradient-to-br from-section-soft to-gentle-rose mt-14">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-primary mb-6">
            Explore Our Events
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover opportunities to engage and empower in your community.
          </p>
          <div className="max-w-md mx-auto flex gap-2 mt-8">
            <Input
              type="text"
              placeholder="Search events by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xl mx-auto"
            />
            <Button onClick={() => {}}>Search</Button>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-primary mb-12">
            Upcoming Events
          </h2>
          {loading ? (
            <div className="text-center py-10">Loading events...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-10">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event, index) => (
                <Card
                  key={event._id || index}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <div
                    className="relative group cursor-pointer aspect-video"
                    onClick={() => setSelectedEvent({ ...event, showOverlay: true })}
                  >
                    <img
                      src={`http://localhost:8000/uploads/images/${event.image}`}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-primary">{event.title}</CardTitle>
                    <div className="text-sm text-muted-foreground mb-2">
                      <Calendar className="inline-block h-6 w-6 mr-2" />
                      {new Date(event.date).toLocaleDateString()} ({event.day} {event.time})
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4 line-clamp-3">
                      {event.description?.slice(0, 100)}...
                    </CardDescription>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="w-1/2 text-primary border-primary hover:bg-primary/10 transition"
                        onClick={() => setViewMoreEvent(event)}
                      >
                        View More
                      </Button>
                      <Button
                        className="w-1/2"
                        onClick={() => handleparticipate(event._id)}
                      >
                        Participate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Image Overlay */}
      {selectedEvent?.showOverlay && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="max-w-4xl w-full relative animate-fadeInSlide">
            <img
              src={`http://localhost:8000/uploads/images/${selectedEvent.image}`}
              alt={selectedEvent.title}
              className="w-full h-auto rounded-lg shadow-lg"
            />
            <Button
              variant="ghost"
              className="absolute top-4 right-4 text-white"
              onClick={() => setSelectedEvent(null)}
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {/* View More Popup */}
      {viewMoreEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 space-y-4 overflow-y-auto max-h-[90vh] animate-fadeInSlide">
            <img
              src={`http://localhost:8000/uploads/images/${viewMoreEvent.image}`}
              alt={viewMoreEvent.title}
              className="w-full h-64 object-cover rounded-md mb-4"
            />
            <h3 className="text-2xl font-bold text-primary">{viewMoreEvent.title}</h3>
            <p className="text-sm text-muted-foreground mb-2">
              {new Date(viewMoreEvent.date).toLocaleDateString()} ({viewMoreEvent.day} {viewMoreEvent.time})
            </p>
            <p className="text-base text-gray-700 whitespace-pre-line">
              {viewMoreEvent.description}
            </p>
            <Button
              variant="ghost"
              className="text-sm text-muted-foreground bg-pink-100 hover:bg-pink-200 transition"
              onClick={() => setViewMoreEvent(null)}
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Register Popup */}
      {selectedEvent && !selectedEvent.showOverlay && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 animate-fadeInSlide">
            <h3 className="text-xl font-bold text-primary mb-2">
              Register for {selectedEvent.title}
            </h3>
            <Input name="firstName" placeholder="First Name" onChange={handleChange} />
            <Input name="lastName" placeholder="Last Name" onChange={handleChange} />
            <Input name="email" type="email" placeholder="Email" onChange={handleChange} />
            <Input name="phone" placeholder="Phone Number" onChange={handleChange} />
            <Button className="w-full">Participate</Button>
            <Button
              variant="ghost"
              className="w-full text-sm text-muted-foreground hover:bg-gray-100"
              onClick={() => setSelectedEvent(null)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Events;
