import React from "react";
import { Calendar, BookOpen, Heart, LucideIcon, PartyPopper } from "lucide-react";
import { Event, Program, Donation } from "../../types";

interface DashboardProps {
  events: Event[];
  programs: Program[];
  donations: Donation[];
  isngo?: boolean; // <--- default is false
}

interface Stat {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  textColor: string;
}

const Dashboard: React.FC<DashboardProps> = ({
  events,
  programs,
  donations,  
  isngo = false,
}) => {
  if (isngo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px]">
        <div className="bg-pink-50 rounded-2xl p-8 border border-pink-200 shadow transition-all w-full max-w-md flex flex-col items-center space-y-4">
          <span className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-pink-400 to-[#7F264B] rounded-full shadow-lg mb-2">
            <PartyPopper className="w-8 h-8 text-white" />
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#7F264B] text-center">
            Congratulations!
          </h2>
          <p className="text-lg text-pink-700 font-semibold text-center">
            Your NGO profile is approved. Welcome to the platform!
          </p>
        </div>
      </div>
    );
  }

  const stats: Stat[] = [
    {
      title: "Total Events",
      value: events.length,
      icon: Calendar,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Total Programs",
      value: programs.length,
      icon: BookOpen,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Total Donations",
      value: donations.length,
      icon: Heart,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      textColor: "text-red-600",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#7F264B]">DASHBOARD</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`${stat.bgColor} rounded-xl p-6 border border-gray-100`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                  <p className={`text-3xl font-bold ${stat.textColor} mt-2`}>{stat.value}</p>
                </div>
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
