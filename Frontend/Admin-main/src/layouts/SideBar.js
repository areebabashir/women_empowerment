import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faCalendarAlt, faFileAlt, faUserCircle, faUserGraduate, faProjectDiagram, faStar, faUsers, faSignOutAlt, faUser, faEnvelope, faImages, faPodcast, faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";

function SideBar() {
  const location = useLocation();

  const links = [
    { to: "/", icon: faHome, label: "Dashboard" },
    { to: "/Admin/Events", icon: faCalendarAlt, label: "Event" },
    { to: "/Admin/Posts", icon: faFileAlt, label: "Blog" },
    { to: "/Admin/Program", icon: faProjectDiagram, label: "Program" },
    { to: "/Admin/SuccessStories", icon: faStar, label: "Success Stories" },
    { to: "/Admin/Gallery", icon: faImages, label: "Gallery" },
    { to: "/Admin/Podcast", icon: faPodcast, label: "Podcast" },
    { to: "/Admin/Awareness", icon: faLightbulb, label: "Legal Awareness" },
    { to: "/Admin/Users", icon: faUser, label: "Users" },
    { to: "/Admin/contact", icon: faEnvelope, label: "Contact" },
    { to: "/Admin/Team", icon: faUsers, label: "Team" },
    { to: "/Logout", icon: faSignOutAlt, label: "Logout" }
  ];

  return (
    <nav className="border-r bg-white h-screen p-4 w-64 pt-10">
      {links.map((link) => (
        <Link key={link.to} to={link.to} aria-label={link.label}>
          <div
            className={`flex items-center text-black-300 hover:text-blue-500 cursor-pointer rounded-md p-2 mb-2 ${location.pathname === link.to ||
                (location.pathname === "/Admin" && link.to === "/Admin/Dashboard") ? "bg-gray-200" : ""
              }`}
          >
            <FontAwesomeIcon icon={link.icon} className="mr-3 text-indigo-500" />
            <span>{link.label}</span>
          </div>
        </Link>
      ))}
    </nav>
  );
}

export default SideBar;
