import React from 'react';
import {
  User,
  Calendar,
  BookOpen,
  Heart,
  LayoutDashboard,
  LogOut,
  LucideIcon
} from 'lucide-react';
import { User as UserType, TabType } from "../../types";
import NavbarProfileAvatar from '../NavbarProfileAvatar';

import { logout } from '@/utils/auth';

interface MenuItem {
  id: TabType;
  label: string;
  icon: LucideIcon;
}

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  user: UserType;
  isMobile?: boolean;
}

const handleLogout = () => {
  logout();
};

// All possible tabs
const allMenuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'events', label: 'My Events', icon: Calendar },
  { id: 'programs', label: 'My Programs', icon: BookOpen },
  { id: 'courses', label: 'Courses', icon: BookOpen },
  { id: 'donations', label: 'My Donations', icon: Heart },
];

// Role-based filtering
const getVisibleTabsForRole = (role: string): TabType[] => {
  switch (role) {
    case 'donor':
      return [ 'profile', "donations"]; // hide events, programs, courses
    case 'company':
      return ['dashboard', 'profile', 'courses']; // hide events, programs, donations
    case 'ngo':
      return ['dashboard', 'profile', 'donations']; // only show dashboard, donations, profile
    case 'member':
      return ['dashboard', 'profile', 'events', 'programs', 'donations']; // include donations for members
    case 'trainee':
      return ['dashboard', 'profile', 'events', 'programs']; // same as member: hide courses, donations
    default:
      return ['dashboard', 'profile']; // fallback
  }
};

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, user, isMobile = false }) => {
  const visibleTabs = getVisibleTabsForRole(user.role);

  const filteredMenuItems = allMenuItems.filter(item => visibleTabs.includes(item.id));

  return (
    <div className={`bg-white shadow-lg h-[calc(100vh-70px)] overflow-y-auto flex flex-col justify-start ${
      isMobile ? 'w-full' : 'w-64 fixed left-0 top-[70px]'
    }`}>
      {/* Navigation Menu */}
      <nav className={isMobile ? 'mt-0' : 'mt-6'}>
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-6 py-4 text-left hover:bg-[#e5a3be] transition-colors duration-200 ${
                activeTab === item.id 
                  ? 'bg-[#7F264B] text-white border-r-2 border-[#7F264B]' 
                  : 'text-gray-700'
              }`}
            >
              <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Info Section for Mobile */}
      {isMobile && (
        <div className="mt-6 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <NavbarProfileAvatar />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Logout Button */}
      <div className={`${isMobile ? 'mt-4' : 'absolute bottom-6'} w-full px-6`}>
        <button 
          className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-3 flex-shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
