import React from "react";
import { Calendar, Clock, Users, ArrowRight, BookOpen } from "lucide-react";
import { Program } from "../../types";
import { useNavigate } from "react-router-dom";

interface ProgramsProps {
  programs: Program[];
  onViewAll?: () => void;
}
const Programs: React.FC<ProgramsProps> = ({ programs, onViewAll }) => {
    const navigate = useNavigate()

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-gradient-to-br from-[#7F264B]/10 to-purple-100 rounded-full p-8 mb-6">
        <BookOpen className="w-16 h-16 text-[#7F264B]/60" />
      </div>
      <h3 className="text-2xl font-semibold text-[#7F264B] mb-3">No Programs Yet</h3>
      <p className="text-gray-500 text-center max-w-md leading-relaxed">
        You haven't registered for any programs yet. Explore our available programs and join one that interests you!
      </p>
      <button onClick={()=>{navigate("/programs")}} className="mt-6 px-6 py-3 bg-gradient-to-r from-[#7F264B] to-purple-600 text-white rounded-lg hover:from-[#6B1F3A] hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
        Explore Programs
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#7F264B]">MY PROGRAMS</h1>
        {programs.length > 0 && (
          <div className="bg-gradient-to-r from-[#7F264B]/10 to-purple-100 px-4 py-2 rounded-lg">
            <span className="text-[#7F264B] font-semibold">
              {programs.length} Program{programs.length !== 1 ? 's' : ''} Registered
            </span>
          </div>
        )}
      </div>

      {programs.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <EmptyState />
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {programs.map((program, index) => (
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
                      src={`http://localhost:8000/uploads/images/${program.image}`}
                      alt={program.title}
                      className="w-full h-48 md:h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 p-6 flex flex-col justify-between animate-fade-in">
                    <div>
                      <h3 className="text-xl font-semibold text-[#7F264B] mb-2">{program.title}</h3>
                      <p className="text-gray-600 mb-3">{program.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-[#7F264B]" />
                        {new Date(program.startingDate).toLocaleDateString()} - {new Date(program.endingDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1 text-[#7F264B]" />
                        {program.day}s, {program.time}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1 text-[#7F264B]" />
                        {program.participants.length} participants
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          {programs.length > 0 && (
            <div className="flex justify-center pt-6">
              <button
                onClick={()=> {navigate("/programs")}}
                className="group flex items-center px-8 py-3 bg-gradient-to-r from-[#7F264B] to-purple-600 text-white rounded-lg hover:from-[#6B1F3A] hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <span className="mr-2 font-semibold">VIEW ALL PROGRAMS</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Programs;