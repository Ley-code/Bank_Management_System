import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Dashboard = () => {
  // State for managing the current slide in the account carousel
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // State for customer data (would be fetched from API in production)
  const [customerData, setCustomerData] = useState({
    name: "John Doe", // This would come from your auth context/API
    accounts: [
      { id: 1, type: "Savings", accountNumber: "SAV-001", balance: 15000 },
      { id: 2, type: "Checking", accountNumber: "CHK-001", balance: 8500 },
      { id: 3, type: "Investment", accountNumber: "INV-001", balance: 25000 }
    ]
  });

  // Calculate total balance across all accounts
  const totalBalance = customerData.accounts.reduce((sum, account) => sum + account.balance, 0);

  // Navigation functions for account carousel
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % customerData.accounts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + customerData.accounts.length) % customerData.accounts.length);
  };

  return (
    // Main container with responsive padding
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, {customerData.name}!
        </h1>
        <p className="text-gray-600 mt-2">Here's an overview of your accounts</p>
      </div>

      {/* Total Balance Card with gradient background */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 mb-8 text-white shadow-lg">
        <h2 className="text-lg font-medium mb-2">Total Balance</h2>
        <p className="text-4xl font-bold">${totalBalance.toLocaleString()}</p>
      </div>

      {/* Account Cards Carousel */}
      <div className="relative">
        {/* Carousel container with overflow handling */}
        <div className="overflow-hidden rounded-2xl">
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {/* Map through accounts to create account cards */}
            {customerData.accounts.map((account) => (
              <div 
                key={account.id}
                className="w-full flex-shrink-0 p-4"
              >
                {/* Individual Account Card */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  {/* Account header with type and status */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{account.type} Account</h3>
                      <p className="text-sm text-gray-600">{account.accountNumber}</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      Active
                    </span>
                  </div>
                  {/* Account balance section */}
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">Available Balance</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${account.balance.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 focus:outline-none"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 focus:outline-none"
        >
          <ChevronRight className="w-6 h-6 text-gray-600" />
        </button>

        {/* Carousel Slide Indicators */}
        <div className="flex justify-center mt-4 space-x-2">
          {customerData.accounts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
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