import { useState, useEffect } from "react";
import { ArrowDown, AlertCircle } from 'lucide-react';

const Withdraw = () => {
  // State for form data
  const [formData, setFormData] = useState({
    account: '',
    amount: '',
    description: ''
  });

  // State for accounts list and loading state
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch accounts data on component mount
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const customerId = "d15c6c1c-8e38-422f-a221-ff02afc98d86"; // Use the same customer ID as Dashboard
        
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
          currency: "USD",
          status: "Active",
          openedDate: new Date().toISOString().split('T')[0],
        }));

        setAccounts(mappedAccounts);
      } catch (error) {
        console.error("Error fetching accounts:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('http://localhost:8000/api/user/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountNumber: formData.account,
          amount: parseFloat(formData.amount),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to process withdrawal');
      }

      setMessage({
        type: 'success',
        text: 'Withdrawal processed successfully!'
      });

      // Reset form
      setFormData({
        account: '',
        amount: '',
        description: ''
      });

      // Refresh accounts list to update balances
      const accountsResponse = await fetch(`http://localhost:8000/api/user/35194d9c-c9c3-4b97-b7c8-f139f7a929e2/accounts`);
      if (accountsResponse.ok) {
        const accountsData = await accountsResponse.json();
        const mappedAccounts = accountsData.data.map(account => ({
          id: account.accountNumber,
          accountNumber: account.accountNumber,
          type: account.accountType,
          balance: account.balance,
          currency: "USD",
          status: "Active",
          openedDate: new Date().toISOString().split('T')[0],
        }));
        setAccounts(mappedAccounts);
      }

    } catch (error) {
      console.error('Error processing withdrawal:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Failed to process withdrawal. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && accounts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error && accounts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Withdraw Funds</h1>

        {message.text && (
          <div className={`mb-4 p-4 rounded-md ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Account Selection */}
          <div>
            <label htmlFor="account" className="block text-sm font-medium text-gray-700">
              Select Account
            </label>
            <select
              id="account"
              name="account"
              value={formData.account}
              onChange={handleChange}
              required
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">Select an account</option>
              {accounts.map(account => (
                <option key={account.id} value={account.accountNumber}>
                  {account.type} Account - {account.accountNumber} (Balance: ${account.balance.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          {/* Amount Input */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                name="amount"
                id="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                min="0.01"
                step="0.01"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Description Input */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description (Optional)
            </label>
            <input
              type="text"
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              placeholder="Enter a description for this withdrawal"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isLoading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              {isLoading ? 'Processing...' : 'Withdraw Funds'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Withdraw; 