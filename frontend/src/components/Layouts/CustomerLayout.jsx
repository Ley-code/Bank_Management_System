import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Wallet,
  ArrowUpDown,
  PiggyBank,
  CreditCard,
  Settings,
  LogOut,
  User,
  Menu,
  X
} from "lucide-react";

const CustomerLayout = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { 
      id: "dashboard", 
      name: "Dashboard", 
      path: "/customer/dashboard", 
      icon: <LayoutDashboard className="w-5 h-5" /> 
    },
    { 
      id: "accounts", 
      name: "My Accounts", 
      path: "/customer/accounts", 
      icon: <Wallet className="w-5 h-5" /> 
    },
    { 
      id: "transfer", 
      name: "Transfer", 
      path: "/customer/transfer", 
      icon: <ArrowUpDown className="w-5 h-5" /> 
    },
    { 
      id: "withdraw", 
      name: "Withdraw", 
      path: "/customer/withdraw", 
      icon: <CreditCard className="w-5 h-5" /> 
    },
    { 
      id: "loan", 
      name: "Loan", 
      path: "/customer/loan", 
      icon: <PiggyBank className="w-5 h-5" /> 
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">B</span>
                </div>
                <span className="ml-2 text-xl font-bold text-gray-800">Bank Portal</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center px-3 py-2 rounded-md text-sm font-medium
                    ${isActive 
                      ? "bg-blue-50 text-blue-600" 
                      : "text-gray-600 hover:bg-gray-50"
                    }
                  `}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </NavLink>
              ))}
            </div>

            {/* User Profile and Mobile Menu Button */}
            <div className="flex items-center">
              <div className="hidden md:flex md:items-center md:space-x-4">
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <Settings className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <LogOut className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Leykun Birhanu</span>
                </div>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center px-3 py-2 rounded-md text-base font-medium
                    ${isActive 
                      ? "bg-blue-50 text-blue-600" 
                      : "text-gray-600 hover:bg-gray-50"
                    }
                  `}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </NavLink>
              ))}
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">John Doe</div>
                    <div className="text-sm font-medium text-gray-500">Premium Account</div>
                  </div>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  <button className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50">
                    <Settings className="w-5 h-5 mr-3" />
                    Settings
                  </button>
                  <button className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50">
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default CustomerLayout; 