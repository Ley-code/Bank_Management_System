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

  // ---- Selected Account for Detail/Edit ----
  const [selectedAccount, setSelectedAccount] = useState(null);

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

  // Fetch all accounts for autocomplete when modal opens
  useEffect(() => {
    if (isAddModalOpen) {
      fetch("http://localhost:8000/api/admin/accounts", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.data) setAllAccounts(data.data);
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
      fetch("http://localhost:8000/api/admin/customers", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.data) setCustomerOptions(data.data);
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
    const fetchAccounts = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/admin/accounts",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch accounts");
        }

        const data = await response.json();
        console.log("API Response:", data);

        if (data && data.data) {
          // Transform the API response to match our frontend data structure
          const transformedAccounts = data.data.map((account) => ({
            id: account.accountNumber, // Using accountNumber as id
            accountNumber: account.accountNumber,
            userName: account.accountHolder,
            accountType: account.accountType,
            branch: account.branchName,
            balance: account.accountBalance,
            dateOpened: account.dateOpened
              ? new Date(account.dateOpened).toISOString().split("T")[0]
              : "N/A",
            status: "Active", // Default status since it's not in the API response
          }));
          setAccounts(transformedAccounts);
        } else {
          setAccounts([]);
          console.log("No accounts found in the database");
        }
      } catch (error) {
        console.error("Error fetching accounts:", error);
        setAccounts([]);
      }
    };

    // Fetch branches from API
    const fetchBranches = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/admin/branch", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch branches");
        }

        const data = await response.json();
        if (data && data.data) {
          setBranches(data.data);
        } else {
          setBranches([]);
        }
      } catch (error) {
        console.error("Error fetching branches:", error);
        setBranches([]);
      }
    };

    fetchAccounts();
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
        initialBalance: parseFloat(data.initialBalance),
        branchName: data.branchName,
      };

      const response = await fetch("http://localhost:8000/api/admin/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to create account");
      }

      // Refresh accounts list
      const accountsResponse = await fetch(
        "http://localhost:8000/api/admin/accounts"
      );
      const accountsData = await accountsResponse.json();
      if (accountsData && accountsData.data) {
        const transformedAccounts = accountsData.data.map((account) => ({
          id: account.accountNumber,
          accountNumber: account.accountNumber,
          userName: account.accountHolder,
          accountType: account.accountType,
          branch: account.branchName,
          balance: account.accountBalance,
          dateOpened: account.dateOpened
            ? new Date(account.dateOpened).toISOString().split("T")[0]
            : "N/A",
          status: "Active",
        }));
        setAccounts(transformedAccounts);
      }

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
   * Updates account balance and creates transaction record.
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

      // Create transaction record
      const transaction = {
        id: Date.now(), // Temporary ID generation
        date: data.date,
        amount: parseFloat(data.amount),
        currency_id: 1, // ETB
        type: "Deposit",
        accountNumber: data.accountNumber,
        customerName: accountToUpdate.userName,
        branchName: accountToUpdate.branch,
        description: "Manual Deposit",
      };

      // Update account balance
      const updatedAccount = {
        ...accountToUpdate,
        balance: accountToUpdate.balance + parseFloat(data.amount),
      };

      // Update state
      setAccounts((prev) =>
        prev.map((acc) =>
          acc.accountNumber === updatedAccount.accountNumber
            ? updatedAccount
            : acc
        )
      );

      // TODO: API calls
      // 1. Create transaction record
      // await fetch("/api/admin/transactions", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(transaction),
      // });

      // 2. Update account balance
      // await fetch(`/api/admin/accounts/${updatedAccount.id}/balance`, {
      //   method: "PATCH",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ balance: updatedAccount.balance }),
      // });

      // Reset form and close modal
      reset();
      setIsDepositModalOpen(false);

      // Show success message
      alert("Deposit processed successfully!");
    } catch (error) {
      console.error("Error processing deposit:", error);
      alert("Failed to process deposit. Please try again.");
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
        <div className="flex gap-4">
          <button
            onClick={() => setIsDepositModalOpen(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Deposit Funds
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
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
          className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm"
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
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
                  disabled={!selectedCustomer}
                >
                  Create Account
                </button>
              </div>
            </form>
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
          className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm"
          onClick={() => setIsDetailModalOpen(false)}
        >
          <div
            className="bg-white p-8 rounded-xl shadow-xl max-w-lg w-full relative transition-transform duration-300 scale-100"
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
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.branchName}>
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

      {/* ======== Deposit Funds Modal ======== */}
      {isDepositModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm"
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
                    .filter((acc) => acc.status === "Active")
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
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  Process Deposit
                </button>
              </div>
            </form>

            {/* Close (×) Button */}
            <button
              onClick={() => setIsDepositModalOpen(false)}
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
