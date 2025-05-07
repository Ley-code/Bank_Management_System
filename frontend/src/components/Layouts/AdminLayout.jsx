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

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-50">
        <Outlet /> {/* This will render nested routes */}
      </main>
    </div>
  );
};

export default AdminLayout;
