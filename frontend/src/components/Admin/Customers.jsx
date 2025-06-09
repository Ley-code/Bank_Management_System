// src/components/Admin/Customers.jsx

import { Edit2, Eye, Trash2, X } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

/**
 * Customers component (Admin view)
 *
 * - Ensures no horizontal scroll (overflow-x-hidden on main container)
 * - Sidebar stickiness and consistent width handled in AdminLayout
 * - Email validation regex fixed
 */

const Customers = () => {
  // ---- State: Customers List (dummy data) ----
  const [customers, setCustomers] = useState([]);

  // ---- State: Modal Controls ----
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [viewingCustomer, setViewingCustomer] = useState(null);

  // ---- State: Search, Filter, Pagination ----
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // ---- React Hook Form Setup ----
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // ---- Effect: Load Dummy Data on Mount ----
  useEffect(() => {
    const dummyCustomers = [
      {
        id: 1,
        fullName: "John Doe",
        email: "john@example.com",
        phone: "123-456-7890",
        city: "Addis Ababa",
        subcity: "Bole",
        zone: "Zone 01",
        woreda: "Woreda 03",
        houseNo: "12A",
        status: "Active",
        dateJoined: "2024-01-10",
      },
      {
        id: 2,
        fullName: "Jane Smith",
        email: "jane@example.com",
        phone: "098-765-4321",
        city: "Bahir Dar",
        subcity: "Fasil",
        zone: "Zone 02",
        woreda: "Woreda 05",
        houseNo: "8B",
        status: "Active",
        dateJoined: "2024-02-15",
      },
      {
        id: 3,
        fullName: "Alice Johnson",
        email: "alice@example.com",
        phone: "555-555-5555",
        city: "Dire Dawa",
        subcity: "Kebele 02",
        zone: "Zone 03",
        woreda: "Woreda 01",
        houseNo: "24C",
        status: "Inactive",
        dateJoined: "2024-03-01",
      },
      {
        id: 4,
        fullName: "Bob Brown",
        email: "bob@example.com",
        phone: "444-444-4444",
        city: "Mekelle",
        subcity: "Gendo",
        zone: "Zone 04",
        woreda: "Woreda 07",
        houseNo: "18",
        status: "Active",
        dateJoined: "2024-04-20",
      },
      {
        id: 5,
        fullName: "Emma Davis",
        email: "emma@example.com",
        phone: "333-333-3333",
        city: "Gondar",
        subcity: "Jan Amora",
        zone: "Zone 05",
        woreda: "Woreda 02",
        houseNo: "5",
        status: "Active",
        dateJoined: "2024-05-05",
      },
      {
        id: 6,
        fullName: "Michael Lee",
        email: "michael@example.com",
        phone: "222-222-2222",
        city: "Awassa",
        subcity: "Menaheriya",
        zone: "Zone 06",
        woreda: "Woreda 04",
        houseNo: "11",
        status: "Active",
        dateJoined: "2024-06-12",
      },
      {
        id: 7,
        fullName: "Sarah Wilson",
        email: "sarah@example.com",
        phone: "111-111-1111",
        city: "Harar",
        subcity: "Jugol",
        zone: "Zone 07",
        woreda: "Woreda 09",
        houseNo: "9",
        status: "Inactive",
        dateJoined: "2024-07-22",
      },
      {
        id: 8,
        fullName: "David Taylor",
        email: "david@example.com",
        phone: "999-999-9999",
        city: "Hawassa",
        subcity: "Tulu Dimtu",
        zone: "Zone 08",
        woreda: "Woreda 06",
        houseNo: "30",
        status: "Active",
        dateJoined: "2024-08-30",
      },
      {
        id: 9,
        fullName: "Lisa Anderson",
        email: "lisa@example.com",
        phone: "888-888-8888",
        city: "Adama",
        subcity: "Robe",
        zone: "Zone 09",
        woreda: "Woreda 08",
        houseNo: "14B",
        status: "Active",
        dateJoined: "2024-09-18",
      },
      {
        id: 10,
        fullName: "Haile G",
        email: "haile@example.com",
        phone: "777-777-7777",
        city: "Jimma",
        subcity: "Seto Semero",
        zone: "Zone 10",
        woreda: "Woreda 12",
        houseNo: "7",
        status: "Active",
        dateJoined: "2024-10-05",
      },
    ];
    setCustomers(dummyCustomers);

    // TODO: fetch("/api/admin/customers").then(res => res.json()).then(data => setCustomers(data));
  }, []);

  // ---- Derived: Filtered & Searched Customers ----
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchesSearch =
        c.id.toString().includes(searchTerm.toLowerCase()) ||
        c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "All" || c.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [customers, searchTerm, filterStatus]);

  // ---- Derived: Paginated Customers ----
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCustomers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCustomers, currentPage]);

  // ---- Handlers: Pagination ----
  const goToPage = (pageNum) => setCurrentPage(pageNum);

  // ---- Handlers: Form Open for Add or Edit ----
  const openAddForm = () => {
    setEditingCustomer(null);
    reset();
    setIsFormOpen(true);
  };
  const openEditForm = (customer) => {
    setEditingCustomer(customer);
    setValue("fullName", customer.fullName);
    setValue("email", customer.email);
    setValue("phone", customer.phone);
    setValue("city", customer.city);
    setValue("subcity", customer.subcity);
    setValue("zone", customer.zone);
    setValue("woreda", customer.woreda);
    setValue("houseNo", customer.houseNo);
    setIsFormOpen(true);
  };

  // ---- Handler: Form Submit (Add or Edit) ----
  const onSubmit = (data) => {
    if (editingCustomer) {
      const updated = {
        ...editingCustomer,
        fullName: data.fullName.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        city: data.city.trim(),
        subcity: data.subcity.trim(),
        zone: data.zone.trim(),
        woreda: data.woreda.trim(),
        houseNo: data.houseNo.trim(),
      };
      setCustomers((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      );
      // TODO: fetch(`/api/admin/customers/${updated.id}`, { method: "PUT", body: JSON.stringify(updated) })
    } else {
      const nextId =
        customers.length > 0 ? Math.max(...customers.map((c) => c.id)) + 1 : 1;
      const newCustomer = {
        id: nextId,
        fullName: data.fullName.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        city: data.city.trim(),
        subcity: data.subcity.trim(),
        zone: data.zone.trim(),
        woreda: data.woreda.trim(),
        houseNo: data.houseNo.trim(),
        status: "Active",
        dateJoined: new Date().toISOString().split("T")[0],
      };
      setCustomers((prev) => [...prev, newCustomer]);
      // TODO: fetch("/api/admin/customers", { method: "POST", body: JSON.stringify(newCustomer) })
    }
    setIsFormOpen(false);
  };

  // ---- Handler: View Profile ----
  const openViewModal = (customer) => {
    setViewingCustomer(customer);
    setIsViewOpen(true);
  };

  // ---- Handler: Deactivate / Activate Customer ----
  const toggleStatus = (customer) => {
    const updated = {
      ...customer,
      status: customer.status === "Active" ? "Inactive" : "Active",
    };
    setCustomers((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
    // TODO: fetch(`/api/admin/customers/${customer.id}/status`, { method: "PATCH", body: JSON.stringify({ status: updated.status }) })
  };

  // ---- Handler: Delete Customer ----
  const deleteCustomer = (customer) => {
    if (
      window.confirm(
        `Are you sure you want to permanently delete ${customer.fullName}?`
      )
    ) {
      setCustomers((prev) => prev.filter((c) => c.id !== customer.id));
      // TODO: fetch(`/api/admin/customers/${customer.id}`, { method: "DELETE" })
    }
  };

  // ---- Handler: Close Modals ----
  const closeForm = () => setIsFormOpen(false);
  const closeView = () => setIsViewOpen(false);

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <div className="flex-1 p-6 bg-gray-50">
        {/* ===== Search & Filter Bar ===== */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 space-y-4 md:space-y-0">
          <input
            type="text"
            placeholder="Search by ID, Name, or Email"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />

          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full md:w-1/5 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <button
            onClick={openAddForm}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Add New Customer
          </button>
        </div>

        {/* ===== Customers Table ===== */}
        <div className="overflow-x-hidden">
          <table className="w-full table-auto bg-white rounded-lg shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Full Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  City
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Subcity
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Zone
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Woreda
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  House No
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="even:bg-gray-50 odd:bg-white hover:bg-gray-100"
                >
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {customer.id}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {customer.fullName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {customer.email}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {customer.phone}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {customer.city}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {customer.subcity}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {customer.zone}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {customer.woreda}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {customer.houseNo}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {customer.status}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 flex space-x-2">
                    <button
                      onClick={() => openViewModal(customer)}
                      title="View Profile"
                      className="p-1 rounded hover:bg-gray-200"
                    >
                      <Eye className="w-4 h-4 text-blue-600" />
                    </button>
                    <button
                      onClick={() => openEditForm(customer)}
                      title="Edit"
                      className="p-1 rounded hover:bg-gray-200"
                    >
                      <Edit2 className="w-4 h-4 text-green-600" />
                    </button>
                    <button
                      onClick={() => toggleStatus(customer)}
                      title={
                        customer.status === "Active" ? "Deactivate" : "Activate"
                      }
                      className="p-1 rounded hover:bg-gray-200"
                    >
                      <Trash2 className="w-4 h-4 text-yellow-600" />
                    </button>
                    <button
                      onClick={() => deleteCustomer(customer)}
                      title="Delete"
                      className="p-1 rounded hover:bg-gray-200"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedCustomers.length === 0 && (
                <tr>
                  <td
                    colSpan={11}
                    className="px-4 py-6 text-center text-gray-500 italic"
                  >
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ===== Pagination Numeric Buttons ===== */}
        <div className="flex justify-center items-center mt-4 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNum) => (
              <button
                key={pageNum}
                onClick={() => goToPage(pageNum)}
                className={`px-3 py-1 rounded-md ${
                  pageNum === currentPage
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {pageNum}
              </button>
            )
          )}
        </div>
      </div>

      {/* ===== View Profile Modal ===== */}
      {isViewOpen && viewingCustomer && (
        <div
          className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50"
          onClick={closeView}
        >
          <div
            className="bg-white p-6 rounded-xl shadow-xl max-w-lg w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Customer Profile
            </h2>
            <div className="space-y-2">
              <p>
                <strong>ID:</strong> {viewingCustomer.id}
              </p>
              <p>
                <strong>Name:</strong> {viewingCustomer.fullName}
              </p>
              <p>
                <strong>Email:</strong> {viewingCustomer.email}
              </p>
              <p>
                <strong>Phone:</strong> {viewingCustomer.phone}
              </p>
              <p>
                <strong>Address:</strong>{" "}
                {`\${viewingCustomer.houseNo}, \${viewingCustomer.woreda}, \${viewingCustomer.zone}, \${viewingCustomer.subcity}, \${viewingCustomer.city}`}
              </p>
              <p>
                <strong>Status:</strong> {viewingCustomer.status}
              </p>
              <p>
                <strong>Date Joined:</strong> {viewingCustomer.dateJoined}
              </p>
            </div>
            <button
              onClick={closeView}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* ===== Add / Edit Customer Modal ===== */}
      {isFormOpen && (
        <div
          className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50"
          onClick={closeForm}
        >
          <div
            className="bg-white p-6 rounded-xl shadow-xl max-w-2xl w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {editingCustomer ? "Edit Customer" : "Add New Customer"}
            </h2>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  {...register("fullName", {
                    required: "Full name is required",
                  })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. John Doe"
                />
                {errors.fullName && (
                  <p className="text-sm text-red-600">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Email (Regex corrected) */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/,
                      message: "Invalid email address",
                    },
                  })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. john@example.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  {...register("phone", {
                    required: "Phone is required",
                    pattern: {
                      value: /^[0-9\\-\\s]+$/,
                      message: "Invalid phone format",
                    },
                  })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. 251-91-123-4567"
                />
                {errors.phone && (
                  <p className="text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  {...register("city", { required: "City is required" })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Addis Ababa"
                />
                {errors.city && (
                  <p className="text-sm text-red-600">{errors.city.message}</p>
                )}
              </div>

              {/* Subcity */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subcity
                </label>
                <input
                  type="text"
                  {...register("subcity", {
                    required: "Subcity is required",
                  })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Bole"
                />
                {errors.subcity && (
                  <p className="text-sm text-red-600">
                    {errors.subcity.message}
                  </p>
                )}
              </div>

              {/* Zone */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Zone
                </label>
                <input
                  type="text"
                  {...register("zone", { required: "Zone is required" })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Zone 01"
                />
                {errors.zone && (
                  <p className="text-sm text-red-600">{errors.zone.message}</p>
                )}
              </div>

              {/* Woreda */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Woreda
                </label>
                <input
                  type="text"
                  {...register("woreda", { required: "Woreda is required" })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Woreda 03"
                />
                {errors.woreda && (
                  <p className="text-sm text-red-600">
                    {errors.woreda.message}
                  </p>
                )}
              </div>

              {/* House No */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  House No
                </label>
                <input
                  type="text"
                  {...register("houseNo", {
                    required: "House No is required",
                  })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. 12A"
                />
                {errors.houseNo && (
                  <p className="text-sm text-red-600">
                    {errors.houseNo.message}
                  </p>
                )}
              </div>

              {/* Submit Button (spanning two columns) */}
              <div className="md:col-span-2 flex justify-end mt-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
                >
                  {editingCustomer ? "Save Changes" : "Add Customer"}
                </button>
              </div>
            </form>

            {/* Close (×) Button */}
            <button
              onClick={closeForm}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
// Note: This component is designed to be used within an AdminLayout that provides the necessary context and styling.
