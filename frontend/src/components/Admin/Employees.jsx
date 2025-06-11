// src/components/Admin/Employees.jsx

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
  // ---- Dummy data: initial employee list ----
  const initialEmployees = [
    {
      id: 1,
      fullName: "John Doe",
      role: "Teller",
      branch: "Main Branch",
      contact: "john.doe@example.com",
      status: "Active",
      startDate: "2023-01-15",
    },
    {
      id: 2,
      fullName: "Jane Smith",
      role: "Manager",
      branch: "Bole Branch",
      contact: "jane.smith@example.com",
      status: "Active",
      startDate: "2022-11-20",
    },
    {
      id: 3,
      fullName: "Alice Johnson",
      role: "Teller",
      branch: "Gondar Branch",
      contact: "alice.johnson@example.com",
      status: "Active",
      startDate: "2023-03-01",
    },
    {
      id: 4,
      fullName: "Bob Brown",
      role: "Admin",
      branch: "Mekelle Branch",
      contact: "bob.brown@example.com",
      status: "Active",
      startDate: "2021-09-10",
    },
    {
      id: 5,
      fullName: "Emma Davis",
      role: "Teller",
      branch: "Harar Branch",
      contact: "emma.davis@example.com",
      status: "Inactive",
      startDate: "2022-05-05",
    },
    {
      id: 6,
      fullName: "Michael Lee",
      role: "Manager",
      branch: "Awash Bank Branch",
      contact: "michael.lee@example.com",
      status: "Active",
      startDate: "2023-02-25",
    },
    {
      id: 7,
      fullName: "Sarah Wilson",
      role: "Teller",
      branch: "Hawassa Branch",
      contact: "sarah.wilson@example.com",
      status: "Active",
      startDate: "2023-04-10",
    },
    {
      id: 8,
      fullName: "David Taylor",
      role: "Teller",
      branch: "Adama Branch",
      contact: "david.taylor@example.com",
      status: "Active",
      startDate: "2022-08-18",
    },
    {
      id: 9,
      fullName: "Lisa Anderson",
      role: "Admin",
      branch: "Jimma Branch",
      contact: "lisa.anderson@example.com",
      status: "Active",
      startDate: "2021-12-01",
    },
    {
      id: 10,
      fullName: "Haile G",
      role: "Manager",
      branch: "Main Branch",
      contact: "haile.g@example.com",
      status: "Inactive",
      startDate: "2022-07-22",
    },
  ];

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

  // ---- Load initial dummy data (replace with API later) ----
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        // TODO: Replace with API call:
        // const res = await fetch(
        //   `/api/admin/employees?page=${currentPage}&pageSize=${itemsPerPage}` +
        //   `&search=${encodeURIComponent(searchTerm)}` +
        //   `&role=${filterRole}&branch=${encodeURIComponent(filterBranch)}`
        // );
        // const data = await res.json();
        // setEmployees(data);
        setEmployees(initialEmployees);
      } catch (err) {
        setError("Failed to fetch employees");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [currentPage, searchTerm, filterRole, filterBranch]);

  // ---- Derived: Filtered & Searched Employees ----
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchSearch =
        emp.id.toString().includes(searchTerm.toLowerCase()) ||
        emp.fullName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchRole = filterRole === "All" || emp.role === filterRole;
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
    setValue("fullName", emp.fullName);
    setValue("role", emp.role);
    setValue("branch", emp.branch);
    setValue("contact", emp.contact);
    setValue("status", emp.status);
    setValue("startDate", emp.startDate);
    setIsFormOpen(true);
  };

  // ---- Handle Add/Edit Submission ----
  const onSubmit = (data) => {
    if (editingEmployee) {
      // Edit existing employee
      const updated = {
        ...editingEmployee,
        fullName: data.fullName.trim(),
        role: data.role,
        branch: data.branch.trim(),
        contact: data.contact.trim(),
        status: data.status,
        startDate: data.startDate,
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
      const nextId =
        employees.length > 0 ? Math.max(...employees.map((e) => e.id)) + 1 : 1;
      const newEmp = {
        id: nextId,
        fullName: data.fullName.trim(),
        role: data.role,
        branch: data.branch.trim(),
        contact: data.contact.trim(),
        status: data.status,
        startDate: data.startDate,
      };
      setEmployees((prev) => [...prev, newEmp]);

      // TODO: API call to create:
      // fetch("/api/admin/employees", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(newEmp),
      // });
    }

    reset();
    setIsFormOpen(false);
  };

  // ---- Handle Deactivate Employee ----
  const deactivateEmployee = (emp) => {
    if (
      window.confirm(`Are you sure you want to deactivate ${emp.fullName}?`)
    ) {
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
    const roles = employees.map((e) => e.role);
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
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
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
                Role
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Branch
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Contact
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Status
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
                    {emp.fullName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {emp.role}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {emp.branch}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {emp.contact}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {emp.status}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {emp.startDate}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 flex space-x-2">
                    {/* Edit Button */}
                    <button
                      onClick={() => openEditForm(emp)}
                      title="Edit Employee"
                      className="p-1 rounded hover:bg-gray-200"
                    >
                      <Edit2 className="w-5 h-5 text-indigo-600" />
                    </button>
                    {/* Deactivate Button */}
                    <button
                      onClick={() => deactivateEmployee(emp)}
                      title="Deactivate Employee"
                      className="p-1 rounded hover:bg-gray-200"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
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
          className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50"
          onClick={() => {
            setIsFormOpen(false);
            setEditingEmployee(null);
          }}
        >
          <div
            className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {editingEmployee ? "Edit Employee" : "Add New Employee"}
            </h2>

            {/* React Hook Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  {...register("fullName", {
                    required: "Full Name is required",
                  })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Samuel Bekele"
                  defaultValue={editingEmployee?.fullName || ""}
                />
                {errors.fullName && (
                  <p className="text-sm text-red-600">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Role/Position
                </label>
                <select
                  {...register("role", { required: "Role is required" })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  defaultValue={editingEmployee?.role || "Teller"}
                >
                  <option value="Teller">Teller</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
                {errors.role && (
                  <p className="text-sm text-red-600">{errors.role.message}</p>
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

              {/* Contact */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contact (Email or Phone)
                </label>
                <input
                  type="text"
                  {...register("contact", {
                    required: "Contact info is required",
                  })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. samuel.bekele@example.com"
                  defaultValue={editingEmployee?.contact || ""}
                />
                {errors.contact && (
                  <p className="text-sm text-red-600">
                    {errors.contact.message}
                  </p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  {...register("status", { required: "Status is required" })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  defaultValue={editingEmployee?.status || "Active"}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                {errors.status && (
                  <p className="text-sm text-red-600">
                    {errors.status.message}
                  </p>
                )}
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  {...register("startDate", {
                    required: "Start date is required",
                  })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  defaultValue={editingEmployee?.startDate || ""}
                />
                {errors.startDate && (
                  <p className="text-sm text-red-600">
                    {errors.startDate.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-5 py-2 rounded-md hover:bg-green-600"
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

export default Employees;
