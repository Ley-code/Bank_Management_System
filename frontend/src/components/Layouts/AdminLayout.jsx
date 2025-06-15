import { useState } from "react";
import { Outlet } from "react-router-dom";
import BankSidebar from "./Sidebar";

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen">
      <BankSidebar
        isOpen={isSidebarOpen}
        onToggle={() => setSidebarOpen(!isSidebarOpen)}
      />

      {/* Attractive divider between sidebar and content */}
      <div
        className="w-1 bg-gradient-to-b from-blue-200/80 via-gray-200/80 to-transparent shadow-lg"
        style={{ minHeight: "100vh" }}
      />

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-50 overflow-x-auto">
        <Outlet /> {/* This will render nested routes */}
      </main>
    </div>
  );
};

export default AdminLayout;
