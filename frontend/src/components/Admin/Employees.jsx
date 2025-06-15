// src/components/Admin/Employees.jsx

import axios from "axios";
import { Edit2, Trash2, X } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
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
  const [loading, setLoading] = useState(false);
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
  } = useForm();

  // ---- Add a state to hold the list of existing employees for the supervisor dropdown ----
  const [existingEmployees, setExistingEmployees] = useState([]);

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
      // Edit existing employee
      const updated = {
        ...editingEmployee,
        name: data.name.trim(),
        position: data.position,
        branch: data.branch.trim(),
        email: data.email.trim(),
        address: data.address.trim(),
        phoneNumber: data.phoneNumber.trim(),
        salary: Number(data.salary),
        supervisor: data.supervisor,
        dateOfJoining: data.dateOfJoining,
      };
      setEmployees((prev) =>
        prev.map((e) => (e.id === updated.id ? updated : e))
      );
      setEditingEmployee(null);

      // TODO: API call to update:
      // fetch(`/api/admin/employees/${updated.id}`, {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(updated),
      // });
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
    if (window.confirm(`Are you sure you want to deactivate ${emp.name}?`)) {
      const updated = { ...emp, status: "Inactive" };
      setEmployees((prev) =>
        prev.map((e) => (e.id === updated.id ? updated : e))
      );

      // TODO: API call to deactivate:
      // fetch(`/api/admin/employees/${emp.id}`, {
      //   method: "PATCH",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ status: "Inactive" }),
      // });
    }
  };

  // ---- Unique Roles & Branches for Filter Dropdowns ----
  const uniqueRoles = useMemo(() => {
    const roles = employees.map((e) => e.position);
    return ["All", ...Array.from(new Set(roles))];
  }, [employees]);
  const uniqueBranches = useMemo(() => {
    const branches = employees.map((e) => e.branch);
    return ["All", ...Array.from(new Set(branches))];
  }, [employees]);

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
          {uniqueRoles.map((r, idx) => (
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
          {uniqueBranches.map((b, idx) => (
            <option key={idx} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      {/* ===== Employees Table ===== */}
      <div className="overflow-x-hidden">
        <table className="w-full table-auto bg-gray-50 rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                ID
              </th>
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
            {paginatedEmployees.length > 0 ? (
              paginatedEmployees.map((emp) => (
                <tr
                  key={emp.id}
                  className="even:bg-white odd:bg-gray-50 hover:bg-gray-100"
                >
                  <td className="px-4 py-3 text-sm text-gray-700">{emp.id}</td>
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
                  <td className="px-4 py-3 text-sm text-gray-700 flex space-x-2">
                    {/* Edit Button */}
                    <button
                      onClick={() => openEditForm(emp)}
                      title="Edit Employee"
                      className="p-1 rounded hover:bg-gray-200 cursor-pointer"
                    >
                      <Edit2 className="w-5 h-5 text-indigo-600" />
                    </button>
                    {/* Deactivate Button */}
                    <button
                      onClick={() => deactivateEmployee(emp)}
                      title="Deactivate Employee"
                      className="p-1 rounded hover:bg-gray-200 cursor-pointer"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
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
                  No employees found.
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
                  <input
                    type="text"
                    {...register("branch", { required: "Branch is required" })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. Main Branch"
                    defaultValue={editingEmployee?.branch || ""}
                  />
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
                    Supervisor
                  </label>
                  <select
                    {...register("supervisorId", {
                      required: "Supervisor is required",
                    })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a Supervisor</option>
                    {existingEmployees.map((emp) => (
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
    </div>
  );
};

export default Employees;
