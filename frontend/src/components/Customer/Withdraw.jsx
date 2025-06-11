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
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch accounts data on component mount
  useEffect(() => {
    // TODO: Replace with actual API call
    // const fetchAccounts = async () => {
    //   const response = await fetch('/api/accounts');
    //   const data = await response.json();
    //   setAccounts(data);
    // };
    // fetchAccounts();

    // Mock data for development
    setAccounts([
      { id: '1', accountNumber: '1234567890', type: 'Savings', balance: 5000 },
      { id: '2', accountNumber: '0987654321', type: 'Checking', balance: 3000 }
    ]);
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
      // TODO: Replace with actual API call
      // const response = await fetch('/api/withdrawals', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData)
      // });

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Show success message
      setMessage({
        type: 'success',
        text: 'Withdrawal completed successfully!'
      });

      // Reset form
      setFormData({
        account: '',
        amount: '',
        description: ''
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to process withdrawal. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Main container with responsive padding
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Withdraw Money</h1>
        <p className="mt-1 text-sm text-gray-500">
          Withdraw money from your account
        </p>
      </div>

      {/* Withdrawal form */}
      <div className="bg-white rounded-lg shadow p-6">
        {/* Success/Error message display */}
        {message.text && (
          <div
            className={`p-4 mb-6 rounded-md ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Account Selection */}
          <div>
            <label
              htmlFor="account"
              className="block text-sm font-medium text-gray-700"
            >
              Select Account
            </label>
            <select
              id="account"
              name="account"
              value={formData.account}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              required
            >
              <option value="">Select account</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.type} - {account.accountNumber} (${account.balance})
                </option>
              ))}
            </select>
          </div>

          {/* Withdrawal Amount */}
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700"
            >
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
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                placeholder="0.00"
                required
                min="1"
              />
            </div>
          </div>

          {/* Withdrawal Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter withdrawal description"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Processing...' : 'Withdraw Money'}
            </button>
          </div>
        </form>

        {/* Important Information Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Important Information</h3>
          <ul className="mt-4 space-y-2 text-sm text-gray-500">
            <li>• Minimum withdrawal amount: $1</li>
            <li>• Maximum daily withdrawal limit: $5,000</li>
            <li>• ATM withdrawals are free at our network ATMs</li>
            <li>• Non-network ATM withdrawals may incur fees</li>
            <li>• Withdrawals are processed immediately</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Withdraw; 