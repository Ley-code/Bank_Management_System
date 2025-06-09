import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { NavLink } from "react-router-dom";

// Sidebar component for admin navigation
const Sidebar = ({ isOpen, onToggle }) => {
  // Define navigation items with paths and icons
  const navItems = [
    { id: 1, name: "Dashboard", path: "/admin/dashboard", icon: "🏦" },
    { id: 2, name: "Accounts", path: "/admin/accounts", icon: "💳" },
    { id: 3, name: "Customers", path: "/admin/customers", icon: "👥" },
    { id: 4, name: "Transactions", path: "/admin/transactions", icon: "📊" },
    { id: 5, name: "Loans", path: "/admin/loans", icon: "💰" },
    { id: 6, name: "Branches", path: "/admin/branches", icon: "🏢" },
    { id: 7, name: "Employees", path: "/admin/employees", icon: "👔" },
  ];

  return (
    // Sidebar container with dark blue background and white text, inspired by the first image
    <div
      className={`flex flex-col h-screen bg-blue-800 text-white shadow-lg transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Header section with bold title */}
      <div className="p-4 border-b border-blue-600 flex items-center justify-center">
        {isOpen ? (
          // Show full title when sidebar is open
          <h1 className="text-xl font-bold text-white">Bank Dashboard</h1>
        ) : (
          // Show initial when sidebar is collapsed
          <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center text-white">
            B
          </div>
        )}
      </div>

      {/* Navigation menu with items */}
      <nav className="flex-1 p-2">
        {navItems.map((item) => (
          // NavLink for each menu item, with active state styling
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) => `
              flex items-center p-3 rounded-lg m-2 transition-colors
              ${isOpen ? "justify-start" : "justify-center"}
              ${
                isActive
                  ? "bg-blue-600 text-white" // Highlight active item with lighter blue
                  : "text-white hover:bg-blue-700" // Default and hover styles
              }
            `}
          >
            {/* Icon for the menu item */}
            <span className="text-xl">{item.icon}</span>
            {/* Show text when sidebar is open */}
            {isOpen && <span className="ml-3">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Toggle button at the bottom */}
      <div className="p-2 border-t border-blue-600">
        <button
          onClick={onToggle}
          className="w-full p-2 rounded-lg hover:bg-blue-700 text-white flex justify-center"
        >
          {/* Toggle icon based on sidebar state */}
          {isOpen ? <ChevronsLeft /> : <ChevronsRight />}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
// This Sidebar component provides a responsive navigation menu for the admin dashboard.
// It includes a toggle button to collapse or expand the sidebar, and uses NavLink for navigation.  