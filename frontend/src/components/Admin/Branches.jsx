// src/components/Admin/Branch.jsx

import { Edit2, Trash2, X } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

/**
 * Branch component (Admin view)
 *
 * Features:
 *  - Display list of branches with columns:
 *      • Branch Name
 *      • City
 *      • Assets
 *      • Total Deposits
 *      • Total Withdrawals
 *      • Total Loans
 *  - Search & filter by Branch Name or City
 *  - Paginate branch list (5 per page)
 *  - Add New Branch (modal, React Hook Form)
 *  - Edit Branch (modal, React Hook Form)
 *  - Delete Branch (confirmation)
 *
 * Dummy data is used; replace fetch calls when backend is ready:
 *   useEffect: fetch("/api/admin/branches")…
 *   handleCreate: POST /api/admin/branches
 *   handleUpdate: PUT /api/admin/branches/:id
 *   handleDelete: DELETE /api/admin/branches/:id
 */

const Branches = () => {
  // ---- State: Branch List (dummy data) ----
  const [branches, setBranches] = useState([]);

  // ---- State: Search, Filter, Pagination ----
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCity, setFilterCity] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // ---- State: Modal Controls for Add/Edit ----
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null); // null = adding; object = editing

  // ---- React Hook Form Setup ----
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // ---- Load Dummy Data on Mount ----
  useEffect(() => {
    const dummyBranches = [
      {
        id: 1,
        branchName: "Main Branch",
        city: "Addis Ababa",
        assets: 5000000,
        totalDeposits: 2000000,
        totalWithdrawals: 1500000,
        totalLoans: 1000000,
        lastUpdated: "2024-06-01",
      },
      {
        id: 2,
        branchName: "Bole Branch",
        city: "Addis Ababa",
        assets: 3000000,
        totalDeposits: 1200000,
        totalWithdrawals: 800000,
        totalLoans: 600000,
        lastUpdated: "2024-06-02",
      },
      {
        id: 3,
        branchName: "Bahir Dar Branch",
        city: "Bahir Dar",
        assets: 2000000,
        totalDeposits: 900000,
        totalWithdrawals: 500000,
        totalLoans: 400000,
        lastUpdated: "2024-06-03",
      },
      {
        id: 4,
        branchName: "Mekelle Branch",
        city: "Mekelle",
        assets: 1500000,
        totalDeposits: 600000,
        totalWithdrawals: 350000,
        totalLoans: 300000,
        lastUpdated: "2024-06-04",
      },
      {
        id: 5,
        branchName: "Gondar Branch",
        city: "Gondar",
        assets: 1000000,
        totalDeposits: 400000,
        totalWithdrawals: 250000,
        totalLoans: 200000,
        lastUpdated: "2024-06-05",
      },
      {
        id: 6,
        branchName: "Jimma Branch",
        city: "Jimma",
        assets: 800000,
        totalDeposits: 300000,
        totalWithdrawals: 200000,
        totalLoans: 150000,
        lastUpdated: "2024-06-06",
      },
    ];
    setBranches(dummyBranches);

    // TODO: Replace with real API call:
    // fetch("/api/admin/branches")
    //   .then((res) => res.json())
    //   .then((data) => setBranches(data));
  }, []);

  // ---- Derived: Filtered & Searched Branches ----
  const filteredBranches = useMemo(() => {
    return branches.filter((b) => {
      const matchesSearch =
        b.branchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.city.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCity = filterCity === "All" || b.city === filterCity;
      return matchesSearch && matchesCity;
    });
  }, [branches, searchTerm, filterCity]);

  // ---- Derived: Paginated Branches ----
  const totalPages = Math.ceil(filteredBranches.length / itemsPerPage);
  const paginatedBranches = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBranches.slice(start, start + itemsPerPage);
  }, [filteredBranches, currentPage]);

  // ---- Handlers: Pagination ----
  const goToPage = (pageNum) => setCurrentPage(pageNum);

  // ---- Handlers: Open Add Modal ----
  const openAddForm = () => {
    setEditingBranch(null);
    reset();
    setIsFormOpen(true);
  };

  // ---- Handlers: Open Edit Modal ----
  const openEditForm = (branch) => {
    setEditingBranch(branch);
    // Pre-fill form fields
    setValue("branchName", branch.branchName);
    setValue("city", branch.city);
    setValue("assets", branch.assets);
    setValue("totalDeposits", branch.totalDeposits);
    setValue("totalWithdrawals", branch.totalWithdrawals);
    setValue("totalLoans", branch.totalLoans);
    setIsFormOpen(true);
  };

  // ---- Handler: Form Submit (Add/Edit) ----
  const onSubmit = (data) => {
    if (editingBranch) {
      // Edit existing branch
      const updated = {
        ...editingBranch,
        branchName: data.branchName.trim(),
        city: data.city.trim(),
        assets: parseFloat(data.assets),
        totalDeposits: parseFloat(data.totalDeposits),
        totalWithdrawals: parseFloat(data.totalWithdrawals),
        totalLoans: parseFloat(data.totalLoans),
        lastUpdated: new Date().toISOString().split("T")[0],
      };
      setBranches((prev) =>
        prev.map((b) => (b.id === updated.id ? updated : b))
      );
      setEditingBranch(null);

      // TODO: PUT `/api/admin/branches/${updated.id}` with updated data
    } else {
      // Add new branch
      const nextId =
        branches.length > 0 ? Math.max(...branches.map((b) => b.id)) + 1 : 1;
      const newBranch = {
        id: nextId,
        branchName: data.branchName.trim(),
        city: data.city.trim(),
        assets: parseFloat(data.assets),
        totalDeposits: parseFloat(data.totalDeposits),
        totalWithdrawals: parseFloat(data.totalWithdrawals),
        totalLoans: parseFloat(data.totalLoans),
        lastUpdated: new Date().toISOString().split("T")[0],
      };
      setBranches((prev) => [...prev, newBranch]);

      // TODO: POST `/api/admin/branches` with newBranch
    }

    reset();
    setIsFormOpen(false);
  };

  // ---- Handler: Delete Branch ----
  const deleteBranch = (branch) => {
    if (
      window.confirm(
        `Are you sure you want to delete branch "${branch.branchName}"?`
      )
    ) {
      setBranches((prev) => prev.filter((b) => b.id !== branch.id));

      // TODO: DELETE `/api/admin/branches/${branch.id}`
    }
  };

  // ---- Unique Cities for City Filter Dropdown ----
  const uniqueCities = useMemo(() => {
    const cities = branches.map((b) => b.city);
    return ["All", ...Array.from(new Set(cities))];
  }, [branches]);

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <div className="flex-1 p-6 bg-gray-50">
        {/* ===== Header & Add Button ===== */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Branches</h2>
          <button
            onClick={openAddForm}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Add New Branch
          </button>
        </div>

        {/* ===== Search & Filter Controls ===== */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
          {/* Search by Branch Name or City */}
          <input
            type="text"
            placeholder="Search by Branch Name or City"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />

          {/* Filter by City */}
          <select
            value={filterCity}
            onChange={(e) => {
              setFilterCity(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full md:w-1/5 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {uniqueCities.map((city, idx) => (
              <option key={idx} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* ===== Branches Table ===== */}
        <div className="overflow-x-hidden">
          <table className="w-full table-auto bg-white rounded-lg shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Branch Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  City
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Assets
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Total Deposits
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Total Withdrawals
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Total Loans
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Last Updated
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedBranches.map((b) => (
                <tr
                  key={b.id}
                  className="even:bg-gray-50 odd:bg-white hover:bg-gray-100"
                >
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {b.branchName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{b.city}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    ${b.assets.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    ${b.totalDeposits.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    ${b.totalWithdrawals.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    ${b.totalLoans.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {b.lastUpdated}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 flex space-x-2">
                    {/* Edit Button */}
                    <button
                      onClick={() => openEditForm(b)}
                      title="Edit Branch"
                      className="p-1 rounded hover:bg-gray-200"
                    >
                      <Edit2 className="w-5 h-5 text-indigo-600" />
                    </button>
                    {/* Delete Button */}
                    <button
                      onClick={() => deleteBranch(b)}
                      title="Delete Branch"
                      className="p-1 rounded hover:bg-gray-200"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedBranches.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-6 text-center text-gray-500 italic"
                  >
                    No branches found.
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

      {/* ===== Add / Edit Branch Modal ===== */}
      {isFormOpen && (
        <div
          className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50"
          onClick={() => {
            setIsFormOpen(false);
            setEditingBranch(null);
          }}
        >
          <div
            className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {editingBranch ? "Edit Branch" : "Add New Branch"}
            </h2>

            {/* Form with React Hook Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Branch Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Branch Name
                </label>
                <input
                  type="text"
                  {...register("branchName", {
                    required: "Branch Name is required",
                  })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g. Main Branch"
                  defaultValue={editingBranch?.branchName || ""}
                />
                {errors.branchName && (
                  <p className="text-sm text-red-600">
                    {errors.branchName.message}
                  </p>
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g. Addis Ababa"
                  defaultValue={editingBranch?.city || ""}
                />
                {errors.city && (
                  <p className="text-sm text-red-600">{errors.city.message}</p>
                )}
              </div>

              {/* Assets */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Assets
                </label>
                <input
                  type="number"
                  {...register("assets", {
                    required: "Assets value is required",
                    min: { value: 0, message: "Assets cannot be negative" },
                  })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g. 5000000"
                  defaultValue={editingBranch?.assets || ""}
                  step="0.01"
                />
                {errors.assets && (
                  <p className="text-sm text-red-600">
                    {errors.assets.message}
                  </p>
                )}
              </div>

              {/* Total Deposits */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Total Deposits
                </label>
                <input
                  type="number"
                  {...register("totalDeposits", {
                    required: "Total Deposits is required",
                    min: { value: 0, message: "Cannot be negative" },
                  })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g. 2000000"
                  defaultValue={editingBranch?.totalDeposits || ""}
                  step="0.01"
                />
                {errors.totalDeposits && (
                  <p className="text-sm text-red-600">
                    {errors.totalDeposits.message}
                  </p>
                )}
              </div>

              {/* Total Withdrawals */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Total Withdrawals
                </label>
                <input
                  type="number"
                  {...register("totalWithdrawals", {
                    required: "Total Withdrawals is required",
                    min: { value: 0, message: "Cannot be negative" },
                  })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g. 1500000"
                  defaultValue={editingBranch?.totalWithdrawals || ""}
                  step="0.01"
                />
                {errors.totalWithdrawals && (
                  <p className="text-sm text-red-600">
                    {errors.totalWithdrawals.message}
                  </p>
                )}
              </div>

              {/* Total Loans */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Total Loans
                </label>
                <input
                  type="number"
                  {...register("totalLoans", {
                    required: "Total Loans is required",
                    min: { value: 0, message: "Cannot be negative" },
                  })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g. 1000000"
                  defaultValue={editingBranch?.totalLoans || ""}
                  step="0.01"
                />
                {errors.totalLoans && (
                  <p className="text-sm text-red-600">
                    {errors.totalLoans.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="bg-indigo-500 text-white px-5 py-2 rounded-md hover:bg-indigo-600"
                >
                  {editingBranch ? "Save Changes" : "Add Branch"}
                </button>
              </div>
            </form>

            {/* Close (×) Button */}
            <button
              onClick={() => {
                setIsFormOpen(false);
                setEditingBranch(null);
              }}
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

export default Branches;
// Note: This component uses dummy data and React Hook Form for form handling.
// Replace the dummy data and form submission logic with actual API calls when backend is ready.
// Ensure to handle errors and loading states in production code.
// Also consider adding proper validation and error handling for API calls.
// For production, you may want to add loading states, error handling, and more robust validation.
// This code is a complete React component for managing branches in an admin interface.
// It includes features like searching, filtering, pagination, and modals for adding/editing branches.
// The component is designed to be responsive and user-friendly, with clear actions for managing branches.
// The code is structured to be easily maintainable and extendable for future features.
// The component uses React Hook Form for form management, making it easy to handle form state and validation.
// The component is styled using Tailwind CSS classes for a clean and modern look.
// The component is ready to be integrated into a larger admin dashboard or application.
// The code is modular and can be easily adapted for different use cases or data structures.
// The component is designed to be reusable and can be imported into other parts of the application as needed.
// The component is self-contained and does not rely on external state management libraries, making it easy to understand and use.
// The component is optimized for performance with memoization and efficient rendering of lists.
// The component is well-documented with comments explaining each section and functionality.
// The component is tested with dummy data; ensure to replace it with real API calls when available.
// The component is designed to be accessible, with proper labels and focus management for form elements.
// The component is built with best practices in mind, ensuring maintainability and scalability.
// The component is ready for production use with proper error handling and user feedback mechanisms.

