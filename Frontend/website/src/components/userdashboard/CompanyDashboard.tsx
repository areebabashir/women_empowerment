import React, { useState, useEffect } from "react";
import { BookOpen, Users, Calendar, TrendingUp, LucideIcon } from "lucide-react";
import { Program } from "../../types";
import { apiCall } from "../../api/apiCall";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

interface CompanyDashboardProps {
  user: any;
}

interface Stat {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  textColor: string;
}

interface CompanyStats {
  totalPrograms: number;
  totalParticipants: number;
  activePrograms: number;
  recentRegistrations: number;
}

const CompanyDashboard: React.FC<CompanyDashboardProps> = ({ user }) => {
  const [stats, setStats] = useState<CompanyStats>({
    totalPrograms: 0,
    totalParticipants: 0,
    activePrograms: 0,
    recentRegistrations: 0
  });
  const [recentPrograms, setRecentPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanyStats();
  }, []);

  const fetchCompanyStats = async () => {
    try {
      // Fetch company dashboard stats
      const statsResponse = await apiCall({
        url: `${API_BASE_URL}/programs/company/dashboard`,
        method: 'GET',
        requiresAuth: true
      });

      if (statsResponse.success) {
        setStats(statsResponse.data.stats);
        setRecentPrograms(statsResponse.data.programs || []);
      } else {
        toast.error('Failed to fetch company statistics');
      }
    } catch (error) {
      console.error('Error fetching company stats:', error);
      toast.error('Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const dashboardStats: Stat[] = [
    {
      title: 'Total Programs',
      value: stats.totalPrograms,
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Participants',
      value: stats.totalParticipants,
      icon: Users,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Active Programs',
      value: stats.activePrograms,
      icon: Calendar,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Recent Registrations',
      value: stats.recentRegistrations,
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-[#7F264B]">Company Dashboard</h1>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7F264B]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#7F264B]">Company Dashboard</h1>
        <div className="text-sm text-gray-600">
          Welcome back, {user?.name}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`${stat.bgColor} rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                  <p className={`text-3xl font-bold ${stat.textColor} mt-2`}>{stat.value}</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Programs */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Programs</h2>
        {recentPrograms.length > 0 ? (
          <div className="space-y-4">
            {recentPrograms.map((program, index) => (
              <div key={program._id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{program.title}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(program.startingDate).toLocaleDateString()} - {new Date(program.endingDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {program.participants?.length || 0} participants
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    new Date(program.endingDate) > new Date() 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {new Date(program.endingDate) > new Date() ? 'Active' : 'Completed'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No programs created yet</p>
            <p className="text-sm">Start by creating your first program</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="flex items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
            <span className="text-blue-600 font-medium">Create New Program</span>
          </button>
          <button className="flex items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <Users className="w-5 h-5 mr-2 text-green-600" />
            <span className="text-green-600 font-medium">View Participants</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard; 