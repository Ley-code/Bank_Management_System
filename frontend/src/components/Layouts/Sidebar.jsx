import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ isOpen, onToggle }) => {
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
    <div
      className={`flex flex-col h-screen bg-blue-50 shadow-lg transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-blue-100 flex items-center justify-center">
        {isOpen ? (
          <h1 className="text-xl font-bold text-blue-800 cursor-pointer">Bank Dashboard</h1>
        ) : (
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
            B
          </div>
        )}
      </div>

      {/* Navigation */}
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
                  : "text-blue-800 hover:bg-blue-100"
              }
            `}
          >
            <span className="text-xl">{item.icon}</span>
            {isOpen && <span className="ml-3">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer Toggle */}
      <div className="p-2 border-t border-blue-100">
        <button
          onClick={onToggle}
          className="w-full p-2 rounded-lg hover:bg-blue-100 text-blue-800 flex justify-center"
        >
          {isOpen ? <ChevronsLeft /> : <ChevronsRight />}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
