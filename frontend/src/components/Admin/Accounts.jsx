// src/components/Admin/Accounts.jsx

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

/**
 * Accounts component (Admin view)
 *
 * Features implemented:
 *  - Account List View (with dummy data)
 *  - Search & Filter by Account Number, User Name, Account Type, Status
 *  - Create New Account (modal form) now managed by React Hook Form
 *      • 'User Name' dropdown sources from customer list (dummy for now)
 *      • Added 'Branch' dropdown with dummy Ethiopian banks
 *  - View Account Details (modal)
 *  - Edit Account (within detail modal)
 *  - Delete/Close Account (within detail modal)
 *
 * Features omitted per instructions:
 *  - Account Balance Adjustments
 *  - Bulk Actions
 *  - Recent transaction history (separate tab)
 *
 * Notes on dummy data and API integration:
 *  - Dummy accounts and customers are loaded in useEffect. Replace with API calls when backend is ready.
 *    e.g. fetch("/api/admin/accounts").then(res => res.json()).then(setAccounts);
 *         fetch("/api/admin/customers").then(res => res.json()).then(setCustomerList);
 *  - In handleCreateAccount and handleUpdateAccount, swap state update with POST/PUT to backend and use response.
 */

const Accounts = () => {
  // ---- State: Accounts List (dummy data) ----
  const [accounts, setAccounts] = useState([]);

  // ---- State: Customers List (for dropdown) ----
  const [customerList, setCustomerList] = useState([]);

  // ---- State: Filter/Search Controls ----
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // ---- Modal States ----
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // ---- Selected Account for Detail/Edit ----
  const [selectedAccount, setSelectedAccount] = useState(null);

  // ---- React Hook Form for Add/Edit Account ----
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // ---- Load Dummy Data on Mount ----
  useEffect(() => {
    // Dummy accounts
    const dummyAccounts = [
      {
        id: 1,
        accountNumber: "ACC1001",
        userName: "John Doe",
        accountType: "Savings",
        branch: "Commercial Bank of Ethiopia",
        balance: 5000,
        dateOpened: "2024-01-15",
        status: "Active",
      },
      {
        id: 2,
        accountNumber: "ACC1002",
        userName: "Jane Smith",
        accountType: "Checking",
        branch: "Awash Bank",
        balance: 1200,
        dateOpened: "2024-02-02",
        status: "Active",
      },
      {
        id: 3,
        accountNumber: "ACC1003",
        userName: "Alice Johnson",
        accountType: "Savings",
        branch: "Dashen Bank",
        balance: 800,
        dateOpened: "2024-03-08",
        status: "Closed",
      },
      {
        id: 4,
        accountNumber: "ACC1004",
        userName: "Bob Brown",
        accountType: "Checking",
        branch: "Zemen Bank",
        balance: 2500,
        dateOpened: "2024-04-10",
        status: "Active",
      },
      {
        id: 5,
        accountNumber: "ACC1005",
        userName: "Emma Davis",
        accountType: "Savings",
        branch: "Bunna Bank",
        balance: 10000,
        dateOpened: "2024-05-20",
        status: "Active",
      },
    ];
    setAccounts(dummyAccounts);

    // Dummy customers for 'User Name' dropdown
    const dummyCustomers = [
      { id: 1, fullName: "John Doe" },
      { id: 2, fullName: "Jane Smith" },
      { id: 3, fullName: "Alice Johnson" },
      { id: 4, fullName: "Bob Brown" },
      { id: 5, fullName: "Emma Davis" },
      { id: 6, fullName: "Michael Lee" },
      { id: 7, fullName: "Sarah Wilson" },
      { id: 8, fullName: "David Taylor" },
      { id: 9, fullName: "Lisa Anderson" },
      { id: 10, fullName: "Haile G" },
    ];
    setCustomerList(dummyCustomers);

    // TODO: fetch("/api/admin/accounts")
    //   .then((res) => res.json())
    //   .then((data) => setAccounts(data));

    // TODO: fetch("/api/admin/customers")
    //   .then((res) => res.json())
    //   .then((data) => setCustomerList(data));
  }, []);

  /**
   * Opens detail modal for a specific account.
   * Populates form values for editing.
   */
  const openDetailModal = (account) => {
    setSelectedAccount(account);

    // Pre-fill form fields when editing
    setValue("userName", account.userName);
    setValue("accountType", account.accountType);
    setValue("branch", account.branch);
    setValue("initialDeposit", account.balance.toString());

    setIsDetailModalOpen(true);
  };

  /**
   * Handles creation of a new account.
   * Managed by React Hook Form.
   * - Generates a new ID and accountNumber.
   * - Uses form data: userName, accountType, branch, initialDeposit.
   */
  const handleCreateAccount = (data) => {
    // Generate new ID
    const nextId =
      accounts.length > 0 ? Math.max(...accounts.map((a) => a.id)) + 1 : 1;

    // Auto-generate account number (e.g., prefix "ACC" + ID)
    const newAccountNumber = `ACC${1000 + nextId}`;

    // Build new account object
    const newAccount = {
      id: nextId,
      accountNumber: newAccountNumber,
      userName: data.userName,
      accountType: data.accountType,
      branch: data.branch,
      balance: parseFloat(data.initialDeposit),
      dateOpened: new Date().toISOString().split("T")[0], // yyyy-mm-dd
      status: "Active",
    };

    // Update state (in future, replace with API call and response)
    setAccounts((prev) => [...prev, newAccount]);

    // Reset form and close modal
    reset();
    setIsAddModalOpen(false);

    // TODO:
    // fetch("/api/admin/accounts", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(newAccount),
    // }).then((res) => res.json())
    //   .then((saved) => setAccounts((prev) => [...prev, saved]));
  };

  /**
   * Handles update (edit) of selectedAccount.
   * Only userName, accountType, branch can be edited.
   */
  const handleUpdateAccount = (data) => {
    const updated = {
      ...selectedAccount,
      userName: data.userName,
      accountType: data.accountType,
      branch: data.branch,
      // balance remains same; initialDeposit only used on creation
    };

    setAccounts((prev) =>
      prev.map((acc) => (acc.id === updated.id ? updated : acc))
    );
    setSelectedAccount(updated);
    setIsDetailModalOpen(false);

    // TODO:
    // fetch(`/api/admin/accounts/${updated.id}`, {
    //   method: "PUT",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(updated),
    // });
  };

  /**
   * Handles closing (soft deletion) of selectedAccount.
   * Sets status to "Closed".
   */
  const handleCloseAccount = () => {
    if (!selectedAccount) return;

    if (window.confirm("Are you sure you want to close this account?")) {
      const updated = { ...selectedAccount, status: "Closed" };

      setAccounts((prev) =>
        prev.map((acc) => (acc.id === updated.id ? updated : acc))
      );
      setSelectedAccount(updated);
      setIsDetailModalOpen(false);

      // TODO:
      // fetch(`/api/admin/accounts/${updated.id}/status`, {
      //   method: "PATCH",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ status: "Closed" }),
      // });
    }
  };

  /**
   * Filters and searches the accounts array based on searchTerm, filterType, filterStatus.
   */
  const filteredAccounts = accounts.filter((acc) => {
    const matchesSearch =
      acc.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.userName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "All" || acc.accountType === filterType;
    const matchesStatus = filterStatus === "All" || acc.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      {/* Header: Title + Add New Account button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Accounts</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add New Account
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        {/* Search by Account Number or User Name */}
        <input
          type="text"
          placeholder="Search by Account # or User Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 flex-1"
        />

        {/* Filter by Account Type */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="All">All Types</option>
          <option value="Savings">Savings</option>
          <option value="Checking">Checking</option>
        </select>

        {/* Filter by Status */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {/* Accounts Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left text-sm font-semibold text-gray-700">
                Account #
              </th>
              <th className="p-3 text-left text-sm font-semibold text-gray-700">
                User Name
              </th>
              <th className="p-3 text-left text-sm font-semibold text-gray-700">
                Type
              </th>
              <th className="p-3 text-left text-sm font-semibold text-gray-700">
                Branch
              </th>
              <th className="p-3 text-left text-sm font-semibold text-gray-700">
                Balance
              </th>
              <th className="p-3 text-left text-sm font-semibold text-gray-700">
                Date Opened
              </th>
              <th className="p-3 text-left text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="p-3 text-left text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.map((acc) => (
              <tr
                key={acc.id}
                className="hover:bg-gray-100 even:bg-gray-50 odd:bg-white"
              >
                <td className="p-3 text-sm text-gray-700">
                  {acc.accountNumber}
                </td>
                <td className="p-3 text-sm text-gray-700">{acc.userName}</td>
                <td className="p-3 text-sm text-gray-700">{acc.accountType}</td>
                <td className="p-3 text-sm text-gray-700">{acc.branch}</td>
                <td className="p-3 text-sm text-gray-700">
                  ${acc.balance.toLocaleString()}
                </td>
                <td className="p-3 text-sm text-gray-700">{acc.dateOpened}</td>
                <td className="p-3 text-sm text-gray-700">{acc.status}</td>
                <td className="p-3 text-sm text-gray-700">
                  <button
                    onClick={() => openDetailModal(acc)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
            {filteredAccounts.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="p-3 text-center text-gray-500 italic"
                >
                  No accounts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ======== Add New Account Modal ======== */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="bg-white p-8 rounded-xl shadow-xl max-w-lg w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Add New Account
            </h2>

            {/* Form managed by React Hook Form */}
            <form
              onSubmit={handleSubmit(handleCreateAccount)}
              className="space-y-4"
            >
              {/* User Name (dropdown from customerList) */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  User Name
                </label>
                <select
                  {...register("userName", {
                    required: "User Name is required",
                  })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Customer</option>
                  {customerList.map((cust) => (
                    <option key={cust.id} value={cust.fullName}>
                      {cust.fullName}
                    </option>
                  ))}
                </select>
                {errors.userName && (
                  <p className="text-sm text-red-600">
                    {errors.userName.message}
                  </p>
                )}
              </div>

              {/* Account Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Account Type
                </label>
                <select
                  {...register("accountType", {
                    required: "Account Type is required",
                  })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Savings">Savings</option>
                  <option value="Checking">Checking</option>
                </select>
                {errors.accountType && (
                  <p className="text-sm text-red-600">
                    {errors.accountType.message}
                  </p>
                )}
              </div>

              {/* Branch (dropdown with dummy banks) */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Branch
                </label>
                <select
                  {...register("branch", { required: "Branch is required" })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Branch</option>
                  <option value="Commercial Bank of Ethiopia">
                    Commercial Bank of Ethiopia
                  </option>
                  <option value="Awash Bank">Awash Bank</option>
                  <option value="Dashen Bank">Dashen Bank</option>
                  <option value="Zemen Bank">Zemen Bank</option>
                  <option value="Bunna Bank">Bunna Bank</option>
                </select>
                {errors.branch && (
                  <p className="text-sm text-red-600">
                    {errors.branch.message}
                  </p>
                )}
              </div>

              {/* Initial Deposit */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Initial Deposit
                </label>
                <input
                  type="number"
                  {...register("initialDeposit", {
                    required: "Initial Deposit is required",
                    min: { value: 0, message: "Cannot be negative" },
                  })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. 1000"
                  step="0.01"
                />
                {errors.initialDeposit && (
                  <p className="text-sm text-red-600">
                    {errors.initialDeposit.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Create Account
                </button>
              </div>
            </form>

            {/* Close (×) Button */}
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* ======== Account Detail Modal (View/Edit/Close) ======== */}
      {isDetailModalOpen && selectedAccount && (
        <div
          className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50"
          onClick={() => setIsDetailModalOpen(false)}
        >
          <div
            className="bg-white p-8 rounded-xl shadow-xl max-w-lg w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Account Details
            </h2>

            {/* Details & Edit Form */}
            <form
              onSubmit={handleSubmit(handleUpdateAccount)}
              className="space-y-4"
            >
              {/* Account Number (read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Account #
                </label>
                <input
                  type="text"
                  value={selectedAccount.accountNumber}
                  readOnly
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md text-gray-700"
                />
              </div>

              {/* User Name (dropdown) */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  User Name
                </label>
                <select
                  {...register("userName", {
                    required: "User Name is required",
                  })}
                  defaultValue={selectedAccount.userName}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Customer</option>
                  {customerList.map((cust) => (
                    <option key={cust.id} value={cust.fullName}>
                      {cust.fullName}
                    </option>
                  ))}
                </select>
                {errors.userName && (
                  <p className="text-sm text-red-600">
                    {errors.userName.message}
                  </p>
                )}
              </div>

              {/* Account Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Account Type
                </label>
                <select
                  {...register("accountType", {
                    required: "Account Type is required",
                  })}
                  defaultValue={selectedAccount.accountType}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Savings">Savings</option>
                  <option value="Checking">Checking</option>
                </select>
                {errors.accountType && (
                  <p className="text-sm text-red-600">
                    {errors.accountType.message}
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
                  defaultValue={selectedAccount.branch}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Branch</option>
                  <option value="Commercial Bank of Ethiopia">
                    Commercial Bank of Ethiopia
                  </option>
                  <option value="Awash Bank">Awash Bank</option>
                  <option value="Dashen Bank">Dashen Bank</option>
                  <option value="Zemen Bank">Zemen Bank</option>
                  <option value="Bunna Bank">Bunna Bank</option>
                </select>
                {errors.branch && (
                  <p className="text-sm text-red-600">
                    {errors.branch.message}
                  </p>
                )}
              </div>

              {/* Balance (read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Balance
                </label>
                <input
                  type="text"
                  value={`$${selectedAccount.balance.toLocaleString()}`}
                  readOnly
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md text-gray-700"
                />
              </div>

              {/* Date Opened (read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date Opened
                </label>
                <input
                  type="text"
                  value={selectedAccount.dateOpened}
                  readOnly
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md text-gray-700"
                />
              </div>

              {/* Status (editable) */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  name="status"
                  value={selectedAccount.status}
                  onChange={(e) =>
                    setSelectedAccount((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              {/* Action Buttons: Update & Close Account */}
              <div className="flex justify-between items-center mt-6">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCloseAccount}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Close Account
                </button>
              </div>
            </form>

            {/* Close (×) Button */}
            <button
              onClick={() => setIsDetailModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;

