// src/components/Admin/Branches.jsx

import axios from "axios";
import { Edit2, Trash2, X } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
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

// Axios instance for branch API
const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: { "Content-Type": "application/json" },
});

const Branches = () => {
  // State: Branch List
  const [branches, setBranches] = useState([]);
  // State: Search, Filter, Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCity, setFilterCity] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  // State: Modal Controls for Add/Edit
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  // Add state for dropdown and view modal
  const [dropdownOpenId, setDropdownOpenId] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownBtnRefs = useRef({});
  const [viewingBranch, setViewingBranch] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // React Hook Form Setup
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // Load Branch Data from API on Mount
  useEffect(() => {
    const fetchBranches = async () => {
      setLoading(true);
      try {
        const response = await api.get("/admin/branch");
        setBranches(response.data?.data || []);
      } catch (error) {
        console.error("Error fetching branches:", error);
        setBranches([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBranches();
  }, []);

  // Derived: Filtered & Searched Branches
  const filteredBranches = useMemo(() => {
    return branches.filter((b) => {
      const matchesSearch =
        b.branchName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.city?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCity = filterCity === "All" || b.city === filterCity;
      return matchesSearch && matchesCity;
    });
  }, [branches, searchTerm, filterCity]);

  // Derived: Paginated Branches
  const totalPages = Math.ceil(filteredBranches.length / itemsPerPage);
  const paginatedBranches = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBranches.slice(start, start + itemsPerPage);
  }, [filteredBranches, currentPage]);

  // Handlers: Pagination
  const goToPage = (pageNum) => setCurrentPage(pageNum);

  // Handlers: Open Add/Edit Modal
  const openAddForm = () => {
    setEditingBranch(null);
    reset();
    setIsFormOpen(true);
  };
  const openEditForm = (branch) => {
    setEditingBranch(branch);
    setValue("branchName", branch.branchName);
    setValue("city", branch.city);
    setValue("assets", branch.assets);
    setValue("totalDeposits", branch.totalDeposits);
    setValue("totalWithdrawals", branch.totalWithdrawals);
    setValue("totalLoans", branch.totalLoans);
    setIsFormOpen(true);
  };

  // Handler: Form Submit (Add/Edit)
  const onSubmit = async (data) => {
    try {
      if (editingBranch) {
        const response = await api.put(
          `/admin/branch/${encodeURIComponent(editingBranch.branchName)}`,
          {
            city: data.city.trim(),
          }
        );
        if (response.data) {
          // Refresh branches list
          const branchesResponse = await api.get("/admin/branch");
          setBranches(branchesResponse.data?.data || []);
        }
        setEditingBranch(null);
      } else {
        // Add new branch (POST)
        const newBranch = {
          branchName: data.branchName.trim(),
          city: data.city.trim(),
          totalDeposits: 0,
          totalWithdrawals: 0,
          totalLoans: 0,
        };
        const response = await api.post("/admin/branch", newBranch);
        if (response.data) {
          // Refresh branches list
          const branchesResponse = await api.get("/admin/branch");
          setBranches(branchesResponse.data?.data || []);
        }
      }
      reset();
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error saving branch:", error);
      alert(
        error.response?.data?.message ||
          "Failed to save branch. Please try again."
      );
    }
  };

  // Handler: Delete Branch (local only, no API)
  const deleteBranch = async (branch) => {
    if (
      window.confirm(
        `Are you sure you want to delete branch "${branch.branchName}"?`
      )
    ) {
      try {
        await api.delete(
          `/admin/branch/${encodeURIComponent(branch.branchName)}`,
          {
            data: {
              branchName: branch.branchName,
              city: branch.city,
              totalDeposits: branch.totalDeposits,
              totalWithdrawals: branch.totalWithdrawals,
              totalLoans: branch.totalLoans,
            },
          }
        );
        // Refresh branches list
        const branchesResponse = await api.get("/admin/branch");
        setBranches(branchesResponse.data?.data || []);
      } catch (error) {
        console.error("Error deleting branch:", error);
        alert(
          error.response?.data?.message ||
            "Failed to delete branch. Please try again."
        );
      }
    }
  };

  // Unique Cities for City Filter Dropdown
  const uniqueCities = useMemo(() => {
    const cities = branches.map((b) => b.city);
    return ["All", ...Array.from(new Set(cities))];
  }, [branches]);

  // Dropdown handlers
  const handleDropdownToggle = (id) => {
    if (dropdownOpenId === id) {
      setDropdownOpenId(null);
      return;
    }
    const btn = dropdownBtnRefs.current[id];
    if (btn) {
      const rect = btn.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.right + window.scrollX - 180,
      });
    }
    setDropdownOpenId(id);
  };
  const handleDropdownClose = () => setDropdownOpenId(null);
  const openViewModal = (branch) => {
    setViewingBranch(branch);
    setIsViewOpen(true);
  };
  const closeViewModal = () => setIsViewOpen(false);

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <div className="flex-1 p-6 bg-gray-50">
        <div className="rounded-xl shadow-md bg-white p-6">
          {/* ===== Title, Search Bar, and Add Button ===== */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold text-gray-800">Branches</h2>
            <input
              type="text"
              placeholder="Search by Branch Name or City"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={openAddForm}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer"
            >
              Add New Branch
            </button>
          </div>
          {/* ===== Branches Table ===== */}
          <div className="overflow-x-auto w-full rounded-xl">
            <table className="w-full min-w-[1100px] table-auto rounded-xl overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Branch Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    City
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
                    Date Created
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedBranches.map((b) => (
                  <tr
                    key={b.id || b.branchName}
                    className="even:bg-gray-50 odd:bg-white hover:bg-gray-100"
                  >
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {b.branchName || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {b.city || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      $
                      {typeof b.totalDeposits === "number"
                        ? b.totalDeposits.toLocaleString()
                        : "0"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      $
                      {typeof b.totalWithdrawals === "number"
                        ? b.totalWithdrawals.toLocaleString()
                        : "0"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      $
                      {typeof b.totalLoans === "number"
                        ? b.totalLoans.toLocaleString()
                        : "0"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {b.createdAt
                        ? new Date(b.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 relative">
                      <button
                        ref={(el) =>
                          (dropdownBtnRefs.current[b.id || b.branchName] = el)
                        }
                        onClick={() =>
                          handleDropdownToggle(b.id || b.branchName)
                        }
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
                {paginatedBranches.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
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
      </div>
      {/* ===== Add / Edit Branch Modal ===== */}
      {isFormOpen && (
        <div
          className="fixed inset-0 backdrop-blur-[2px] bg-transparent flex items-center justify-center z-50"
          onClick={() => {
            setIsFormOpen(false);
            setEditingBranch(null);
          }}
        >
          <div
            className="bg-white p-6 rounded-xl shadow-xl max-w-2xl w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {editingBranch ? "Edit Branch" : "Add New Branch"}
            </h2>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Left Column */}
              <div className="flex flex-col gap-4">
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
                    disabled={!!editingBranch}
                  />
                  {errors.branchName && (
                    <p className="text-sm text-red-600">
                      {errors.branchName.message}
                    </p>
                  )}
                </div>
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
                    <p className="text-sm text-red-600">
                      {errors.city.message}
                    </p>
                  )}
                </div>
              </div>
              {/* Submit Button (spans both columns) */}
              <div className="md:col-span-2 flex justify-end pt-4">
                <button
                  type="submit"
                  className="bg-indigo-500 text-white px-5 py-2 rounded-md hover:bg-indigo-600 cursor-pointer"
                >
                  {editingBranch ? "Save Changes" : "Add Branch"}
                </button>
              </div>
            </form>
            <button
              onClick={() => {
                setIsFormOpen(false);
                setEditingBranch(null);
              }}
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
          const branch = paginatedBranches.find(
            (b) => (b.id || b.branchName) === dropdownOpenId
          );
          if (!branch) return null;
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
                  openViewModal(branch);
                  handleDropdownClose();
                }}
                className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 text-gray-800 gap-2 cursor-pointer"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4l3 3" />
                </svg>{" "}
                View Details
              </button>
              <button
                onClick={() => {
                  openEditForm(branch);
                  handleDropdownClose();
                }}
                className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 text-gray-800 gap-2 cursor-pointer"
              >
                <Edit2 className="w-4 h-4 mr-2" /> Edit Branch
              </button>
              <div className="border-t border-gray-200 my-1" />
              <button
                onClick={() => {
                  deleteBranch(branch);
                  handleDropdownClose();
                }}
                className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 text-red-600 gap-2 cursor-pointer"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete Branch
              </button>
            </div>,
            document.body
          );
        })()}
      {/* View Details Modal */}
      {isViewOpen && viewingBranch && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-[2px] bg-black/10"
          onClick={closeViewModal}
        >
          <div
            className="bg-white p-8 rounded-2xl shadow-2xl max-w-lg w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeViewModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-700">
                {viewingBranch.branchName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {viewingBranch.branchName}
                  </h2>
                </div>
                <div className="text-gray-500 text-sm mt-1">
                  {viewingBranch.city}
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
                  <path d="M12 8v4l3 3" />
                </svg>
                <span>
                  Total Deposits: $
                  {viewingBranch.totalDeposits?.toLocaleString() || 0}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 8v4l3 3" />
                </svg>
                <span>
                  Total Withdrawals: $
                  {viewingBranch.totalWithdrawals?.toLocaleString() || 0}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 8v4l3 3" />
                </svg>
                <span>
                  Total Loans: $
                  {viewingBranch.totalLoans?.toLocaleString() || 0}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 7V3m8 4V3M3 11h18M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2Z" />
                </svg>
                <span>
                  Last Updated:{" "}
                  {viewingBranch.updatedAt
                    ? new Date(viewingBranch.updatedAt).toLocaleString()
                    : "-"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Branches;
