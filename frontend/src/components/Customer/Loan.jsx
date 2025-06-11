import { useState } from 'react';

const Loan = () => {
  // State for form data
  const [formData, setFormData] = useState({
    loanType: '',
    amount: '',
    purpose: '',
    duration: '',
    monthlyIncome: '',
    employmentStatus: '',
    employerName: '',
    employmentDuration: ''
  });

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
      // const response = await fetch('/api/loans/apply', {
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
        employmentDuration: ''
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to submit loan application. Please try again.'
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
        <h1 className="text-2xl font-bold text-gray-900">Apply for a Loan</h1>
        <p className="mt-1 text-sm text-gray-500">
          Fill out the form below to apply for a loan
        </p>
      </div>

      {/* Loan application form */}
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
          {/* Loan Type Selection */}
          <div>
            <label
              htmlFor="loanType"
              className="block text-sm font-medium text-gray-700"
            >
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

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>

        {/* Important Information Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Important Information</h3>
          <ul className="mt-4 space-y-2 text-sm text-gray-500">
            <li>• Minimum loan amount: $1,000</li>
            <li>• Maximum loan duration: 30 years</li>
            <li>• Processing time: 2-3 business days</li>
            <li>• Interest rates vary based on loan type and duration</li>
            <li>• Additional documents may be required</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Loan;