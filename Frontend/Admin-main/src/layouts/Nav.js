import React from "react";
import { Link } from "react-router-dom";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu } from "lucide-react";
import { AdminName } from "../Api/Api";

function Nav({ onToggleSidebar }) {
  return (
    <nav className="border-b bg-white p-4 flex justify-between items-center shadow-sm">
      <div className="flex items-center space-x-4">
        {/* Hamburger Menu Button - Only visible on mobile */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} className="text-gray-600" />
        </button>
        
        {/* Logo/Title */}
        <Link to="/Admin/" className="hover:text-blue-600 transition-colors">
          <div className="text-xl font-semibold text-gray-800">Admin</div>
        </Link>
      </div>

      {/* Right side - Admin info and logout */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          {/* Admin Name */}
          <div className="bg-gray-50 px-3 py-2 rounded-md border">
            <span className="text-sm font-medium text-gray-700">
              <AdminName />
            </span>
          </div>
          
          {/* Logout Button - Uncomment when needed */}
          {/* 
          <Link 
            to="/Logout"
            className="bg-gray-50 p-2 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors border"
            title="Logout"
          >
            <FontAwesomeIcon icon={faArrowRightFromBracket} />
          </Link> 
          */}
        </div>
      </div>
    </nav>
  );
}

export default Nav;