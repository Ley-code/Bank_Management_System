import { dashboardData, recentTransactions } from '../../data/dummyData';

// AdminDashboard component to show bank stats and transactions
const AdminDashboard = () => {
  return (
    // Main container with white background and subtle shadow
    <div className="bg-white p-6 rounded-xl shadow-md">
      {/* // Page title with bold, modern typography */}
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Bank Overview</h2>
      {/* // Grid for statistic cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* // Total Accounts card with subtle gradient border */}
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-gray-700">Total Accounts</h3>
          <p className="text-3xl font-bold text-blue-800">{dashboardData.totalAccounts}</p>
        </div>
        {/* // Total Customers card with subtle gradient border */}
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-gray-700">Total Customers</h3>
          <p className="text-3xl font-bold text-blue-800">{dashboardData.totalCustomers}</p>
        </div>
        {/* // Total Transactions card with subtle gradient border */}
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-gray-700">Total Transactions</h3>
          <p className="text-3xl font-bold text-blue-800">{dashboardData.totalTransactions}</p>
        </div>
      </div>
      {/* // Recent Transactions section */}
      <div>
        {/* // Section title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Transactions</h3>
        {/* // Table for transaction data */}
        <table className="min-w-full bg-white rounded-lg shadow-sm">
          {/* // Table header with light gray background */}
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">ID</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Date</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Type</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Amount</th>
            </tr>
          </thead>
          {/* // Table body with transaction rows */}
          <tbody>
            {recentTransactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-100">
                <td className="py-3 px-4 text-sm text-gray-700">{transaction.id}</td>
                <td className="py-3 px-4 text-sm text-gray-700">{transaction.date}</td>
                <td className="py-3 px-4 text-sm text-gray-700">{transaction.type}</td>
                <td className="py-3 px-4 text-sm text-gray-700">{transaction.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;