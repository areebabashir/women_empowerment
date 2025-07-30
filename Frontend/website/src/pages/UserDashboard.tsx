import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "../components/userdashboard/Sidebar";
import Dashboard from "../components/userdashboard/Dashboard";
import Profile from "../components/userdashboard/Profile";
import Events from "../components/userdashboard/Events";
import Programs from "../components/userdashboard/Programs";
import Donations from "../components/userdashboard/Donations";
import Header from "../components/Header";
import { apiCall } from "../api/apiCall";
import userdata from './userdata.json';
import { useNavigate } from "react-router-dom";
import { User, Event, Program, Donation, TabType, ApiErrorResponse } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const UserDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userPrograms, setUserPrograms] = useState<Program[]>([]);
  const [userDonations ,setUserDonations] = useState<Donation[]>([]);
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate(); // Add this if not already present

  const fetchData = async (): Promise<void> => {
    setLoading(true);

    try {
      const profileRes = await apiCall<User>({
        url: `${API_BASE_URL}/users/profile`,
        method: 'GET',
        requiresAuth: true
      });
    

      if (!profileRes.success) {
        const errorData = profileRes.data as ApiErrorResponse;

        // If user is deleted or unauthorized
        if (profileRes.status === 401 || profileRes.status === 404) {
          localStorage.removeItem('authToken');
          navigate('/login');
          return;
        }

        setError(errorData.msg || 'Failed to fetch profile');
      } else {
        setUser(profileRes.data);
        if(profileRes.data.role === "donor") setActiveTab("donations")
        console.log("👤 User:", profileRes.data);
      }

      const donationRes = await apiCall<Donation[]>({
        url: `${API_BASE_URL}/donations/user`,
        method: 'GET',
        requiresAuth: true
      });

      if (donationRes.success) {
        setUserDonations(donationRes.data.data);
        console.log("📘 Donations:", donationRes.data);
      } else {
        const errorData = donationRes.data as ApiErrorResponse;
        setError(errorData.msg || 'Failed to fetch programs');
        console.log("")
      }
      const programsRes = await apiCall<Program[]>({
        url: `${API_BASE_URL}/users/programs`,
        method: 'GET',
        requiresAuth: true
      });

      if (programsRes.success) {
        setUserPrograms(programsRes.data);
        console.log("📘 Programs:", programsRes.data);
      } else {
        const errorData = programsRes.data as ApiErrorResponse;
        setError(errorData.msg || 'Failed to fetch programs');
      }

      const eventsRes = await apiCall<Event[]>({
        url: `${API_BASE_URL}/users/events`,
        method: 'GET',
        requiresAuth: true
      });

      if (eventsRes.success) {
        setUserEvents(eventsRes.data);
        console.log("📅 Events:", eventsRes.data);
      } else {
        const errorData = eventsRes.data as ApiErrorResponse;
        setError(errorData.msg || 'Failed to fetch events');
      }

    } catch (err: any) {
      console.error("❌ Fetch error:", err);

      // Optional: Handle token expiration if your apiCall sets status codes
      if (err?.response?.status === 401 || err?.response?.status === 404) {
        console.log("aaaaa")
        localStorage.removeItem('authToken');
        localStorage.removeItem('role');
        navigate('/login');
      } else {
        setError("An unexpected error occurred");
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    
    scrollTo(0,0)
    fetchData();



 
  }, []);

  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
 

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const { donations }: { donations: Donation[] } = userdata;

  const toggleSidebar = (): void => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = (): void => setIsSidebarOpen(false);

  const handleTabChange = (tab: TabType): void => {
    setActiveTab(tab);
    closeSidebar();
  };

  const renderContent = (): JSX.Element => {
    if (loading) {
      return <p className="text-gray-500 text-center py-6">Loading...</p>;
    }

    if (error) {
      return <p className="text-red-600 text-center py-6">{error}</p>;
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard user={user} events={userEvents} programs={userPrograms} donations={userDonations} />;
      case 'profile':
        return user ? <Profile user={user} /> : <p>No user data available</p>;
      case 'events':
        return <Events events={userEvents} />;
      case 'programs':
        return <Programs programs={userPrograms} />;
      case 'donations':
        return <Donations donations={userDonations} />;
      default:
        return <Dashboard events={userEvents} programs={userPrograms} donations={userDonations} />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-24 z-40">
        {/* <div className="h-[80px]"></div> */}
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>
          {/* <div className="w-8 h-8">
            <img src="https://women-empowerment-rust.vercel.app/assets/logo2-BRQc0wwj.png" alt="Logo" />
          </div> */}
          <h1 className="text-lg font-semibold text-gray-800 capitalize">{activeTab}</h1>
        </div>
        <div className="w-8 h-8 rounded-full">

        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        {user && (
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            user={user}
          />
        )}
      </div>

      {/* Mobile Sidebar Overlay */}
      <div className={`lg:hidden fixed inset-0 bg-gray-900 bg-opacity-50 z-50 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
        <div className={`bg-white w-64 h-full transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="w-12 h-12">
              <img src="https://women-empowerment-rust.vercel.app/assets/logo2-BRQc0wwj.png" alt="Logo" />
            </div>
            <button
              onClick={closeSidebar}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {user && (
            <Sidebar
              activeTab={activeTab}
              setActiveTab={handleTabChange}
              user={user}
              isMobile={true}
            />
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 transition-all duration-300">
        <div className="h-[85px]"></div>

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;