// src/components/Admin/Transactions.jsx

import axios from "axios";
import { X } from "lucide-react";
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
  const [loading, setLoading] = useState(false);
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
      <div className="overflow-x-hidden">
        <table className="w-full table-auto bg-gray-50 rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                ID
              </th>
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
                    <td className="px-4 py-3 text-sm text-gray-700">{tx.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {tx.date}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      ${tx.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {/* {currency ? currency.code : "—"} */}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {tx.type}
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
                      {/* View Details Button */}
                      <button
                        onClick={() => openDetailModal(tx)}
                        className="bg-indigo-500 text-white px-3 py-1 rounded-md hover:bg-indigo-600 text-sm"
                      >
                        View
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
          className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50"
          onClick={closeDetailModal}
        >
          <div
            className="bg-white p-6 rounded-xl shadow-xl max-w-lg w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Transaction Details
            </h2>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>ID:</strong> {selectedTransaction.id}
              </p>
              <p>
                <strong>Date:</strong> {selectedTransaction.date}
              </p>
              <p>
                <strong>Amount:</strong> $
                {selectedTransaction.amount.toLocaleString()}{" "}
                {/* {dummyCurrencies.find(
                  (c) => c.id === selectedTransaction.currency_id
                )?.code || ""} */}
              </p>
              <p>
                <strong>Type:</strong> {selectedTransaction.type}
              </p>
              <p>
                <strong>Account #:</strong> {selectedTransaction.accountNumber}
              </p>
              <p>
                <strong>Customer Name:</strong>{" "}
                {selectedTransaction.customerName}
              </p>
              <p>
                <strong>Branch Name:</strong> {selectedTransaction.branchName}
              </p>
              <p>
                <strong>Description:</strong> {selectedTransaction.description}
              </p>
            </div>

            {/* Close (×) Button */}
            <button
              onClick={closeDetailModal}
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

export default Transactions;
