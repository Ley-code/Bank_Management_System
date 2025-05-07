const AdminDashboard = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Bank Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Empty State Cards */}
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-40 bg-gray-100 rounded-lg p-4 animate-pulse"
          >
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
