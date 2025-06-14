// src/components/Admin/Customers.jsx

import axios from "axios";
import { Edit2, Eye, Trash2, X } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

/**
 * Customers component (Admin view)
 *
 * - Fetches real customer data from backend (GET /api/admin/customers)
 * - Displays in a paginated table, with search/filter capabilities
 * - Allows adding, editing, viewing, and deleting customers
 * - Uses React Hook Form for add/edit forms
 *
 * Advice:
 *   - Ensure your backend responds with the fields: id, fullName, email, phone, city, subCity, zone, woreda, houseNumber, createdAt
 *   - Consider centralizing API calls into a separate "api.js" utility file once you have multiple endpoints.
 */

const Customers = () => {
  // ---- State: Customers List (initially empty, replaced by API data) ----
  const [customers, setCustomers] = useState([]);

  // ---- State: Modal Controls ----
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [viewingCustomer, setViewingCustomer] = useState(null);

  // ---- State: Search & Pagination ----
  const [searchTerm, setSearchTerm] = useState("");
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

  // ---- Effect: Fetch Real Customer Data on Mount ----
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/admin/customers"
        );
        // Transform API fields to local shape
        const apiCustomers = response.data.data.map((c) => ({
          id: c.id,
          fullName: c.fullName,
          email: c.email,
          phone: c.phone,
          city: c.city,
          subcity: c.subCity || "",
          zone: c.zone || "",
          woreda: c.woreda || "",
          houseNo: c.houseNumber || "",
          dateJoined: c.createdAt.split("T")[0],
        }));
        setCustomers(apiCustomers);
      } catch (err) {
        console.error("Failed to fetch customers:", err);
      }
    };

    fetchCustomers();
  }, []);

  // ---- Derived: Filtered & Searched Customers ----
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchesSearch =
        c.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [customers, searchTerm]);

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
    // Pre-fill form fields with existing values
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
  const onSubmit = async (data) => {
    if (editingCustomer) {
      // Editing existing customer: local state update (PUT can be implemented later)
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
    } else {
      // Creating new customer via POST
      const createPayload = {
        fullName: data.fullName.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        city: data.city.trim(),
        subCity: data.subcity.trim(),
        zone: data.zone.trim(),
        woreda: data.woreda.trim(),
        houseNumber: data.houseNo.trim(),
      };

      try {
        const response = await axios.post(
          "http://localhost:8000/api/admin/customers",
          createPayload,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        // Use returned data for state (ensures correct id from backend)
        const newCust = response.data.data;
        const formatted = {
          id: newCust.id,
          fullName: newCust.fullName,
          email: newCust.email,
          phone: newCust.phone,
          city: newCust.city,
          subcity: newCust.subCity || "",
          zone: newCust.zone || "",
          woreda: newCust.woreda || "",
          houseNo: newCust.houseNumber || "",
          dateJoined: newCust.createdAt.split("T")[0],
        };
        setCustomers((prev) => [...prev, formatted]);
      } catch (err) {
        console.error("Failed to create customer:", err);
      }
    }
    setIsFormOpen(false);
  };

  // ---- Handler: View Profile ----
  const openViewModal = (customer) => {
    setViewingCustomer(customer);
    setIsViewOpen(true);
  };

  // ---- Handler: Delete Customer ----
  const deleteCustomer = async (customer) => {
    if (
      window.confirm(
        `Are you sure you want to permanently delete ${customer.fullName}?`
      )
    ) {
      setCustomers((prev) => prev.filter((c) => c.id !== customer.id));
      // TODO: Send DELETE request to backend
      /*
      try {
        await fetch(`http://localhost:8000/api/admin/customers/${customer.id}`, {
          method: "DELETE",
        });
      } catch (err) {
        console.error("Failed to delete customer:", err);
      }
      */
    }
  };

  // ---- Handler: Close Modals ----
  const closeForm = () => setIsFormOpen(false);
  const closeView = () => setIsViewOpen(false);

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <div className="flex-1 p-6 bg-gray-50">
        {/* ===== Search Bar ===== */}
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

          <button
            onClick={openAddForm}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer"
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
                  <td className="px-4 py-3 text-sm text-gray-700 flex space-x-2">
                    <button
                      onClick={() => openViewModal(customer)}
                      title="View Profile"
                      className="p-1 rounded hover:bg-gray-200 cursor-pointer"
                    >
                      <Eye className="w-4 h-4 text-blue-600" />
                    </button>
                    <button
                      onClick={() => openEditForm(customer)}
                      title="Edit"
                      className="p-1 rounded hover:bg-gray-200 cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4 text-green-600" />
                    </button>
                    <button
                      onClick={() => deleteCustomer(customer)}
                      title="Delete"
                      className="p-1 rounded hover:bg-gray-200 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedCustomers.length === 0 && (
                <tr>
                  <td
                    colSpan={10}
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
          className="fixed inset-0 backdrop-blur-[2px] bg-transparent flex items-center justify-center z-50"
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
                {`${viewingCustomer.houseNo}, ${viewingCustomer.woreda}, ${viewingCustomer.zone}, ${viewingCustomer.subcity}, ${viewingCustomer.city}`}
              </p>
              <p>
                <strong>Date Joined:</strong> {viewingCustomer.dateJoined}
              </p>
            </div>
            <button
              onClick={closeView}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* ===== Add / Edit Customer Modal ===== */}
      {isFormOpen && (
        <div
          className="fixed inset-0 backdrop-blur-[2px] bg-transparent flex items-center justify-center z-50"
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
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
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
                      value: /^[0-9\-\s]+$/,
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
                  className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 cursor-pointer"
                >
                  {editingCustomer ? "Save Changes" : "Add Customer"}
                </button>
              </div>
            </form>

            {/* Close (×) Button */}
            <button
              onClick={closeForm}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
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
