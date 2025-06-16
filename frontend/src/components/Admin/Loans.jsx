// src/components/Admin/Loans.jsx

import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";

/**
 * Loans component (Admin view)
 *
 * Features:
 *  - Displays two sections: Pending Loan Applications, Accepted Loans
 *  - Search/filter on loan number or username
 *  - Filter Accepted Loans by status (pending, completed, missed deadline)
 *  - Accept/Reject actions for applications (optimistic UI update)
 *  - Added fields:
 *      • interestRate (percentage)
 *      • branchName (string)
 *  - Clean UI with TailwindCSS, comments, and API placeholders
 *
 * Dummy data is used; replace with real API calls when backend is ready:
 *   fetch("/api/admin/loans/applications") for pending
 *   fetch("/api/admin/loans/accepted") for accepted
 *   POST/PUT/DELETE endpoints for handling accept/reject and updates
 */

const Loans = () => {
  // ---- State: loan lists and UI controls ----
  const [loanApplications, setLoanApplications] = useState([]);
  const [acceptedLoans, setAcceptedLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ---- State: Search and Filter ----
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All"); // For accepted loans

  // ---- Fetch data effect ----
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:8000/api/admin/loans"
        );
        if (response.data.status === "success") {
          // Assuming the API returns both applications and accepted loans
          setLoanApplications(response.data.data.applications || []);
          setAcceptedLoans(response.data.data.accepted || []);
        } else {
          setError("Failed to fetch loan data");
        }
      } catch (err) {
        setError("Failed to fetch loan data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ---- Handle accepting a loan application ----
  const handleAccept = async (id) => {
    const application = loanApplications.find((app) => app.id === id);
    if (!application) return;

    // Optimistic UI update: remove from applications, add to accepted
    setLoanApplications((prev) => prev.filter((app) => app.id !== id));
    setAcceptedLoans((prev) => [
      ...prev,
      { ...application, status: "pending" },
    ]);

    // TODO: API call to approve loan
    // try {
    //   await fetch(`/api/admin/loans/${id}/approve`, { method: "POST" });
    // } catch (err) {
    //   // Rollback on error
    //   setLoanApplications((prev) => [...prev, application]);
    //   setAcceptedLoans((prev) => prev.filter((loan) => loan.id !== id));
    //   setError("Failed to approve loan");
    // }
  };

  // ---- Handle rejecting a loan application ----
  const handleReject = async (id) => {
    const application = loanApplications.find((app) => app.id === id);
    if (!application) return;

    // Optimistic UI update: remove from applications
    setLoanApplications((prev) => prev.filter((app) => app.id !== id));

    // TODO: API call to reject loan
    // try {
    //   await fetch(`/api/admin/loans/${id}/reject`, { method: "POST" });
    // } catch (err) {
    //   // Rollback on error
    //   setLoanApplications((prev) => [...prev, application]);
    //   setError("Failed to reject loan");
    // }
  };

  // ---- Derived: Filtered Loan Applications by searchTerm ----
  const filteredApplications = useMemo(() => {
    return loanApplications.filter((app) => {
      const searchStr = searchTerm.toLowerCase();
      return (
        app.loanNumber.toLowerCase().includes(searchStr) ||
        app.username.toLowerCase().includes(searchStr) ||
        // match branchName as well
        app.branchName.toLowerCase().includes(searchStr)
      );
    });
  }, [loanApplications, searchTerm]);

  // ---- Derived: Filtered Accepted Loans by searchTerm & status ----
  const filteredAcceptedLoans = useMemo(() => {
    return acceptedLoans.filter((loan) => {
      const matchesSearch =
        loan.loanNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.branchName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "All" || loan.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [acceptedLoans, searchTerm, filterStatus]);

  // ---- Render loading or error states ----
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
      {/* ===== Section: Loan Applications ===== */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Loan Applications
          </h2>
          <input
            type="text"
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-3 md:mt-0 md:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[1100px] table-auto bg-gray-50 rounded-lg shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">
                  Loan #
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">
                  Username
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">
                  Branch
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">
                  Amount
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">
                  Interest %
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">
                  Start Date
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">
                  End Date
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.length > 0 ? (
                filteredApplications.map((app) => (
                  <tr
                    key={app.id}
                    className="even:bg-white odd:bg-gray-50 hover:bg-gray-100"
                  >
                    <td className="p-3 text-sm text-gray-700">
                      {app.loanNumber}
                    </td>
                    <td className="p-3 text-sm text-gray-700">
                      {app.username}
                    </td>
                    <td className="p-3 text-sm text-gray-700">
                      {app.branchName}
                    </td>
                    <td className="p-3 text-sm text-gray-700">
                      ${app.amount.toLocaleString()}
                    </td>
                    <td className="p-3 text-sm text-gray-700">
                      {app.interestRate}%
                    </td>
                    <td className="p-3 text-sm text-gray-700">
                      {app.startDate}
                    </td>
                    <td className="p-3 text-sm text-gray-700">{app.endDate}</td>
                    <td className="p-3 text-sm text-gray-700 flex space-x-2">
                      {/* Accept Button */}
                      <button
                        onClick={() => handleAccept(app.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                        title="Accept Loan"
                      >
                        Accept
                      </button>
                      {/* Reject Button */}
                      <button
                        onClick={() => handleReject(app.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                        title="Reject Loan"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="p-4 text-center text-gray-500 italic"
                  >
                    No pending applications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== Section: Accepted Loans ===== */}
      <div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Accepted Loans</h2>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            {/* Search field */}
            <input
              type="text"
              placeholder="Search accepted..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {/* Filter by Status */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full md:w-1/5 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="missed deadline">Missed Deadline</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[1100px] table-auto bg-gray-50 rounded-lg shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">
                  Loan #
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">
                  Username
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">
                  Branch
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">
                  Amount
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">
                  Interest %
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">
                  Start Date
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">
                  End Date
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAcceptedLoans.length > 0 ? (
                filteredAcceptedLoans.map((loan) => (
                  <tr
                    key={loan.id}
                    className="even:bg-white odd:bg-gray-50 hover:bg-gray-100"
                  >
                    <td className="p-3 text-sm text-gray-700">
                      {loan.loanNumber}
                    </td>
                    <td className="p-3 text-sm text-gray-700">
                      {loan.username}
                    </td>
                    <td className="p-3 text-sm text-gray-700">
                      {loan.branchName}
                    </td>
                    <td className="p-3 text-sm text-gray-700">
                      ${loan.amount.toLocaleString()}
                    </td>
                    <td className="p-3 text-sm text-gray-700">
                      {loan.interestRate}%
                    </td>
                    <td className="p-3 text-sm text-gray-700">
                      {loan.startDate}
                    </td>
                    <td className="p-3 text-sm text-gray-700">
                      {loan.endDate}
                    </td>
                    <td className="p-3 text-sm text-gray-700">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          loan.status === "pending"
                            ? "bg-yellow-200 text-yellow-800"
                            : loan.status === "completed"
                            ? "bg-green-200 text-green-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {loan.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="p-4 text-center text-gray-500 italic"
                  >
                    No accepted loans found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Loans;
// Note: This component uses dummy data and does not include real API calls.
// Replace the fetch calls with actual API endpoints when backend is ready.
// Ensure to handle errors and loading states properly in production code.
// TailwindCSS classes are used for styling; ensure Tailwind is configured in your project.
