
// AdminLayout.jsx
import React, { useState } from "react";
import SideBar from "./SideBar";
import Nav from "./Nav";
import { X } from "lucide-react";

function AdminLayout({ Content, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Nav onToggleSidebar={toggleSidebar} />
      <div className="flex flex-1 relative">
        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={closeSidebar}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static lg:translate-x-0 z-50
            w-64 h-full bg-white border-r border-gray-200 shadow-lg lg:shadow-none
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:block
          `}
        >
          {/* Close button for mobile */}
          <div className="lg:hidden flex justify-end p-4 border-b border-gray-200">
            <button
              onClick={closeSidebar}
              className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              aria-label="Close sidebar"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>
          <SideBar onLinkClick={closeSidebar} />
        </aside>

        {/* Content area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 lg:p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {Content || children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;