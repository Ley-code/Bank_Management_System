import { useState, useEffect } from "react";
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
  X,
  Bell,
  ChevronsRight,
  Trash2
} from "lucide-react";
import axios from "axios";

const CustomerLayout = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isNotificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const customerId = "d15c6c1c-8e38-422f-a221-ff02afc98d86"; // Assuming customerId is available or fetched

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/user/${customerId}/notifications`);
        const fetchedNotifications = response.data.data || [];
        console.log("fetchedNotifications",fetchedNotifications); 
        setNotifications(fetchedNotifications);
        setUnreadCount(fetchedNotifications.filter(n => !n.read).length);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
    // Poll for new notifications every 30 seconds (adjust as needed)
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [customerId]);

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
    // TODO: Add API call to mark all notifications as read
    // axios.post(`http://localhost:8000/api/user/notifications/${customerId}/mark-all-read`);
  };

  const handleDeleteAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
    // TODO: Add API call to delete all notifications
    // axios.delete(`http://localhost:8000/api/user/notifications/${customerId}/delete-all`);
  };

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
                {/* Notification Icon */}
                <div className="relative">
                  <button 
                    className="p-2 rounded-full hover:bg-gray-100 relative"
                    onClick={() => setNotificationDropdownOpen(prev => !prev)}
                  >
                    <Bell className="w-5 h-5 text-gray-600" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  {isNotificationDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      <div className="px-4 py-2 flex justify-between items-center border-b border-gray-200">
                        <h3 className="text-md font-semibold text-gray-800">Notifications ({unreadCount} unread)</h3>
                        <button 
                          className="text-gray-500 hover:text-gray-700 text-xl leading-none"
                          onClick={() => setNotificationDropdownOpen(false)}
                        >
                          &times;
                        </button>
                      </div>
                      <div className="px-4 py-2 flex flex-wrap gap-2">
                        <button 
                          className="inline-flex items-center px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-md hover:bg-blue-600"
                          onClick={handleMarkAllAsRead}
                        >
                          <ChevronsRight className="w-3 h-3 mr-1" /> Mark all as read
                        </button>
                        <button 
                          className="inline-flex items-center px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-md hover:bg-red-600"
                          onClick={handleDeleteAllNotifications}
                        >
                          <Trash2 className="w-3 h-3 mr-1" /> Delete all
                        </button>
                      </div>
                      <div className="max-h-60 overflow-y-auto custom-scrollbar">
                        {notifications.length > 0 ? (
                          <ul className="space-y-1 p-2">
                            {notifications.map(notification => (
                              <li 
                                key={notification.id}
                                className={`p-2 rounded-md ${notification.read ? 'bg-gray-50 text-gray-700' : 'bg-blue-50 text-blue-800 font-medium'}`}
                              >
                                <p className="text-sm">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{new Date(notification.createdAt).toLocaleString()}</p>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500 text-center py-4 text-sm">No notifications to display.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
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