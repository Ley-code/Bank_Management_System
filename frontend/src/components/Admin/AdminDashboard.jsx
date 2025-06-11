// src/components/Admin/AdminDashboard.jsx

import { Bell } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/**
 * AdminDashboard component
 *
 * - Summary Cards: Total Accounts, Total Customers, Total Transactions, Total Loans Issued
 * - Key Metrics: Total Deposits, Total Withdrawals, Active vs. Closed Accounts
 * - Charts:
 *    • Monthly Transaction Volume (Line Chart)
 *    • Account Type Distribution (Pie Chart)
 * - Notification Button: Dropdown with dummy notifications
 * - Footer: Centered with © and current year
 *
 * Dummy data used throughout. To integrate backend:
 *  • Replace useEffect() dummy data with fetch("/api/dashboard/...") calls and update state.
 *  • Replace chart data arrays with API responses.
 */

const AdminDashboard = () => {
  // === State: Summary Stats ===
  const [dashboardStats, setDashboardStats] = useState({
    totalAccounts: 0,
    totalCustomers: 0,
    totalTransactions: 0,
    totalLoansIssued: 0,
  });

  // === State: Key Metrics ===
  const [keyMetrics, setKeyMetrics] = useState({
    totalDeposits: 0,
    totalWithdrawals: 0,
    activeAccounts: 0,
    closedAccounts: 0,
  });

  // === State: Charts Data ===
  const [monthlyTransactions, setMonthlyTransactions] = useState([]);
  const [accountTypeDistribution, setAccountTypeDistribution] = useState([]);

  // === State: Alerts & Notifications ===
  const [alerts, setAlerts] = useState({
    lowBalanceCount: 0,
    overdueLoansCount: 0,
  });

  // === State: Notification Dropdown ===
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // === State: Last Updated Timestamp ===
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    // ===== Dummy Summary Data =====
    setDashboardStats({
      totalAccounts: 1250,
      totalCustomers: 980,
      totalTransactions: 4325,
      totalLoansIssued: 310,
    });

    // ===== Dummy Key Metrics =====
    setKeyMetrics({
      totalDeposits: 1_250_000,
      totalWithdrawals: 950_000,
      activeAccounts: 1100,
      closedAccounts: 150,
    });

    // ===== Dummy Monthly Transactions Data =====
    setMonthlyTransactions([
      { month: "Jan", volume: 400 },
      { month: "Feb", volume: 380 },
      { month: "Mar", volume: 450 },
      { month: "Apr", volume: 500 },
      { month: "May", volume: 480 },
      { month: "Jun", volume: 520 },
      { month: "Jul", volume: 530 },
      { month: "Aug", volume: 600 },
      { month: "Sep", volume: 580 },
      { month: "Oct", volume: 620 },
      { month: "Nov", volume: 640 },
      { month: "Dec", volume: 700 },
    ]);

    // ===== Dummy Account Type Distribution =====
    setAccountTypeDistribution([
      { name: "Savings", value: 800 },
      { name: "Checking", value: 450 },
    ]);

    // ===== Dummy Alerts & Notification Counts =====
    setAlerts({
      lowBalanceCount: 18,
      overdueLoansCount: 7,
    });

    // ===== Dummy Notifications List =====
    setNotifications([
      { id: 1, message: "Loan L123 approved for user John Doe." },
      { id: 2, message: "Account ACC1007 balance below threshold." },
      { id: 3, message: "New customer registration: Jane Smith." },
      { id: 4, message: "Loan L124 pending approval." },
    ]);

    // ===== Last Updated Timestamp =====
    const now = new Date();
    const formatted = now.toLocaleString("en-ET", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    setLastUpdated(formatted);

    // ===== Example API Calls (Commented) =====
    // fetch("/api/dashboard/stats")
    //   .then((res) => res.json())
    //   .then((data) =>
    //     setDashboardStats({
    //       totalAccounts: data.accountsCount,
    //       totalCustomers: data.customersCount,
    //       totalTransactions: data.transactionsCount,
    //       totalLoansIssued: data.loansCount,
    //     })
    //   );
    //
    // fetch("/api/dashboard/key-metrics")
    //   .then((res) => res.json())
    //   .then((data) =>
    //     setKeyMetrics({
    //       totalDeposits: data.deposits,
    //       totalWithdrawals: data.withdrawals,
    //       activeAccounts: data.activeAccounts,
    //       closedAccounts: data.closedAccounts,
    //     })
    //   );
    //
    // fetch("/api/dashboard/monthly-transactions")
    //   .then((res) => res.json())
    //   .then((data) => setMonthlyTransactions(data));
    //
    // fetch("/api/dashboard/account-distribution")
    //   .then((res) => res.json())
    //   .then((data) => setAccountTypeDistribution(data));
    //
    // fetch("/api/notifications")
    //   .then((res) => res.json())
    //   .then((data) => setNotifications(data));
  }, []);

  // Toggle notifications dropdown visibility
  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  // Colors for pie chart segments
  const COLORS = ["#4F46E5", "#10B981"];

  return (
    <div className="flex flex-col min-h-screen px-6 py-8 bg-gray-50">
      {/* ===== Header (Title + Notification Icon) ===== */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="relative">
          {/* Notification Bell */}
          <button
            onClick={toggleNotifications}
            className="relative p-2 rounded-full hover:bg-gray-200 focus:outline-none cursor-pointer"
          >
            <Bell className="w-6 h-6 text-gray-600" />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 inline-flex h-2 w-2 rounded-full bg-red-500"></span>
            )}
          </button>

          {/* Dropdown List */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-10">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-700">
                  Notifications
                </h2>
              </div>
              <ul className="max-h-60 overflow-y-auto">
                {notifications.map((note) => (
                  <li
                    key={note.id}
                    className="px-4 py-3 hover:bg-gray-100 transition"
                  >
                    <p className="text-sm text-gray-800">{note.message}</p>
                  </li>
                ))}
                {notifications.length === 0 && (
                  <li className="px-4 py-3 text-center text-gray-500 italic">
                    No notifications
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* ===== Summary Cards ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Accounts */}
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-gray-700">
            Total Accounts
          </h3>
          <p className="mt-2 text-3xl font-bold text-blue-800">
            {dashboardStats.totalAccounts.toLocaleString()}
          </p>
        </div>

        {/* Total Customers */}
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
          <h3 className="text-lg font-semibold text-gray-700">
            Total Customers
          </h3>
          <p className="mt-2 text-3xl font-bold text-green-800">
            {dashboardStats.totalCustomers.toLocaleString()}
          </p>
        </div>

        {/* Total Transactions */}
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
          <h3 className="text-lg font-semibold text-gray-700">
            Total Transactions
          </h3>
          <p className="mt-2 text-3xl font-bold text-purple-800">
            {dashboardStats.totalTransactions.toLocaleString()}
          </p>
        </div>

        {/* Total Loans Issued */}
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500">
          <h3 className="text-lg font-semibold text-gray-700">
            Total Loans Issued
          </h3>
          <p className="mt-2 text-3xl font-bold text-red-800">
            {dashboardStats.totalLoansIssued.toLocaleString()}
          </p>
        </div>
      </div>

      {/* ===== Key Metrics ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Deposits */}
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <h4 className="text-md font-medium text-gray-600">Total Deposits</h4>
          <p className="mt-1 text-2xl font-semibold text-green-700">
            {`ETB ${keyMetrics.totalDeposits.toLocaleString()}`}
          </p>
        </div>
        {/* Total Withdrawals */}
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <h4 className="text-md font-medium text-gray-600">
            Total Withdrawals
          </h4>
          <p className="mt-1 text-2xl font-semibold text-red-700">
            {`ETB ${keyMetrics.totalWithdrawals.toLocaleString()}`}
          </p>
        </div>
        {/* Active Accounts */}
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <h4 className="text-md font-medium text-gray-600">Active Accounts</h4>
          <p className="mt-1 text-2xl font-semibold text-blue-700">
            {keyMetrics.activeAccounts.toLocaleString()}
          </p>
        </div>
        {/* Closed Accounts */}
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <h4 className="text-md font-medium text-gray-600">Closed Accounts</h4>
          <p className="mt-1 text-2xl font-semibold text-gray-700">
            {keyMetrics.closedAccounts.toLocaleString()}
          </p>
        </div>
      </div>

      {/* ===== Charts Section ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Monthly Transaction Volume (Line Chart) */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Monthly Transaction Volume
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTransactions}>
                <XAxis dataKey="month" stroke="#888888" />
                <YAxis stroke="#888888" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="volume"
                  stroke="#4F46E5"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Account Type Distribution (Pie Chart) */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Account Type Distribution
          </h3>
          <div className="h-64 flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={accountTypeDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#4F46E5"
                  label
                >
                  {accountTypeDistribution.map((entry, index) => (
                    <Cell
                      key={`slice-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ===== Alerts & Notifications Section ===== */}
      <div className="bg-white p-6 rounded-xl shadow-md flex flex-col md:flex-row justify-between items-center mb-8">
        {/* Low‐Balance Accounts Alert */}
        <div className="flex items-center mb-4 md:mb-0">
          <div className="bg-yellow-200 text-yellow-800 p-3 rounded-full mr-3">
            ⚠️
          </div>
          <div>
            <p className="text-lg font-medium text-gray-700">
              Low‐Balance Accounts
            </p>
            <p className="text-2xl font-bold text-yellow-800">
              {alerts.lowBalanceCount}
            </p>
          </div>
        </div>
        {/* Overdue Loans Alert */}
        <div className="flex items-center">
          <div className="bg-red-200 text-red-800 p-3 rounded-full mr-3">
            🚨
          </div>
          <div>
            <p className="text-lg font-medium text-gray-700">Overdue Loans</p>
            <p className="text-2xl font-bold text-red-800">
              {alerts.overdueLoansCount}
            </p>
          </div>
        </div>
      </div>

      {/* ===== Footer ===== */}
      <footer className="mt-auto py-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Your Bank Name. All rights reserved. | Data
        as of {lastUpdated}
      </footer>
    </div>
  );
};

export default AdminDashboard;
// Note: This component uses dummy data for demonstration purposes.
// To integrate with a real backend, replace the dummy data in useEffect with API calls.
// Ensure to handle loading states and errors in a production application.
// Also, consider using a state management solution (like Redux or Context API) for better state handling in larger applications.
// Make sure to install the necessary packages:
// npm install recharts lucide-react
// Tailwind CSS is assumed to be set up in your project for styling.

