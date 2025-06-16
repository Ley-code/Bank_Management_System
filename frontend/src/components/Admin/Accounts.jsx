// src/components/Admin/Accounts.jsx

import axios from "axios";
import { Edit2, Eye, Trash2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
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

  // ---- State: Branches List (for dropdown) ----
  const [branches, setBranches] = useState([]);

  // ---- State: Filter/Search Controls ----
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // ---- Modal States ----
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // ---- Selected Account for Detail/Edit ----
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [editingAccount, setEditingAccount] = useState(null);

  // ---- React Hook Form for Add/Edit Account ----
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  // Watch selected account number for deposit form
  const selectedAccountNumber = watch("accountNumber");

  // Add state for all accounts for autocomplete
  const [allAccounts, setAllAccounts] = useState([]);
  const [accountNumberInput, setAccountNumberInput] = useState("");
  const [filteredAccountOptions, setFilteredAccountOptions] = useState([]);
  const [selectedAccountDetails, setSelectedAccountDetails] = useState(null);

  // Add state for customer autocomplete
  const [customerOptions, setCustomerOptions] = useState([]);
  const [customerInput, setCustomerInput] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [minDeposit, setMinDeposit] = useState(0);

  // Create an axios instance for API calls
  const api = axios.create({
    baseURL: "http://localhost:8000/api",
    headers: { "Content-Type": "application/json" },
  });

  // Add loading state
  const [loading, setLoading] = useState(true);

  // Add dropdown state
  const [dropdownOpenId, setDropdownOpenId] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownBtnRefs = useRef({});

  // ---- Fetch Accounts: Move to top-level ----
  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/accounts"
      );
      if (response.data && response.data.data) {
        const transformedAccounts = response.data.data.map((account) => ({
          id: account.accountNumber,
          accountNumber: account.accountNumber,
          userName: account.accountHolder,
          accountType: account.accountType,
          branch: account.branchName,
          balance: account.accountBalance,
          dateOpened: account.accountDateCreated,
          status: account.accountStatus,
        }));
        setAccounts(transformedAccounts);
      } else {
        setAccounts([]);
        console.log("No accounts found in the database");
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all accounts for autocomplete when modal opens
  useEffect(() => {
    if (isAddModalOpen) {
      axios
        .get("http://localhost:8000/api/admin/accounts")
        .then((res) => {
          if (res.data && res.data.data) setAllAccounts(res.data.data);
        })
        .catch((err) => {
          console.error("Error fetching accounts for autocomplete:", err);
        });
    }
  }, [isAddModalOpen]);

  // Filter account numbers as admin types
  useEffect(() => {
    if (accountNumberInput.length > 0) {
      setFilteredAccountOptions(
        allAccounts.filter((acc) =>
          acc.accountNumber.startsWith(accountNumberInput)
        )
      );
    } else {
      setFilteredAccountOptions([]);
    }
  }, [accountNumberInput, allAccounts]);

  // When an account is selected, auto-fill details
  const handleAccountNumberSelect = (acc) => {
    setAccountNumberInput(acc.accountNumber);
    setSelectedAccountDetails(acc);
    setValue("customerName", acc.accountHolder);
    setValue("branchName", acc.branchName);
    setFilteredAccountOptions([]);
  };

  // Fetch customers for autocomplete when modal opens
  useEffect(() => {
    if (isAddModalOpen) {
      axios
        .get("http://localhost:8000/api/admin/customers")
        .then((res) => {
          if (res.data && res.data.data) setCustomerOptions(res.data.data);
        })
        .catch((err) => {
          console.error("Error fetching customers for autocomplete:", err);
        });
    }
  }, [isAddModalOpen]);

  // Filter customers as admin types
  useEffect(() => {
    if (customerInput.length > 0) {
      setFilteredCustomers(
        customerOptions.filter((cust) =>
          cust.fullName.toLowerCase().includes(customerInput.toLowerCase())
        )
      );
    } else {
      setFilteredCustomers([]);
    }
  }, [customerInput, customerOptions]);

  // Account type minimum deposit logic
  const accountTypeMin = {
    SAVINGS: 100, // example
    CHECKING: 50, // example
  };

  const handleAccountTypeChange = (e) => {
    setValue("accountType", e.target.value);
    setMinDeposit(accountTypeMin[e.target.value] || 0);
  };

  const handleCustomerSelect = (cust) => {
    setSelectedCustomer(cust);
    setCustomerInput(cust.fullName);
    setFilteredCustomers([]);
  };

  // ---- Load Data on Mount ----
  useEffect(() => {
    // Fetch accounts from API
    fetchAccounts();

    // Fetch branches from API
    const fetchBranches = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/admin/branch"
        );
        if (response.data && response.data.data) {
          setBranches(response.data.data);
        } else {
          setBranches([]);
        }
      } catch (error) {
        console.error("Error fetching branches:", error);
        setBranches([]);
      }
    };

    fetchBranches();

    // Keep the dummy customers for now until we implement the customers API
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
  const handleCreateAccount = async (data) => {
    try {
      if (!selectedCustomer) throw new Error("Please select a valid customer.");
      const payload = {
        customerID: selectedCustomer.id,
        accountType: data.accountType,
        currencyCode: data.currencyCode,
        balance: parseFloat(data.initialBalance),
        branchName: data.branchName,
      };
      const response = await axios.post(
        "http://localhost:8000/api/admin/accounts",
        payload
      );
      if (response.data.status !== "success") {
        throw new Error(response.data.message || "Failed to create account");
      }
      // Refresh accounts list
      await fetchAccounts();
      reset();
      setIsAddModalOpen(false);
      alert("Account created successfully!");
    } catch (error) {
      console.error("Error creating account:", error);
      alert(error.message || "Failed to create account. Please try again.");
    }
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
   * Handles deposit submission.
   * Updates account balance and creates transaction record in backend.
   * After success, refreshes accounts, and notifies other admin pages to refresh.
   */
  const handleDeposit = async (data) => {
    try {
      // Find the account to update
      const accountToUpdate = accounts.find(
        (acc) => acc.accountNumber === data.accountNumber
      );

      if (!accountToUpdate) {
        throw new Error("Account not found");
      }

      // Prepare deposit payload for backend (only send required fields)
      const payload = {
        accountNumber: data.accountNumber,
        amount: parseFloat(data.amount),
        description: "Manual Deposit by Admin",
      };

      // Call backend API to process deposit (should update balance and create transaction)
      const response = await axios.post(
        "http://localhost:8000/api/admin/deposit",
        payload
      );
      if (response.data.status !== "success") {
        throw new Error(response.data.message || "Failed to process deposit");
      }

      // Refresh accounts list from backend
      await fetchAccounts();

      // Dispatch a custom event to notify other admin pages to refresh (Customers, Transactions, Dashboard)
      window.dispatchEvent(new Event("admin-data-updated"));

      // Reset form and close modal
      reset();
      setIsDepositModalOpen(false);

      // Show success message
      alert("Deposit processed successfully!");
    } catch (error) {
      console.error("Error processing deposit:", error);
      alert(error.message || "Failed to process deposit. Please try again.");
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

  // Handler to delete an account
  const handleDeleteAccount = async (account) => {
    if (
      !window.confirm(
        `Are you sure you want to delete account #${account.accountNumber}?`
      )
    )
      return;
    try {
      // Send DELETE request with account data in the body
      await api.delete(`/admin/accounts/${account.accountNumber}`, {
        data: {
          customerID: account.customerID,
          accountType: account.accountType,
          currencyCode: account.currencyCode,
          initialBalance: account.balance,
          branchName: account.branch,
        },
      });
      // Refresh accounts list after deletion
      const response = await api.get("/admin/accounts");
      if (response.data && response.data.data) {
        const transformedAccounts = response.data.data.map((account) => ({
          id: account.accountNumber,
          accountNumber: account.accountNumber,
          userName: account.accountHolder,
          accountType: account.accountType,
          branch: account.branchName,
          balance: account.accountBalance,
          dateOpened: account.dateOpened
            ? new Date(account.dateOpened).toISOString().split("T")[0]
            : "N/A",
          status: (account.status || "ACTIVE").toUpperCase(),
        }));
        setAccounts(transformedAccounts);
      } else {
        setAccounts([]);
      }
      alert("Account deleted successfully!");
    } catch (error) {
      console.error("Error deleting account:", error);
      alert(
        error.response?.data?.message ||
          "Failed to delete account. Please try again."
      );
    }
  };

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

  const openEditModal = (account) => {
    setEditingAccount(account);
    setValue("editAccountType", account.accountType);
    setValue("editBranch", account.branch);
    setValue("editBalance", account.balance);
    setValue("editStatus", account.status);
    setValue("editDateOpened", account.dateOpened);
    setValue("editCurrencyCode", account.currencyCode || "ETB");
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => setIsEditModalOpen(false);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      {/* Header: Title + Add New Account button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Accounts</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setIsDepositModalOpen(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 cursor-pointer"
          >
            Deposit Funds
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer"
          >
            Add New Account
          </button>
        </div>
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
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      {/* Accounts Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[1100px] table-auto bg-white rounded-lg shadow-sm">
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
                  <td className="p-3 text-sm text-gray-700">
                    {acc.accountType}
                  </td>
                  <td className="p-3 text-sm text-gray-700">{acc.branch}</td>
                  <td className="p-3 text-sm text-gray-700">
                    $
                    {typeof acc.balance === "number"
                      ? acc.balance.toLocaleString()
                      : "0"}
                  </td>
                  <td className="p-3 text-sm text-gray-700">
                    {acc.dateOpened}
                  </td>
                  <td className="p-3 text-sm text-gray-700">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold transition-colors duration-200
                        ${
                          acc.status === "ACTIVE"
                            ? "bg-green-100 text-green-700 hover:bg-green-700 hover:text-white"
                            : acc.status === "INACTIVE"
                            ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-700 hover:text-white"
                            : "bg-gray-300 text-gray-700 hover:bg-gray-700 hover:text-white"
                        }
                      `}
                      style={{ cursor: "default" }}
                    >
                      {acc.status.charAt(0) + acc.status.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-gray-700 relative">
                    <button
                      ref={(el) => (dropdownBtnRefs.current[acc.id] = el)}
                      onClick={() => handleDropdownToggle(acc.id)}
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
      )}

      {/* ======== Add New Account Modal ======== */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-[2px] bg-transparent"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="bg-white p-8 rounded-xl shadow-xl max-w-lg w-full relative transition-transform duration-300 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Add New Account
            </h2>
            <form
              onSubmit={handleSubmit(handleCreateAccount)}
              className="space-y-4"
            >
              {/* Customer Auto-complete */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">
                  Select Customer
                </label>
                <input
                  type="text"
                  value={customerInput}
                  onChange={(e) => {
                    setCustomerInput(e.target.value);
                    setSelectedCustomer(null);
                  }}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Type customer name..."
                  autoComplete="off"
                  required
                />
                {filteredCustomers.length > 0 && (
                  <ul className="border border-gray-300 rounded-md bg-white mt-1 max-h-40 overflow-y-auto z-10 absolute w-full">
                    {filteredCustomers.map((cust) => (
                      <li
                        key={cust.id}
                        className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                        onClick={() => handleCustomerSelect(cust)}
                      >
                        {cust.fullName} ({cust.id})
                      </li>
                    ))}
                  </ul>
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
                  onChange={handleAccountTypeChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="SAVINGS">Savings</option>
                  <option value="CHECKING">Checking</option>
                </select>
                {errors.accountType && (
                  <p className="text-sm text-red-600">
                    {errors.accountType.message}
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
                  step="0.01"
                  min={minDeposit}
                  {...register("initialBalance", {
                    required: "Initial Deposit is required",
                    min: {
                      value: minDeposit,
                      message: `Minimum for this type is ${minDeposit}`,
                    },
                  })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder={`Minimum ${minDeposit}`}
                  required
                />
                {errors.initialBalance && (
                  <p className="text-sm text-red-600">
                    {errors.initialBalance.message}
                  </p>
                )}
              </div>
              {/* Currency */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Currency
                </label>
                <select
                  {...register("currencyCode", {
                    required: "Currency is required",
                  })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="ETB">ETB</option>
                </select>
                {errors.currencyCode && (
                  <p className="text-sm text-red-600">
                    {errors.currencyCode.message}
                  </p>
                )}
              </div>
              {/* Account Opening Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Account Opening Date
                </label>
                <input
                  type="date"
                  {...register("dateOpened", { required: "Date is required" })}
                  defaultValue={new Date().toISOString().split("T")[0]}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                {errors.dateOpened && (
                  <p className="text-sm text-red-600">
                    {errors.dateOpened.message}
                  </p>
                )}
              </div>
              {/* Branch (optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Branch Name (optional)
                </label>
                <select
                  {...register("branchName")}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Branch</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.branchName}>
                      {branch.branchName}
                    </option>
                  ))}
                </select>
              </div>
              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer"
                  disabled={!selectedCustomer}
                >
                  Create Account
                </button>
              </div>
            </form>
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer text-2xl"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* ======== Account Detail Modal (View/Edit/Close) ======== */}
      {isDetailModalOpen && selectedAccount && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-[2px] bg-black/10"
          onClick={() => setIsDetailModalOpen(false)}
        >
          <div
            className="bg-white p-8 rounded-2xl shadow-2xl max-w-lg w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsDetailModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 cursor-pointer"
              aria-label="Close"
            >
              &times;
            </button>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-700">
                {selectedAccount.userName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedAccount.userName}
                  </h2>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold transition-colors duration-200
                      ${
                        selectedAccount.status === "ACTIVE"
                          ? "bg-green-100 text-green-700 hover:bg-green-700 hover:text-white"
                          : selectedAccount.status === "INACTIVE"
                          ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-700 hover:text-white"
                          : "bg-gray-300 text-gray-700 hover:bg-gray-700 hover:text-white"
                      }
                    `}
                    style={{ cursor: "default" }}
                  >
                    {selectedAccount.status.charAt(0) +
                      selectedAccount.status.slice(1).toLowerCase()}
                  </span>
                </div>
                <div className="text-gray-500 text-sm mt-1">
                  {selectedAccount.accountType} Account
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
                  <rect x="3" y="7" width="18" height="10" rx="2" />
                  <path d="M3 10h18" />
                </svg>
                <span>{selectedAccount.accountNumber}</span>
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
                <span>{selectedAccount.branch}</span>
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
                  Balance: ${selectedAccount.balance.toLocaleString()}
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
                <span>Date Opened: {selectedAccount.dateOpened}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======== Deposit Funds Modal ======== */}
      {isDepositModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-[2px] bg-transparent"
          onClick={() => setIsDepositModalOpen(false)}
        >
          <div
            className="bg-white p-8 rounded-xl shadow-xl max-w-lg w-full relative transition-transform duration-300 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Deposit Funds
            </h2>

            <form onSubmit={handleSubmit(handleDeposit)} className="space-y-4">
              {/* Account Number (dropdown) */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Account Number
                </label>
                <select
                  {...register("accountNumber", {
                    required: "Account Number is required",
                  })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Account</option>
                  {accounts
                    .filter((acc) => acc.status === "ACTIVE")
                    .map((acc) => (
                      <option key={acc.id} value={acc.accountNumber}>
                        {acc.accountNumber} - {acc.userName}
                      </option>
                    ))}
                </select>
                {errors.accountNumber && (
                  <p className="text-sm text-red-600">
                    {errors.accountNumber.message}
                  </p>
                )}
              </div>

              {/* Customer Name (read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={
                    selectedAccountNumber
                      ? accounts.find(
                          (acc) => acc.accountNumber === selectedAccountNumber
                        )?.userName || ""
                      : ""
                  }
                  readOnly
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md text-gray-700"
                />
              </div>

              {/* Deposit Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Deposit Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  {...register("amount", {
                    required: "Amount is required",
                    min: {
                      value: 0.01,
                      message: "Minimum deposit amount is 0.01",
                    },
                  })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.amount && (
                  <p className="text-sm text-red-600">
                    {errors.amount.message}
                  </p>
                )}
              </div>

              {/* Currency */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Currency
                </label>
                <select
                  {...register("currency", {
                    required: "Currency is required",
                  })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ETB">ETB</option>
                </select>
                {errors.currency && (
                  <p className="text-sm text-red-600">
                    {errors.currency.message}
                  </p>
                )}
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  {...register("date", {
                    required: "Date is required",
                  })}
                  defaultValue={new Date().toISOString().split("T")[0]}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.date && (
                  <p className="text-sm text-red-600">{errors.date.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 cursor-pointer"
                >
                  Process Deposit
                </button>
              </div>
            </form>

            {/* Close (×) Button */}
            <button
              onClick={() => setIsDepositModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer text-2xl"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Edit Account Modal */}
      {isEditModalOpen && editingAccount && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-[2px] bg-black/10"
          onClick={closeEditModal}
        >
          <div
            className="bg-white p-8 rounded-2xl shadow-2xl max-w-2xl w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeEditModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 cursor-pointer"
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Edit Account
            </h2>
            <form
              onSubmit={handleSubmit(async (data) => {
                try {
                  const payload = {
                    accountType: data.editAccountType,
                    currencyCode: data.editCurrencyCode,
                    balance: parseFloat(data.editBalance),
                    status: data.editStatus,
                  };
                  await axios.put(
                    `http://localhost:8000/api/admin/accounts/${editingAccount.accountNumber}`,
                    payload,
                    { headers: { "Content-Type": "application/json" } }
                  );
                  setAccounts((prev) =>
                    prev.map((acc) =>
                      acc.accountNumber === editingAccount.accountNumber
                        ? { ...acc, ...payload }
                        : acc
                    )
                  );
                  closeEditModal();
                  alert("Account updated successfully!");
                } catch (err) {
                  alert("Failed to update account");
                }
              })}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Account Type
                </label>
                <select
                  {...register("editAccountType", { required: true })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="SAVINGS">Savings</option>
                  <option value="CHECKING">Checking</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Balance
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("editBalance", { required: true, min: 0 })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  {...register("editStatus", { required: true })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Currency
                </label>
                <select
                  {...register("editCurrencyCode", { required: true })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ETB">ETB</option>
                </select>
              </div>
              <div className="md:col-span-2 flex justify-end mt-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Portal Dropdown */}
      {dropdownOpenId !== null &&
        (() => {
          const acc = filteredAccounts.find((a) => a.id === dropdownOpenId);
          if (!acc) return null;
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
                  openDetailModal(acc);
                  handleDropdownClose();
                }}
                className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 text-gray-800 gap-2 cursor-pointer"
              >
                <Eye className="w-4 h-4 mr-2" /> View Details
              </button>
              <button
                onClick={() => {
                  openEditModal(acc);
                  handleDropdownClose();
                }}
                className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 text-gray-800 gap-2 cursor-pointer"
              >
                <Edit2 className="w-4 h-4 mr-2" /> Edit Account
              </button>
              <div className="border-t border-gray-200 my-1" />
              <button
                onClick={() => {
                  handleDeleteAccount(acc);
                  handleDropdownClose();
                }}
                className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 text-red-600 gap-2 cursor-pointer"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete Account
              </button>
            </div>,
            document.body
          );
        })()}
    </div>
  );
};

export default Accounts;
