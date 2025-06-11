import { useState, useEffect } from 'react';
import { ArrowRight, AlertCircle } from 'lucide-react';

const Transfer = () => {
  // State for form data
  const [formData, setFormData] = useState({
    fromAccount: '',
    toAccount: '',
    amount: '',
    description: '',
    transferType: 'internal' // internal or external
  });

  // State for accounts list and loading state
  const [accounts, setAccounts] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);

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
      // const response = await fetch('/api/transfers', {
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
        text: 'Transfer completed successfully!'
      });

      // Reset form
      setFormData({
        fromAccount: '',
        toAccount: '',
        amount: '',
        description: '',
        transferType: 'internal'
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to process transfer. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Main container with responsive padding
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Page header */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Transfer Money</h1>
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <svg 
              className="w-6 h-6 text-blue-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" 
              />
            </svg>
          </div>
        </div>

        {/* Success/Error message display */}
        {message.text && (
          <div
            className={`p-4 mb-6 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Transfer Type */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transfer Type
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="transferType"
                  value="internal"
                  checked={formData.transferType === 'internal'}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">Internal Transfer</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="transferType"
                  value="external"
                  checked={formData.transferType === 'external'}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">External Transfer</span>
              </label>
            </div>
          </div>

          {/* From Account */}
          <div>
            <label
              htmlFor="fromAccount"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              From Account
            </label>
            <select
              id="fromAccount"
              name="fromAccount"
              value={formData.fromAccount}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select account</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.type} Account - {account.accountNumber} (Balance: $
                  {account.balance.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          {/* To Account */}
          <div>
            <label
              htmlFor="toAccount"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {formData.transferType === 'internal' ? 'To Account' : 'Recipient Account'}
            </label>
            {formData.transferType === 'internal' ? (
              <select
                id="toAccount"
                name="toAccount"
                value={formData.toAccount}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select account</option>
                {accounts
                  .filter(account => account.id !== parseInt(formData.fromAccount))
                  .map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.type} Account - {account.accountNumber}
                    </option>
                  ))}
              </select>
            ) : (
              <input
                type="text"
                id="toAccount"
                name="toAccount"
                value={formData.toAccount}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter recipient account number"
                required
              />
            )}
          </div>

          {/* Amount */}
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-gray-500">$</span>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
                min="0.01"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter transfer description"
              required
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium
                ${isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:bg-blue-700 transform hover:scale-[1.02]'}
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                transition-all duration-200`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                'Transfer Money'
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Transfer Information</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Internal transfers are processed instantly</li>
            <li>• External transfers may take 1-2 business days</li>
            <li>• No fees for internal transfers</li>
            <li>• External transfer fees may apply</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Transfer;