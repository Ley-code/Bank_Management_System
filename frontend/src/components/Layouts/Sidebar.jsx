import {
  ArrowLeftRight,
  Building2,
  ChevronsLeft,
  ChevronsRight,
  CreditCard,
  LayoutDashboard,
  PiggyBank,
  UserCog,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ isOpen, onToggle }) => {
  const navItems = [
    {
      id: 1,
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 2,
      name: "Accounts",
      path: "/admin/accounts",
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      id: 3,
      name: "Customers",
      path: "/admin/customers",
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: 4,
      name: "Transactions",
      path: "/admin/transactions",
      icon: <ArrowLeftRight className="w-5 h-5" />,
    },
    {
      id: 5,
      name: "Loans",
      path: "/admin/loans",
      icon: <PiggyBank className="w-5 h-5" />,
    },
    {
      id: 6,
      name: "Branches",
      path: "/admin/branches",
      icon: <Building2 className="w-5 h-5" />,
    },
    {
      id: 7,
      name: "Employees",
      path: "/admin/employees",
      icon: <UserCog className="w-5 h-5" />,
    },
  ];

  return (
    <div
      className={`sticky top-0 flex flex-col h-screen bg-white border-r border-gray-200 transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Header section */}
      <div
        className={`py-6 px-4 border-b border-gray-200 flex items-center justify-center transition-all duration-300 ${
          isOpen ? "" : "px-0 py-4"
        }`}
      >
        {isOpen ? (
          <h1 className="text-2xl font-bold text-blue-600 text-center">
            Bank Admin
          </h1>
        ) : (
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-bold text-lg">B</span>
          </div>
        )}
      </div>
      {/* Navigation menu with items */}
      <nav className="flex-1 px-2 py-6 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium
              ${isOpen ? "justify-start" : "justify-center"}
              ${
                isActive
                  ? "bg-blue-50 border-r-4 border-blue-500 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }
              `
            }
          >
            <span
              className={
                window.location.pathname === item.path
                  ? "text-blue-500"
                  : "text-gray-400"
              }
            >
              {item.icon}
            </span>
            {isOpen && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>
      {/* Toggle button at the bottom */}
      <div className="p-2 border-t border-gray-200">
        <button
          onClick={onToggle}
          className="w-full p-2 rounded-lg hover:bg-gray-100 text-blue-800 flex justify-center items-center"
        >
          {isOpen ? <ChevronsLeft /> : <ChevronsRight />}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
