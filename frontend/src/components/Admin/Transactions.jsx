// src/components/Admin/Transactions.jsx

import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";

/**
 * Transactions component (Admin view)
 *
 * Features:
 *  - Paginated table (6 rows per page) of transactions with columns:
 *      • Transaction ID
 *      • Date
 *      • Amount
 *      • Currency (resolved via currency_id)
 *      • Type (Deposit / Withdrawal)
 *      • Account Number
 *      • Customer Name
 *      • Branch Name
 *      • Actions (View details button)
 *  - Search by ID or Amount
 *  - Filter by Date Range (From/To), Type, and Currency
 *  - Pagination moves overflow rows to next page (max 6 rows per page)
 *  - Transaction Detail Modal showing all fields
 *
 * NOTE: Dummy data is used now. When backend is available, replace fetch calls:
 *   - To fetch paginated/filtered transactions:
 *       GET /api/admin/transactions?page={currentPage}&pageSize=6
 *         &search={searchTerm}&type={filterType}
 *         &currency={filterCurrency}&start={startDate}&end={endDate}
 *   - To fetch single transaction detail:
 *       GET /api/admin/transactions/{id}
 */

const Transactions = () => {
  // ---- State: transactions & UI controls ----
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ---- State: Filters & Search ----
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All"); // Deposit / Withdrawal
  const [filterCurrency, setFilterCurrency] = useState("All"); // currency_id as string
  const [startDate, setStartDate] = useState(""); // YYYY-MM-DD
  const [endDate, setEndDate] = useState(""); // YYYY-MM-DD

  // ---- State: Pagination (6 rows per page) ----
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // ---- State: Detail Modal ----
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // ---- Fetch data (dummy now, replace with API later) ----
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:8000/api/admin/transactions"
        );
        console.log("Transactions API response:", response.data); // Debug log
        if (response.data.status === "success") {
          setTransactions(response.data.data || []);
        } else {
          setError("Failed to fetch transactions");
        }
      } catch (err) {
        setError("Failed to fetch transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();

    // Listen for admin-data-updated event to refresh transactions
    const handleAdminDataUpdated = () => {
      fetchTransactions();
    };
    window.addEventListener("admin-data-updated", handleAdminDataUpdated);
    return () => {
      window.removeEventListener("admin-data-updated", handleAdminDataUpdated);
    };
  }, [currentPage, searchTerm, filterType, filterCurrency, startDate, endDate]);

  // ---- Filtered & Searched Transactions ----
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Match search term against ID or amount
      const matchSearch =
        tx.id.toString().includes(searchTerm.toLowerCase()) ||
        tx.amount.toString().includes(searchTerm.toLowerCase());

      // Match transaction type filter
      const matchType = filterType === "All" || tx.type === filterType;

      // Match currency filter
      const matchCurrency =
        filterCurrency === "All" ||
        tx.currency_id.toString() === filterCurrency;

      // Match start and end date filters
      const matchStart = !startDate || new Date(tx.date) >= new Date(startDate);
      const matchEnd = !endDate || new Date(tx.date) <= new Date(endDate);

      return (
        matchSearch && matchType && matchCurrency && matchStart && matchEnd
      );
    });
  }, [
    transactions,
    searchTerm,
    filterType,
    filterCurrency,
    startDate,
    endDate,
  ]);

  // ---- Paginated Results ----
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  // ---- Handler: Open Detail Modal ----
  const openDetailModal = (tx) => {
    setSelectedTransaction(tx);
    setIsDetailOpen(true);

    // TODO: Instead of using dummy data, fetch detail from API:
    // fetch(`/api/admin/transactions/${tx.id}`)
    //   .then((res) => res.json())
    //   .then((data) => setSelectedTransaction(data));
  };

  // ---- Handler: Close Detail Modal ----
  const closeDetailModal = () => {
    setIsDetailOpen(false);
    setSelectedTransaction(null);
  };

  // ---- Render loading or error states ----
  if (loading) {
    return (
      <div className="text-center p-6">
        <span className="text-gray-500">Loading transactions...</span>
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
      {/* ===== Header ===== */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Transactions</h2>

      {/* ===== Filters & Search ===== */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
        {/* Search by ID or Amount */}
        <input
          type="text"
          placeholder="Search by ID or Amount"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page on filter change
          }}
          className="w-full md:w-1/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />

        {/* Filter by Type */}
        <select
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full md:w-1/5 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="All">All Types</option>
          <option value="Deposit">Deposit</option>
          <option value="Withdrawal">Withdrawal</option>
        </select>

        {/* Filter by Currency */}
        <select
          value={filterCurrency}
          onChange={(e) => {
            setFilterCurrency(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full md:w-1/5 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="All">All Currencies</option>
          {/* {dummyCurrencies.map((cur) => (
            <option key={cur.id} value={cur.id}>
              {cur.code}
            </option>
          ))} */}
        </select>

        {/* Filter by Start Date */}
        <div>
          <label className="block text-sm text-gray-700">From:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setCurrentPage(1);
            }}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Filter by End Date */}
        <div>
          <label className="block text-sm text-gray-700">To:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setCurrentPage(1);
            }}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* ===== Transactions Table ===== */}
      <div className="overflow-x-auto w-full">
        <table className="w-full min-w-[1100px] table-auto bg-white rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Date
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Currency
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Type
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Account #
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Customer Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Branch Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((tx) => {
                // Resolve currency code from currency_id
                // const currency = dummyCurrencies.find(
                //   (c) => c.id === tx.currency_id
                // );
                return (
                  <tr
                    key={tx.id}
                    className="even:bg-white odd:bg-gray-50 hover:bg-gray-100"
                  >
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {/* Only show date part (YYYY-MM-DD) */}
                      {(tx.transactionDate || tx.date || "-").split("T")[0]}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      ${tx.amount?.toLocaleString?.() ?? tx.amount ?? "0"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {/* Show currency code or default to $ */}
                      {tx.currencyCode || tx.currency || "$"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {(() => {
                        const type = (tx.type || "").toLowerCase();
                        if (type === "deposit") {
                          return (
                            <span className="flex items-center gap-2">
                              <svg
                                width="20"
                                height="20"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="text-green-600"
                              >
                                <path
                                  d="M7 17L17 7"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M7 17H15"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M7 17V9"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <span className="text-green-600 font-medium">
                                Deposit
                              </span>
                            </span>
                          );
                        }
                        if (type === "withdrawal") {
                          return (
                            <span className="flex items-center gap-2">
                              <svg
                                width="20"
                                height="20"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="text-red-600"
                              >
                                <path
                                  d="M17 7L7 17"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M17 7V15"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M17 7H9"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <span className="text-red-600 font-medium">
                                Withdrawal
                              </span>
                            </span>
                          );
                        }
                        if (type === "transfer") {
                          return (
                            <span className="flex items-center gap-2">
                              <svg
                                width="20"
                                height="20"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="text-blue-600"
                              >
                                <path
                                  d="M12 4V2M12 2L8 6M12 2l4 4"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M20 12a8 8 0 1 1-8-8"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <span className="text-blue-600 font-medium">
                                Transfer
                              </span>
                            </span>
                          );
                        }
                        return <span className="text-gray-600">{tx.type}</span>;
                      })()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {tx.accountNumber}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {tx.customerName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {tx.branchName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {/* View Details Icon Button */}
                      <button
                        onClick={() => openDetailModal(tx)}
                        className="bg-gray-100 hover:bg-indigo-100 text-indigo-600 rounded-full p-2 shadow-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        title="View Details"
                      >
                        <svg
                          width="22"
                          height="22"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <circle
                            cx="12"
                            cy="12"
                            r="3.5"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-6 text-center text-gray-500 italic"
                >
                  No transactions found.
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

      {/* ===== Transaction Detail Modal ===== */}
      {isDetailOpen && selectedTransaction && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-[2px]"
          onClick={closeDetailModal}
        >
          <div
            className="bg-white p-8 rounded-2xl shadow-2xl max-w-lg w-full relative animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeDetailModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 cursor-pointer text-2xl"
              aria-label="Close"
            >
              &times;
            </button>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-3xl font-bold text-indigo-600">
                <svg width="36" height="36" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="3.5"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Transaction #{selectedTransaction.id}
                  </h2>
                  {/* Type badge */}
                  {(() => {
                    const type = (selectedTransaction.type || "").toLowerCase();
                    if (type === "deposit")
                      return (
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                          Deposit
                        </span>
                      );
                    if (type === "withdrawal")
                      return (
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                          Withdrawal
                        </span>
                      );
                    if (type === "transfer")
                      return (
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                          Transfer
                        </span>
                      );
                    return (
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-700">
                        {selectedTransaction.type}
                      </span>
                    );
                  })()}
                </div>
                <div className="text-gray-500 text-sm mt-1">
                  {selectedTransaction.customerName}
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
                <span className="font-medium">Account #:</span>
                <span>{selectedTransaction.accountNumber}</span>
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
                <span className="font-medium">Amount:</span>
                <span>
                  $
                  {selectedTransaction.amount?.toLocaleString?.() ??
                    selectedTransaction.amount ??
                    "0"}{" "}
                  {selectedTransaction.currencyCode ||
                    selectedTransaction.currency ||
                    "$"}
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
                <span className="font-medium">Date:</span>
                <span>
                  {
                    (
                      selectedTransaction.transactionDate ||
                      selectedTransaction.date ||
                      "-"
                    ).split("T")[0]
                  }
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
                <span className="font-medium">Branch:</span>
                <span>{selectedTransaction.branchName}</span>
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
                <span className="font-medium">Customer:</span>
                <span>{selectedTransaction.customerName}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 col-span-1 sm:col-span-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M4 4h16v16H4z" />
                </svg>
                <span className="font-medium">Description:</span>
                <span>
                  {selectedTransaction.description || (
                    <span className="italic text-gray-400">No description</span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
