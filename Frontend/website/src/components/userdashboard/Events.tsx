import React from "react";
import { Calendar, Clock, Users, ArrowRight, CalendarX } from "lucide-react";
import { Event } from "../../types";
import { useNavigate } from "react-router-dom";
interface EventsProps {
  events: Event[];
  onViewAll?: () => void;
}

const Events: React.FC<EventsProps> = ({ events, onViewAll }) => {
    const navigate = useNavigate()
  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-gradient-to-br from-[#7F264B]/10 to-purple-100 rounded-full p-8 mb-6">
        <CalendarX className="w-16 h-16 text-[#7F264B]/60" />
      </div>
      <h3 className="text-2xl font-semibold text-[#7F264B] mb-3">No Events Yet</h3>
      <p className="text-gray-500 text-center max-w-md leading-relaxed">
        You haven't registered for any events yet. Check out our upcoming events and join the ones that interest you!
      </p>
      <button onClick={()=> {navigate("/events")}} className="mt-6 px-6 py-3 bg-gradient-to-r from-[#7F264B] to-purple-600 text-white rounded-lg hover:from-[#6B1F3A] hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
        Explore Events
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#7F264B]">MY EVENTS</h1>
        {events.length > 0 && (
          <div className="bg-gradient-to-r from-[#7F264B]/10 to-purple-100 px-4 py-2 rounded-lg">
            <span className="text-[#7F264B] font-semibold">
              {events.length} Event{events.length !== 1 ? 's' : ''} Registered
            </span>
          </div>
        )}
      </div>

      {events.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <EmptyState />
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {events.map((event, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg group relative"
              >
                {/* Gradient border effect on hover */}
                <div className="absolute inset-0 z-0 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300"></div>

                {/* Content Wrapper with Layering */}
                <div className="relative z-10 flex flex-col md:flex-row bg-white rounded-xl overflow-hidden">
                  {/* Image Section */}
                  <div className="md:w-1/4 lg:w-1/5">
                    <img
                      src={`http://localhost:8000/uploads/images/${event.image}`}
                      alt={event.title}
                      className="w-full h-48 md:h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 p-6 flex flex-col justify-between animate-fade-in">
                    <div>
                      <h3 className="text-xl font-semibold text-[#7F264B] mb-2">{event.title}</h3>
                      <p className="text-gray-600 mb-3">{event.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-[#7F264B]" />
                        {new Date(event.date).toLocaleDateString()} ({event.day})
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1 text-[#7F264B]" />
                        {event.time}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1 text-[#7F264B]" />
                        {event.participants.length} participants
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          {events.length > 0 && (
            <div className="flex justify-center pt-6">
              <button
                onClick={()=>{navigate("/events")}}
                className="group flex items-center px-8 py-3 bg-gradient-to-r from-[#7F264B] to-purple-600 text-white rounded-lg hover:from-[#6B1F3A] hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <span className="mr-2 font-semibold">VIEW ALL EVENTS</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Events;