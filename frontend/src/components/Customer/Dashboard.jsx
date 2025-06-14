import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Dashboard = () => {
  // State for managing the current slide in the account carousel
  const [currentSlide, setCurrentSlide] = useState(0);
  // State for customer data
  const [customerData, setCustomerData] = useState({
    fullName: '',
    email: '',
    accounts: []
  });
  // State for loading and error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        // Use the actual user ID from your working API
        // const customerId = "35194d9c-c9c3-4b97-b7c8-f139f7a929e2";
        const customerId = "d799ac61-ce27-41c3-8783-4da193564046"
  
        // Fetch user details
        const detailsResponse = await fetch(`http://localhost:8000/api/user/${customerId}/details`);
        if (!detailsResponse.ok) {
          throw new Error('Failed to fetch customer details');
        }
        const detailsData = await detailsResponse.json();
  
        // Fetch user accounts
        const accountsResponse = await fetch(`http://localhost:8000/api/user/${customerId}/accounts`);
        if (!accountsResponse.ok) {
          throw new Error('Failed to fetch customer accounts');
        }
        const accountsData = await accountsResponse.json();
  
        // Map accounts data to desired structure
        const mappedAccounts = accountsData.data.map(account => ({
          id: account.accountNumber,
          accountNumber: account.accountNumber,
          type: account.accountType,
          balance: account.balance,
          currency: "USD", // or get from account if available
          status: "Active", // or get from account if available
          openedDate: new Date().toISOString().split('T')[0], // or get real date if available
        }));
  
        setCustomerData({
          fullName: detailsData.data.fullName,
          email: detailsData.data.email,
          accounts: mappedAccounts,
        });
  
      } catch (error) {
        console.error("Error fetching customer data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCustomerData();
  }, []);
  

  // Calculate total balance across all accounts
  const totalBalance = customerData.accounts.reduce((sum, account) => sum + account.balance, 0);

  // Navigation functions for the account carousel
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % customerData.accounts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + customerData.accounts.length) % customerData.accounts.length);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Welcome section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {customerData.fullName}!
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here's an overview of your accounts and recent activity
        </p>
      </div>

      {/* Total balance card */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Total Balance</h2>
        <p className="text-3xl font-bold text-gray-900">
          ${totalBalance.toLocaleString()}
        </p>
      </div>

      {/* Account cards carousel */}
      <div className="relative">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {customerData.accounts.map((account) => (
              <div
                key={account.id}
                className="w-full flex-shrink-0 bg-white rounded-lg shadow p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {account.type} Account
                    </h3>
                    <p className="text-sm text-gray-500">{account.accountNumber}</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    {account.status}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  ${account.balance.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Opened on {new Date(account.openedDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50"
        >
          <ChevronRight className="w-6 h-6 text-gray-600" />
        </button>

        {/* Slide indicators */}
        <div className="flex justify-center mt-4 space-x-2">
          {customerData.accounts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full ${
                currentSlide === index ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;