import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { NavLink } from "react-router-dom";

const CustomerSidebar = ({ isOpen, onToggle }) => {
  // Define navigation items with paths and icons
  const navItems = [
    { id: 1, name: "Dashboard", path: "/customer/dashboard", icon: "🏦" },
    { id: 2, name: "Apply for Loan", path: "/customer/loan", icon: "💰" },
    { id: 3, name: "Transfer Money", path: "/customer/transfer", icon: "💸" },
  ];

  return (
    <div
      className={`flex flex-col h-screen bg-blue-800 text-white shadow-lg transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Header section */}
      <div className="p-4 border-b border-blue-600 flex items-center justify-center">
        {isOpen ? (
          <h1 className="text-xl font-bold text-white">Customer Portal</h1>
        ) : (
          <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center text-white">
            C
          </div>
        )}
      </div>

      {/* Navigation menu */}
      <nav className="flex-1 p-2">
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) => `
              flex items-center p-3 rounded-lg m-2 transition-colors
              ${isOpen ? "justify-start" : "justify-center"}
              ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-white hover:bg-blue-700"
              }
            `}
          >
            <span className="text-xl">{item.icon}</span>
            {isOpen && <span className="ml-3">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Toggle button */}
      <div className="p-2 border-t border-blue-600">
        <button
          onClick={onToggle}
          className="w-full p-2 rounded-lg hover:bg-blue-700 text-white flex justify-center"
        >
          {isOpen ? <ChevronsLeft /> : <ChevronsRight />}
        </button>
      </div>
    </div>
  );
};

export default CustomerSidebar; 