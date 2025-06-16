import { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle } from 'lucide-react';

const Loan = ({ isOpen, onClose }) => {
  // State for form data
  const [formData, setFormData] = useState({
    loanType: '',
    amount: '',
    purpose: '',
    duration: '',
    monthlyIncome: '',
    employmentStatus: '',
    employerName: '',
    employmentDuration: '',
    accountNumber: '' // Added account selection
  });

  // State for accounts list
  const [accounts, setAccounts] = useState([]);
  
  // State for loan requests and accepted loans
  const [loanRequests, setLoanRequests] = useState([]);
  const [acceptedLoans, setAcceptedLoans] = useState([]);

  // State for form messages and loading state
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);

  // Available loan types
  const loanTypes = [
    'Personal Loan',
    'Home Loan',
    'Car Loan',
    'Business Loan',
    'Education Loan'
  ];

  // Available employment statuses
  const employmentStatuses = [
    'Employed',
    'Self-Employed',
    'Business Owner',
    'Retired',
    'Student'
  ];

  // Fetch accounts and loans data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const customerId = "62a2645c-5367-4734-85dc-c2ac2dbbde2f"; // Use the same customer ID as other components
        
        // Fetch user accounts
        const accountsResponse = await fetch(`http://localhost:8000/api/user/${customerId}/accounts`);
        if (!accountsResponse.ok) {
          throw new Error('Failed to fetch customer accounts');
        }
        const accountsData = await accountsResponse.json();
        console.log("accountsData",accountsData); 
        setAccounts(accountsData.data);

        // Fetch loan requests
        const loanRequestsResponse = await fetch(`http://localhost:8000/api/user/${customerId}/loans`);
        if (loanRequestsResponse.ok) {
          const requestsData = await loanRequestsResponse.json();
          setLoanRequests(requestsData.data);
        }

        // Fetch accepted loans
        const acceptedLoansResponse = await fetch(`http://localhost:8000/api/user/${customerId}/loans`);
        if (acceptedLoansResponse.ok) {
          const acceptedData = await acceptedLoansResponse.json();
          setAcceptedLoans(acceptedData.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessage({
          type: 'error',
          text: 'Failed to load data. Please try again.'
        });
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

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
      const response = await fetch('http://localhost:8000/api/user/loanRequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      console.log("data",data);
      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit loan application');
      }

      setMessage({
        type: 'success',
        text: 'Loan application submitted successfully! We will review your application and get back to you soon.'
      });

      // Reset form
      setFormData({
        loanType: '',
        amount: '',
        purpose: '',
        duration: '',
        monthlyIncome: '',
        employmentStatus: '',
        employerName: '',
        employmentDuration: '',
        accountNumber: ''
      });

      // Refresh loan requests
      const loanRequestsResponse = await fetch(`http://localhost:8000/api/user/${customerId}/loans/pending`);
      if (loanRequestsResponse.ok) {

        const requestsData = await loanRequestsResponse.json();
        console.log("loanRequests",requestsData);
        setLoanRequests(requestsData.data);
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to submit loan application. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle loan payment
  const handleLoanPayment = async (loanId, amount) => {
    try {
      const response = await fetch(`http://localhost:8000/api/user/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentId , accountId })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to process loan payment');
      }

      // Refresh accepted loans
      

      setMessage({
        type: 'success',
        text: 'Loan payment processed successfully!'
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to process loan payment. Please try again.'
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Loan Management</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Message display */}
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

          {/* Loan Application Form */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Apply for a Loan</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Account Selection */}
              <div>
                <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">
                  Select Account
                </label>
                <select
                  id="accountNumber"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  required
                >
                  <option value="">Select an account</option>
                  {accounts.map(account => (
                    <option key={account.accountNumber} value={account.accountNumber}>
                      {account.accountType} - {account.accountNumber} (Balance: ${account.balance})
                    </option>
                  ))}
                </select>
              </div>

              {/* Existing form fields */}
              <div>
                <label htmlFor="loanType" className="block text-sm font-medium text-gray-700">
                  Loan Type
                </label>
                <select
                  id="loanType"
                  name="loanType"
                  value={formData.loanType}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  required
                >
                  <option value="">Select a loan type</option>
                  {loanTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Loan Amount */}
              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700"
                >
                  Loan Amount
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
                    min="1000"
                  />
                </div>
              </div>

              {/* Loan Purpose */}
              <div>
                <label
                  htmlFor="purpose"
                  className="block text-sm font-medium text-gray-700"
                >
                  Purpose of Loan
                </label>
                <textarea
                  id="purpose"
                  name="purpose"
                  rows={3}
                  value={formData.purpose}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>

              {/* Loan Duration */}
              <div>
                <label
                  htmlFor="duration"
                  className="block text-sm font-medium text-gray-700"
                >
                  Loan Duration (months)
                </label>
                <input
                  type="number"
                  name="duration"
                  id="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  required
                  min="1"
                  max="360"
                />
              </div>

              {/* Monthly Income */}
              <div>
                <label
                  htmlFor="monthlyIncome"
                  className="block text-sm font-medium text-gray-700"
                >
                  Monthly Income
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    name="monthlyIncome"
                    id="monthlyIncome"
                    value={formData.monthlyIncome}
                    onChange={handleChange}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                    placeholder="0.00"
                    required
                    min="0"
                  />
                </div>
              </div>

              {/* Employment Status */}
              <div>
                <label
                  htmlFor="employmentStatus"
                  className="block text-sm font-medium text-gray-700"
                >
                  Employment Status
                </label>
                <select
                  id="employmentStatus"
                  name="employmentStatus"
                  value={formData.employmentStatus}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  required
                >
                  <option value="">Select employment status</option>
                  {employmentStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Employer Name */}
              <div>
                <label
                  htmlFor="employerName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Employer Name
                </label>
                <input
                  type="text"
                  name="employerName"
                  id="employerName"
                  value={formData.employerName}
                  onChange={handleChange}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>

              {/* Employment Duration */}
              <div>
                <label
                  htmlFor="employmentDuration"
                  className="block text-sm font-medium text-gray-700"
                >
                  Employment Duration (years)
                </label>
                <input
                  type="number"
                  name="employmentDuration"
                  id="employmentDuration"
                  value={formData.employmentDuration}
                  onChange={handleChange}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  required
                  min="0"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>

          {/* Pending Loan Requests Table */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Loan Requests</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loan Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loanRequests.map((loan) => (
                    <tr key={loan.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{loan.loanType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${loan.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{loan.purpose}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{loan.accountNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      </td>
                    </tr>
                  ))}
                  {loanRequests.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                        No pending loan requests
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Accepted Loans Table */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Loans</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loan Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {acceptedLoans.map((loan) => (
                    <tr key={loan.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{loan.loanType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${loan.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(loan.startDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(loan.endDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{loan.interestRate}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{loan.accountNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {loan.paymentDue && (
                          <button
                            onClick={() => handleLoanPayment(loan.id, loan.monthlyPayment)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            Pay ${loan.monthlyPayment}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {acceptedLoans.length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                        No active loans
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loan;