// src/components/Admin/Customers.jsx
// Simple customer list table matching admin dashboard UI with 10 customers

import React, { useState, useEffect } from 'react';

const Customers = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const dummyCustomers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '098-765-4321' },
      { id: 3, name: 'Alice Johnson', email: 'alice@example.com', phone: '555-555-5555' },
      { id: 4, name: 'Bob Brown', email: 'bob@example.com', phone: '444-444-4444' },
      { id: 5, name: 'Emma Davis', email: 'emma@example.com', phone: '333-333-3333' },
      { id: 6, name: 'Michael Lee', email: 'michael@example.com', phone: '222-222-2222' },
      { id: 7, name: 'Sarah Wilson', email: 'sarah@example.com', phone: '111-111-1111' },
      { id: 8, name: 'David Taylor', email: 'david@example.com', phone: '999-999-9999' },
      { id: 9, name: 'Lisa Anderson', email: 'lisa@example.com', phone: '888-888-8888' },
      { id: 10, name: 'Haile G',email: 'tom@example.com', phone: '777-777-7777' }
    ];
    setCustomers(dummyCustomers);
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Customers</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="border-b p-4 text-left text-sm font-semibold text-gray-700">ID</th>
              <th className="border-b p-4 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="border-b p-4 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="border-b p-4 text-left text-sm font-semibold text-gray-700">Phone</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="even:bg-gray-50 odd:bg-white">
                <td className="border-b p-4 text-sm text-gray-700">{customer.id}</td>
                <td className="border-b p-4 text-sm text-gray-700">{customer.name}</td>
                <td className="border-b p-4 text-sm text-gray-700">{customer.email}</td>
                <td className="border-b p-4 text-sm text-gray-700">{customer.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;