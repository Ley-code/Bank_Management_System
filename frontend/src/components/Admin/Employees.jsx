// src/components/Admin/Employees.jsx

import axios from "axios";
import { Edit2, Trash2, X } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import { useForm } from "react-hook-form";

/**
 * Employees component (Admin view)
 *
 * Features:
 *  - Display paginated table of employees (6 per page) with columns:
 *      • Employee ID
 *      • Full Name
 *      • Role/Position
 *      • Branch Name
 *      • Contact (phone or email)
 *      • Status (Active/Inactive)
 *      • Start Date
 *      • Actions (Edit, Deactivate)
 *  - Search by ID or Name
 *  - Filter by Role and Branch
 *  - Pagination numeric buttons
 *  - Add New Employee modal (React Hook Form)
 *  - Edit Employee modal (React Hook Form)
 *  - Deactivate Employee action (confirmation)
 *
 * API Placeholders (replace dummy data when backend is ready):
 *   - GET  /api/admin/employees?page={page}&pageSize=6&search={}&role={}&branch={}
 *   - POST /api/admin/employees           (create new)
 *   - PUT  /api/admin/employees/{id}      (update existing)
 *   - PATCH/DELETE /api/admin/employees/{id} (deactivate or remove)
 */

const Employees = () => {
  // ---- State: employee list and UI controls ----
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ---- State: Filters & Search ----
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [filterBranch, setFilterBranch] = useState("All");

  // ---- State: Pagination (6 per page) ----
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // ---- State: Modal Controls (Add/Edit) ----
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null); // null => adding

  // ---- React Hook Form for Add/Edit ----
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    watch,
  } = useForm();

  // ---- Add a state to hold the list of existing employees for the supervisor dropdown ----
  const [existingEmployees, setExistingEmployees] = useState([]);

  // ---- Add a state to hold branches for dropdown ----
  const [branches, setBranches] = useState([]);

  // ---- Add a state for dropdown control ----
  const [dropdownOpenId, setDropdownOpenId] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownBtnRefs = React.useRef({});
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingEmployee, setViewingEmployee] = useState(null);

  // Define standard roles
  const STANDARD_ROLES = ["Teller", "Manager", "Admin"];

  // Watch the selected position in the form
  const selectedPosition = watch ? watch("position") : undefined;

  // ---- Load initial dummy data (replace with API later) ----
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:8000/api/admin/employee");
        const data = res.data;
        if (data.status === "success") {
          setEmployees(data.data || []);
        } else {
          setError("Failed to fetch employees");
        }
      } catch (err) {
        setError("Failed to fetch employees");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  // Fetch existing employees on component mount
  useEffect(() => {
    const fetchExistingEmployees = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/admin/employee"
        );
        setExistingEmployees(response.data.data || []);
      } catch (error) {
        console.error("Error fetching existing employees:", error);
      }
    };
    fetchExistingEmployees();
  }, []);

  // Fetch branches for dropdown
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/admin/branch"
        );
        setBranches(response.data?.data || []);
      } catch (error) {
        setBranches([]);
      }
    };
    fetchBranches();
  }, []);

  // ---- Derived: Filtered & Searched Employees ----
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchSearch =
        emp.id.toString().includes(searchTerm.toLowerCase()) ||
        emp.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchRole = filterRole === "All" || emp.position === filterRole;
      const matchBranch = filterBranch === "All" || emp.branch === filterBranch;

      return matchSearch && matchRole && matchBranch;
    });
  }, [employees, searchTerm, filterRole, filterBranch]);

  // ---- Paginated Results ----
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredEmployees.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredEmployees, currentPage]);

  // ---- Open Add Employee Form ----
  const openAddForm = () => {
    setEditingEmployee(null);
    reset();
    setIsFormOpen(true);
  };

  // ---- Open Edit Employee Form ----
  const openEditForm = (emp) => {
    setEditingEmployee(emp);
    // Pre-fill fields
    setValue("name", emp.name);
    setValue("position", emp.position);
    setValue("branch", emp.branch);
    setValue("email", emp.email);
    setValue("address", emp.address);
    setValue("phoneNumber", emp.phoneNumber);
    setValue("salary", emp.salary);
    setValue("supervisor", emp.supervisor);
    setValue("dateOfJoining", emp.dateOfJoining);
    setIsFormOpen(true);
  };

  // ---- Handle Add/Edit Submission ----
  const onSubmit = async (data) => {
    if (editingEmployee) {
      const updated = {
        fullName: data.name.trim(),
        email: data.email.trim(),
        phoneNumber: data.phoneNumber.trim(),
        address: data.address.trim(),
        position: data.position,
        salary: Number(data.salary),
        branchName: data.branch.trim(),
        supervisorId: data.supervisorId || null,
      };
      try {
        await axios.put(
          `http://localhost:8000/api/admin/employee/${editingEmployee.id}`,
          updated,
          { headers: { "Content-Type": "application/json" } }
        );
        setEmployees((prev) =>
          prev.map((e) =>
            e.id === editingEmployee.id ? { ...e, ...updated } : e
          )
        );
        alert("Employee updated successfully!");
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
          alert("Error updating employee: " + err.response.data.message);
        } else if (err.message) {
          alert("Network error: " + err.message);
        } else {
          alert("Unknown error occurred while updating employee.");
        }
      }
      setEditingEmployee(null);
    } else {
      // Add new employee
      const newEmp = {
        fullName: data.name.trim(),
        email: data.email.trim(),
        phoneNumber: data.phoneNumber.trim(),
        address: data.address.trim(),
        position: data.position,
        salary: Number(data.salary),
        branchName: data.branch.trim(),
        supervisorId: data.supervisorId || null, // Ensure supervisorId is included
      };

      // Log the full request payload and headers
      console.log("Submitting to /api/admin/employee:", {
        data: newEmp,
        headers: { "Content-Type": "application/json" },
      });

      try {
        const response = await axios.post(
          "http://localhost:8000/api/admin/employee",
          newEmp,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        if (response.data.status === "success") {
          const createdEmployee = response.data.data;
          setEmployees((prev) => [...prev, createdEmployee]);
        } else {
          console.error("Failed to create employee:", response.data.message);
        }
      } catch (error) {
        console.error("Error creating employee:", error.response?.data);
      }
    }

    reset();
    setIsFormOpen(false);
  };

  // ---- Handle Deactivate Employee ----
  const deactivateEmployee = (emp) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${emp.name}? This cannot be undone.`
      )
    ) {
      axios
        .delete(`http://localhost:8000/api/admin/employee/${emp.id}`)
        .then(() => {
          setEmployees((prev) => prev.filter((e) => e.id !== emp.id));
          setExistingEmployees((prev) => prev.filter((e) => e.id !== emp.id));
          alert("Employee deleted successfully!");
        })
        .catch((err) => {
          if (err.response && err.response.data && err.response.data.message) {
            alert("Error deleting employee: " + err.response.data.message);
          } else if (err.message) {
            alert("Network error: " + err.message);
          } else {
            alert("Unknown error occurred while deleting employee.");
          }
        });
    }
  };

  // ---- Unique Roles & Branches for Filter Dropdowns ----
  const uniqueRoles = useMemo(() => {
    const roles = employees.map((e) => e.position);
    return ["All", ...Array.from(new Set([...roles, ...STANDARD_ROLES]))];
  }, [employees]);
  const uniqueBranches = useMemo(() => {
    const branches = employees.map((e) => e.branch);
    return ["All", ...Array.from(new Set(branches))];
  }, [employees]);

  // ---- View Employee Modal handler
  const openViewModal = (emp) => {
    setViewingEmployee(emp);
    setIsViewModalOpen(true);
  };
  const closeViewModal = () => setIsViewModalOpen(false);

  // ---- Render loading or error states ----
  if (loading) {
    return (
      <div className="text-center p-6">
        <span className="text-gray-500">Loading employees...</span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center p-6">
        <span className="text-red-500">{error}</span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      {/* ===== Header & Add Button ===== */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Employees</h2>
        <button
          onClick={openAddForm}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer"
        >
          Add New Employee
        </button>
      </div>

      {/* ===== Filters & Search ===== */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
        {/* Search by ID or Name */}
        <input
          type="text"
          placeholder="Search by ID or Name"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full md:w-1/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />

        {/* Filter by Role */}
        <select
          value={filterRole}
          onChange={(e) => {
            setFilterRole(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full md:w-1/5 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="All">All Roles</option>
          {uniqueRoles
            .filter((r) => r !== "All")
            .map((r, idx) => (
              <option key={idx} value={r}>
                {r}
              </option>
            ))}
        </select>

        {/* Filter by Branch */}
        <select
          value={filterBranch}
          onChange={(e) => {
            setFilterBranch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full md:w-1/5 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="All">All Branches</option>
          {uniqueBranches
            .filter((b) => b !== "All")
            .map((b, idx) => (
              <option key={idx} value={b}>
                {b}
              </option>
            ))}
        </select>
      </div>

      {/* ===== Employees Table ===== */}
      <div className="overflow-x-auto w-full">
        <table className="w-full min-w-[1100px] table-auto bg-white rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Full Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Position
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Branch
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Email
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Address
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Phone
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Salary
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Supervisor
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Start Date
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && employees.length === 0 ? (
              <tr>
                <td colSpan={11} className="px-4 py-6 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                    <span className="text-gray-500">Loading employees...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedEmployees.length > 0 ? (
              paginatedEmployees.map((emp) => (
                <tr
                  key={emp.id}
                  className="even:bg-white odd:bg-gray-50 hover:bg-gray-100"
                >
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {emp.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {emp.position}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {emp.branch}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {emp.email}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {emp.address}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {emp.phoneNumber}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {emp.salary}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {emp.supervisor}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {emp.dateOfJoining}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 relative">
                    <button
                      ref={(el) => (dropdownBtnRefs.current[emp.id] = el)}
                      onClick={() => {
                        if (dropdownOpenId === emp.id) {
                          setDropdownOpenId(null);
                          return;
                        }
                        const btn = dropdownBtnRefs.current[emp.id];
                        if (btn) {
                          const rect = btn.getBoundingClientRect();
                          setDropdownPosition({
                            top: rect.bottom + window.scrollY,
                            left: rect.right + window.scrollX - 180,
                          });
                        }
                        setDropdownOpenId(emp.id);
                      }}
                      className="p-1 rounded hover:bg-gray-200 cursor-pointer flex items-center justify-center"
                      aria-label="Actions"
                      type="button"
                    >
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
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={11}
                  className="px-4 py-6 text-center text-gray-500 italic"
                >
                  {filterRole !== "All"
                    ? `No ${filterRole.toLowerCase()}s found.`
                    : "No employees found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ===== Pagination Numeric Buttons ===== */}
      <div className="flex justify-center items-center mt-4 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => setCurrentPage(pageNum)}
            className={`px-3 py-1 rounded-md ${
              pageNum === currentPage
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {pageNum}
          </button>
        ))}
      </div>

      {/* ===== Add/Edit Employee Modal ===== */}
      {isFormOpen && (
        <div
          className="fixed inset-0 backdrop-blur-[2px] bg-transparent flex items-center justify-center z-50"
          onClick={() => {
            setIsFormOpen(false);
            setEditingEmployee(null);
          }}
        >
          <div
            className="bg-white p-6 rounded-xl shadow-xl max-w-3xl w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {editingEmployee ? "Edit Employee" : "Add New Employee"}
            </h2>

            {/* React Hook Form - Two Column Layout */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Left Column */}
              <div className="flex flex-col gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    {...register("name", { required: "Full Name is required" })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. Samuel Bekele"
                    defaultValue={editingEmployee?.name || ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                {/* Position */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Position
                  </label>
                  <select
                    {...register("position", {
                      required: "Position is required",
                    })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    defaultValue={editingEmployee?.position || "Teller"}
                  >
                    <option value="Teller">Teller</option>
                    <option value="Manager">Manager</option>
                    <option value="Admin">Admin</option>
                  </select>
                  {errors.position && (
                    <p className="text-sm text-red-600">
                      {errors.position.message}
                    </p>
                  )}
                </div>
                {/* Branch */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Branch
                  </label>
                  <select
                    {...register("branch", { required: "Branch is required" })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    defaultValue={editingEmployee?.branch || ""}
                  >
                    <option value="">Select Branch</option>
                    {branches.map((branch) => (
                      <option
                        key={branch.id || branch.branchName}
                        value={branch.branchName}
                      >
                        {branch.branchName}
                      </option>
                    ))}
                  </select>
                  {errors.branch && (
                    <p className="text-sm text-red-600">
                      {errors.branch.message}
                    </p>
                  )}
                </div>
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="text"
                    {...register("email", { required: "Email is required" })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. samuel.bekele@example.com"
                    defaultValue={editingEmployee?.email || ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-4">
                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    {...register("address", {
                      required: "Address is required",
                    })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. 123 Main St, Anytown, USA"
                    defaultValue={editingEmployee?.address || ""}
                  />
                  {errors.address && (
                    <p className="text-sm text-red-600">
                      {errors.address.message}
                    </p>
                  )}
                </div>
                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="text"
                    {...register("phoneNumber", {
                      required: "Phone is required",
                    })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. 555-1234-5678"
                    defaultValue={editingEmployee?.phoneNumber || ""}
                  />
                  {errors.phoneNumber && (
                    <p className="text-sm text-red-600">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>
                {/* Salary */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Salary
                  </label>
                  <input
                    type="number"
                    {...register("salary", { required: "Salary is required" })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. 50000"
                    defaultValue={editingEmployee?.salary || ""}
                  />
                  {errors.salary && (
                    <p className="text-sm text-red-600">
                      {errors.salary.message}
                    </p>
                  )}
                </div>
                {/* Supervisor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Supervisor{" "}
                    {(editingEmployee &&
                      existingEmployees.filter(
                        (e) => e.id !== editingEmployee.id
                      ).length === 0) ||
                    (!editingEmployee && existingEmployees.length === 0) ? (
                      <span className="text-gray-400">
                        (optional for first/top-level employee)
                      </span>
                    ) : (
                      <span className="text-red-500">*</span>
                    )}
                  </label>
                  <select
                    {...register("supervisorId", {
                      required:
                        selectedPosition === "Teller"
                          ? "Supervisor is required for Tellers"
                          : false,
                    })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    defaultValue={editingEmployee?.supervisorId || ""}
                  >
                    <option value="">Select a Supervisor</option>
                    {(editingEmployee
                      ? existingEmployees.filter(
                          (emp) => emp.id !== editingEmployee.id
                        )
                      : existingEmployees
                    ).map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name}
                      </option>
                    ))}
                  </select>
                  {errors.supervisorId && (
                    <p className="text-sm text-red-600">
                      {errors.supervisorId.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button (spans both columns) */}
              <div className="md:col-span-2 flex justify-end pt-4">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-5 py-2 rounded-md hover:bg-green-600 cursor-pointer"
                >
                  {editingEmployee ? "Save Changes" : "Add Employee"}
                </button>
              </div>
            </form>

            {/* Close (×) Button */}
            <button
              onClick={() => {
                setIsFormOpen(false);
                setEditingEmployee(null);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* ===== View Employee Modal ===== */}
      {isViewModalOpen && viewingEmployee && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-[2px] bg-black/10"
          onClick={closeViewModal}
        >
          <div
            className="bg-white p-8 rounded-2xl shadow-2xl max-w-lg w-full relative animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeViewModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 cursor-pointer text-2xl"
              aria-label="Close"
            >
              &times;
            </button>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-3xl font-bold text-indigo-600">
                <svg width="36" height="36" fill="none" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {viewingEmployee.name || viewingEmployee.fullName}
                  </h2>
                  {/* Position badge */}
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                    {viewingEmployee.position}
                  </span>
                </div>
                <div className="text-gray-500 text-sm mt-1">
                  {viewingEmployee.email}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mb-4">
              <div className="flex items-center gap-2 text-gray-700">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <rect x="3" y="7" width="18" height="10" rx="2" />
                  <path d="M3 10h18" />
                </svg>
                <span className="font-medium">Branch:</span>
                <span>
                  {viewingEmployee.branch || viewingEmployee.branchName}
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
                  <circle cx="12" cy="12" r="10" />
                </svg>
                <span className="font-medium">Supervisor:</span>
                <span>
                  {existingEmployees.find(
                    (e) => e.id === viewingEmployee.supervisorId
                  )?.name ||
                    viewingEmployee.supervisor || (
                      <span className="italic text-gray-400">None</span>
                    )}
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
                <span className="font-medium">Start Date:</span>
                <span>
                  {viewingEmployee.dateOfJoining || (
                    <span className="italic text-gray-400">N/A</span>
                  )}
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
                <span className="font-medium">Salary:</span>
                <span>
                  $
                  {viewingEmployee.salary?.toLocaleString?.() ??
                    viewingEmployee.salary ??
                    "0"}
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
                  <path d="M12 2v20M2 12h20" />
                </svg>
                <span className="font-medium">Address:</span>
                <span>{viewingEmployee.address}</span>
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
                <span className="font-medium">Phone:</span>
                <span>{viewingEmployee.phoneNumber}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M16 8a6 6 0 1 1-8 0" />
                </svg>
                <span className="font-medium">Email:</span>
                <span>{viewingEmployee.email}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== Dropdown Menu ===== */}
      {dropdownOpenId !== null &&
        (() => {
          const emp = paginatedEmployees.find((e) => e.id === dropdownOpenId);
          if (!emp) return null;
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
              onMouseLeave={() => setDropdownOpenId(null)}
            >
              <button
                onClick={() => {
                  openViewModal(emp);
                  setDropdownOpenId(null);
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
                </svg>
                View Details
              </button>
              <button
                onClick={() => {
                  openEditForm(emp);
                  setDropdownOpenId(null);
                }}
                className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 text-gray-800 gap-2 cursor-pointer"
              >
                <Edit2 className="w-4 h-4 mr-2" /> Edit Employee
              </button>
              <div className="border-t border-gray-200 my-1" />
              <button
                onClick={() => {
                  deactivateEmployee(emp);
                  setDropdownOpenId(null);
                }}
                className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 text-red-600 gap-2 cursor-pointer"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete Employee
              </button>
            </div>,
            document.body
          );
        })()}
    </div>
  );
};

export default Employees;
