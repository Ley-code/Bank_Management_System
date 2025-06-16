// src/components/Admin/Customers.jsx

import axios from "axios";
import { Edit2, Eye, X } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
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
  const [loading, setLoading] = useState(true);

  // ---- State: Modal Controls ----
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [viewingCustomer, setViewingCustomer] = useState(null);

  // ---- State: Search & Pagination ----
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // ---- State: Dropdown Controls ----
  const [dropdownOpenId, setDropdownOpenId] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownBtnRefs = useRef({});

  // ---- React Hook Form Setup ----
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // ---- State: Accounts Count and Total Balance ----
  const [accountsCount, setAccountsCount] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  // ---- Effect: Fetch Real Customer Data on Mount ----
  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();

    // Listen for admin-data-updated event to refresh customers
    const handleAdminDataUpdated = () => {
      fetchCustomers();
    };
    window.addEventListener("admin-data-updated", handleAdminDataUpdated);
    return () => {
      window.removeEventListener("admin-data-updated", handleAdminDataUpdated);
    };
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

  // ---- Handler: View Profile ----
  const openViewModal = async (customer) => {
    setViewingCustomer(customer);
    setIsViewOpen(true);
    // Fetch accounts for this customer
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/accounts"
      );
      const allAccounts = response.data.data || [];
      // Filter accounts by accountHolderName or accountHolder (case-insensitive)
      const customerAccounts = allAccounts.filter(
        (acc) =>
          (acc.accountHolderName &&
            acc.accountHolderName.toLowerCase() ===
              customer.fullName.toLowerCase()) ||
          (acc.accountHolder &&
            acc.accountHolder.toLowerCase() === customer.fullName.toLowerCase())
      );
      setAccountsCount(customerAccounts.length);
      setTotalBalance(
        customerAccounts.reduce(
          (sum, acc) => sum + (Number(acc.accountBalance) || 0),
          0
        )
      );
    } catch (err) {
      setAccountsCount(0);
      setTotalBalance(0);
    }
  };

  // ---- Handler: Delete Customer ----
  const deleteCustomer = async (customer) => {
    if (
      window.confirm(
        `Are you sure you want to permanently delete ${customer.fullName}?`
      )
    ) {
      setCustomers((prev) => prev.filter((c) => c.id !== customer.id));
      try {
        await axios.delete(
          `http://localhost:8000/api/admin/customers/${customer.id}`
        );
      } catch (err) {
        console.error("Failed to delete customer:", err);
      }
    }
  };

  // ---- Handler: Close Modals ----
  const closeForm = () => setIsFormOpen(false);
  const closeView = () => setIsViewOpen(false);

  // Dropdown handlers
  const handleDropdownToggle = (id) => {
    if (dropdownOpenId === id) {
      setDropdownOpenId(null);
      return;
    }
    // Get the button's bounding rect for positioning
    const btn = dropdownBtnRefs.current[id];
    if (btn) {
      const rect = btn.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.right + window.scrollX - 180, // 180px is dropdown width
      });
    }
    setDropdownOpenId(id);
  };
  const handleDropdownClose = () => setDropdownOpenId(null);

  // ---- Handler: Form Submit (Add or Edit) ----
  const onSubmit = async (data) => {
    if (editingCustomer) {
      // Update all fields, not just fullName
      const updatePayload = {
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
        const response = await axios.put(
          `http://localhost:8000/api/admin/customers/${editingCustomer.id}`,
          updatePayload,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        if (response.data.status === "success") {
          setCustomers((prev) =>
            prev.map((c) =>
              c.id === editingCustomer.id ? { ...c, ...updatePayload } : c
            )
          );
        }
      } catch (err) {
        console.error("Failed to update customer:", err);
      }
      setIsFormOpen(false);
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

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <div className="flex-1 p-6 bg-gray-50">
        <div className="rounded-xl shadow-md bg-white p-6">
          {/* ===== Search Bar and Add Button ===== */}
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
          <div className="overflow-x-auto w-full rounded-xl">
            <table className="w-full min-w-[1100px] table-auto rounded-xl overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
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
                    <td className="px-4 py-3 text-sm text-gray-700 relative">
                      <button
                        ref={(el) =>
                          (dropdownBtnRefs.current[customer.id] = el)
                        }
                        onClick={() => handleDropdownToggle(customer.id)}
                        className="p-1 rounded hover:bg-gray-200 cursor-pointer flex items-center justify-center"
                        aria-label="Actions"
                        type="button"
                      >
                        <span className="inline-block">
                          <svg
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle cx="5" cy="12" r="1.5" fill="#222" />
                            <circle cx="12" cy="12" r="1.5" fill="#222" />
                            <circle cx="19" cy="12" r="1.5" fill="#222" />
                          </svg>
                        </span>
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
          className="fixed inset-0 backdrop-blur-[2px] bg-black/10 flex items-center justify-center z-50"
          onClick={closeView}
        >
          <div
            className="bg-white p-8 rounded-2xl shadow-2xl max-w-lg w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeView}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-700">
                {viewingCustomer.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {viewingCustomer.fullName}
                  </h2>
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                    Active
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-gray-700">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M16 12a4 4 0 1 0-8 0 4 4 0 0 0 8 0Z" />
                  <path d="M12 14v7m0 0H7m5 0h5" />
                </svg>
                <span>{viewingCustomer.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M2 8.5C2 7.12 3.12 6 4.5 6h15A2.5 2.5 0 0 1 22 8.5v7A2.5 2.5 0 0 1 19.5 18h-15A2.5 2.5 0 0 1 2 15.5v-7Z" />
                  <path d="M6 10h.01M6 14h.01M12 10h.01M12 14h.01M18 10h.01M18 14h.01" />
                </svg>
                <span>{viewingCustomer.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.657 16.657A8 8 0 1 0 6.343 5.343a8 8 0 0 0 11.314 11.314Z" />
                  <path d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                <span>{`${viewingCustomer.houseNo}, ${viewingCustomer.woreda}, ${viewingCustomer.zone}, ${viewingCustomer.subcity}, ${viewingCustomer.city}`}</span>
              </div>
            </div>
            <div className="flex justify-between items-center border-t pt-4 mt-4">
              <div className="text-center">
                <div className="text-xs text-gray-500">Accounts</div>
                <div className="text-2xl font-bold text-gray-900">
                  {accountsCount}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500">Total Balance</div>
                <div className="text-2xl font-bold text-gray-900">
                  ${totalBalance.toLocaleString()}
                </div>
              </div>
            </div>
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
                      value: /^\+?[0-9\s\-]+$/,
                      message: "Invalid phone format",
                    },
                  })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. +251-91-123-4567"
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

      {/* Portal Dropdown */}
      {dropdownOpenId !== null &&
        (() => {
          const customer = customers.find((c) => c.id === dropdownOpenId);
          if (!customer) return null;
          return ReactDOM.createPortal(
            <div
              style={{
                position: "absolute",
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                zIndex: 9999,
                width: 180,
              }}
              className="bg-white border border-gray-200 rounded-lg shadow-lg flex flex-col py-2 animate-fade-in"
              onMouseLeave={handleDropdownClose}
            >
              <button
                onClick={() => {
                  openViewModal(customer);
                  handleDropdownClose();
                }}
                className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 text-gray-800 gap-2 cursor-pointer"
              >
                <Eye className="w-4 h-4 mr-2" /> View Details
              </button>
              <div className="border-t border-gray-200 my-1" />
              <button
                onClick={() => {
                  openEditForm(customer);
                  handleDropdownClose();
                }}
                className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 text-gray-800 gap-2 cursor-pointer"
              >
                <Edit2 className="w-4 h-4 mr-2" /> Edit Customer
              </button>
            </div>,
            document.body
          );
        })()}
    </div>
  );
};

export default Customers;
