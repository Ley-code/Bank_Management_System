import { useState } from 'react';

const Loan = () => {
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

  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);

  const loanTypes = [
    { id: 'personal', name: 'Personal Loan' },
    { id: 'home', name: 'Home Loan' },
    { id: 'car', name: 'Car Loan' },
    { id: 'business', name: 'Business Loan' }
  ];

  const employmentStatuses = [
    { id: 'employed', name: 'Employed' },
    { id: 'self-employed', name: 'Self Employed' },
    { id: 'business-owner', name: 'Business Owner' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // This would be replaced with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Apply for a Loan</h1>
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
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
        </div>

        {message.text && (
          <div
            className={`p-4 mb-6 rounded-lg ${
              message.type === "success" 
                ? "bg-green-50 text-green-700 border border-green-200" 
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Loan Type */}
            <div>
              <label
                htmlFor="loanType"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Loan Type
              </label>
              <select
                id="loanType"
                name="loanType"
                value={formData.loanType}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select loan type</option>
                {loanTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Loan Amount */}
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Loan Amount
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
                  min="1000"
                  required
                />
              </div>
            </div>

            {/* Loan Purpose */}
            <div className="md:col-span-2">
              <label
                htmlFor="purpose"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Purpose of Loan
              </label>
              <textarea
                id="purpose"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                placeholder="Please describe the purpose of your loan"
                required
              />
            </div>

            {/* Loan Duration */}
            <div>
              <label
                htmlFor="duration"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Loan Duration (months)
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="12"
                max="360"
                required
              />
            </div>

            {/* Monthly Income */}
            <div>
              <label
                htmlFor="monthlyIncome"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Monthly Income
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-gray-500">$</span>
                <input
                  type="number"
                  id="monthlyIncome"
                  name="monthlyIncome"
                  value={formData.monthlyIncome}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  min="0"
                  required
                />
              </div>
            </div>

            {/* Employment Status */}
            <div>
              <label
                htmlFor="employmentStatus"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Employment Status
              </label>
              <select
                id="employmentStatus"
                name="employmentStatus"
                value={formData.employmentStatus}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select employment status</option>
                {employmentStatuses.map(status => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Employer Name */}
            <div>
              <label
                htmlFor="employerName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Employer Name
              </label>
              <input
                type="text"
                id="employerName"
                name="employerName"
                value={formData.employerName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter employer name"
                required
              />
            </div>

            {/* Employment Duration */}
            <div>
              <label
                htmlFor="employmentDuration"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Employment Duration (years)
              </label>
              <input
                type="number"
                id="employmentDuration"
                name="employmentDuration"
                value={formData.employmentDuration}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium
              ${isLoading 
                ? 'opacity-75 cursor-not-allowed' 
                : 'hover:bg-blue-700 transform hover:scale-[1.02]'
              } 
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
              'Submit Loan Application'
            )}
          </button>
        </form>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Loan Information</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Minimum loan amount: $1,000</li>
            <li>• Maximum loan duration: 30 years</li>
            <li>• Interest rates vary based on loan type and duration</li>
            <li>• Processing time: 2-3 business days</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Loan;