import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Loan.css';

const PAGE_SIZE = 5;

const Loan = () => {
  const [requestedLoans, setRequestedLoans] = useState([]);
  const [acceptedLoans, setAcceptedLoans] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [availablePayments, setAvailablePayments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [formData, setFormData] = useState({
    accountNumber: '',
    amount: '',
    loanType: '',
    purpose: '',
    loanDuration: '',
    monthlyIncome: '',
    employmentStatus: ''
  });
  const customerId = "d15c6c1c-8e38-422f-a221-ff02afc98d86";

  // Fetch data
  const fetchData = async () => {
    try {
      const [loansRes, accountsRes] = await Promise.all([
        axios.get('http://localhost:8000/api/admin/loans'),
        axios.get(`http://localhost:8000/api/user/${customerId}/accounts`),
      ]);
      
      console.log("loansRes",loansRes);
      console.log("accountsRes",accountsRes);

      // Map active loans data
      const mappedActiveLoans = Array.isArray(loansRes.data.data) ? loansRes.data.data.map(loan => ({
        id: loan.loanId,
        accountNumber: loan.accountNumber,
        customerName: loan.customerName,
        amount: loan.amountApproved,
        loanType: loan.loanType,
        monthlyPayment: loan.monthlyPayment,
        totalPayable: loan.totalPayable,
        dueDate: loan.dueDate,
        issuedAt: loan.issuedAt,
        status: loan.status
      })) : [];

      console.log("Mapped active loans:", mappedActiveLoans);
      setAcceptedLoans(mappedActiveLoans);
      setAccounts(Array.isArray(accountsRes.data.data) ? accountsRes.data.data : []);

      // Fetch loan requests for each account
      const loanRequestsPromises = accountsRes.data.data.map(account => 
        axios.get(`http://localhost:8000/api/user/${customerId}/loanRequests/${account.accountNumber}`)
      );

      const loanRequestsResponses = await Promise.all(loanRequestsPromises);
      console.log("Raw loan requests responses:", loanRequestsResponses);
      
      // Manually map the loan requests data with only required fields
      const allLoanRequests = loanRequestsResponses.flatMap(response => {
        console.log("Processing response:", response.data);
        if (!Array.isArray(response.data.data)) {
          console.log("Not an array:", response.data);
          return [];
        }
        
        return response.data.data.map(loan => {
          console.log("Processing loan:", loan);
          return {
            accountNumber: loan.accountNumber || '',
            branch: loan.branch || 'Main Branch', // Default value if not provided
            purpose: loan.purpose || '',
            requestedAmount: loan.amount || loan.requestedAmount || '0.00',
            requestedAt: loan.requestedAt || loan.createdAt || new Date().toISOString(),
            status: loan.status || 'PENDING'
          };
        });
      });
      
      console.log("Mapped loan requests:", allLoanRequests);
      setRequestedLoans(allLoanRequests);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to fetch data');
      setAcceptedLoans([]);
      setAccounts([]);
      setRequestedLoans([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLoanApplication = async (e) => {
    e.preventDefault();
    try {
      // Convert numeric fields to numbers
      const requestData = {
        ...formData,
        amount: Number(formData.amount),
        loanDuration: Number(formData.loanDuration),
        monthlyIncome: Number(formData.monthlyIncome)
      };
      
      await axios.post('http://localhost:8000/api/user/loanRequest', requestData);
      alert('Loan request submitted successfully');
      setIsModalVisible(false);
      setFormData({
        accountNumber: '',
        amount: '',
        loanType: '',
        purpose: '',
        loanDuration: '',
        monthlyIncome: '',
        employmentStatus: ''
      });
      fetchData();
    } catch (error) {
      console.error('Error submitting loan request:', error);
      alert('Failed to submit loan request');
    }
  };

  const handleViewPayments = async (loan) => {
    try {
      setSelectedLoan(loan);
      setSelectedPayment(null);
      setSelectedAccountId('');
      setCurrentPage(1);
      const response = await axios.get(`http://localhost:8000/api/user/payments/${loan.id}`);
      setAvailablePayments(response.data.data || []);
      setIsPaymentModalVisible(true);
    } catch (error) {
      console.error('Error fetching payments:', error);
      alert('Failed to fetch available payments');
    }
  };

  const handleConfirmPayment = async () => {
    if (!selectedPayment || !selectedAccountId) return;
    try {
      await axios.post('http://localhost:8000/api/user/payment', {
        paymentId: selectedPayment.id,
        accountNumber: selectedAccountId
      });
      alert('Payment confirmed successfully');
      setIsPaymentModalVisible(false);
      setSelectedPayment(null);
      setSelectedAccountId('');
      fetchData();
    } catch (error) {
      console.error('Error confirming payment:', error);
      alert('Failed to confirm payment');
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(availablePayments.length / PAGE_SIZE);
  const paginatedPayments = availablePayments.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="loan-container">
      <div className="loan-header">
        <h2>Loan Management</h2>
        <button 
          className="apply-button"
          onClick={() => setIsModalVisible(true)}
        >
          Apply for Loan
        </button>
      </div>

      <div className="loans-section">
        <div className="loans-card">
          <h3>Requested Loans</h3>
          <table className="loans-table">
            <thead>
              <tr>
                <th>Account Number</th>
                <th>Branch</th>
                <th>Purpose</th>
                <th>Amount</th>
                <th>Request Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(requestedLoans) && requestedLoans.map((loan, index) => (
                <tr key={index}>
                  <td>{loan.accountNumber}</td>
                  <td>{loan.branch}</td>
                  <td>{loan.purpose}</td>
                  <td>${loan.requestedAmount}</td>
                  <td>{loan.requestedAt ? new Date(loan.requestedAt).toLocaleDateString() : 'N/A'}</td>
                  <td>{loan.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="loans-card">
          <h3>Active Loans</h3>
          <table className="loans-table">
            <thead>
              <tr>
                <th>Account Number</th>
                <th>Customer Name</th>
                <th>Loan Type</th>
                <th>Amount</th>
                <th>Monthly Payment</th>
                <th>Total Payable</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(acceptedLoans) && acceptedLoans.map(loan => (
                <tr key={loan.id}>
                  <td>{loan.accountNumber}</td>
                  <td>{loan.customerName}</td>
                  <td>{loan.loanType}</td>
                  <td>${Number(loan.amount).toFixed(2)}</td>
                  <td>${Number(loan.monthlyPayment).toFixed(2)}</td>
                  <td>${Number(loan.totalPayable).toFixed(2)}</td>
                  <td>{loan.dueDate ? new Date(loan.dueDate).toLocaleDateString() : 'N/A'}</td>
                  <td>{loan.status}</td>
                  <td>
                    <button 
                      className="view-payments-button"
                      onClick={() => handleViewPayments(loan)}
                    >
                      View Payments
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      {isPaymentModalVisible && selectedLoan && (
        <div className="modal-overlay">
          <div className="modal-content payment-modal-content">
            <div className="modal-header">
              <h3>Payments for Loan <span className="mono">{selectedLoan.id}</span></h3>
              <button className="close-button" onClick={() => {
                setIsPaymentModalVisible(false);
                setSelectedLoan(null);
                setAvailablePayments([]);
                setSelectedPayment(null);
                setSelectedAccountId('');
              }}>×</button>
            </div>
            {!selectedPayment ? (
              <>
                <table className="payments-table">
                  <thead>
                    <tr>
                      <th>Payment ID</th>
                      <th>Amount</th>
                      <th>Due Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedPayments.map(payment => (
                      <tr key={payment.id}>
                        <td className="mono">{payment.id}</td>
                        <td>${Number(payment.amount).toFixed(2)}</td>
                        <td>{new Date(payment.dueDate).toLocaleDateString()}</td>
                        <td>{payment.status}</td>
                        <td>
                          <button className="details-button" onClick={() => setSelectedPayment(payment)}>
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Pagination Controls */}
                <div className="pagination-controls">
                  <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>&lt;</button>
                  <span>Page {currentPage} of {totalPages}</span>
                  <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>&gt;</button>
                </div>
              </>
            ) : (
              <div className="payment-details">
                <h4>Payment Details</h4>
                <div className="details-row"><span>Payment ID:</span> <span className="mono">{selectedPayment.id}</span></div>
                <div className="details-row"><span>Amount:</span> <span>${Number(selectedPayment.amount).toFixed(2)}</span></div>
                <div className="details-row"><span>Due Date:</span> <span>{new Date(selectedPayment.dueDate).toLocaleDateString()}</span></div>
                <div className="details-row"><span>Status:</span> <span>{selectedPayment.status}</span></div>
                <div className="details-row">
                  <span>Pay from Account:</span>
                  <select
                    value={selectedAccountId}
                    onChange={e => setSelectedAccountId(e.target.value)}
                  >
                    <option value="">Select Account</option>
                    {accounts.map(account => (
                      <option key={account.id} value={account.accountNumber}>
                        {account.accountNumber} - ${Number(account.balance).toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="modal-buttons">
                  <button
                    className="submit-button"
                    disabled={!selectedAccountId}
                    onClick={handleConfirmPayment}
                  >
                    Confirm Payment
                  </button>
                  <button
                    className="cancel-button"
                    onClick={() => {
                      setSelectedPayment(null);
                      setSelectedAccountId('');
                    }}
                  >
                    Back
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {isModalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Apply for Loan</h3>
            <form onSubmit={handleLoanApplication}>
              <div className="form-group">
                <label>Account Number:</label>
                <select
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select an account</option>
                  {Array.isArray(accounts) && accounts.map(account => (
                    <option key={account.id} value={account.accountNumber}>
                      {account.accountNumber} - ${account.balance?.toFixed(2) || '0.00'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Loan Amount:</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label>Loan Type:</label>
                <select
                  name="loanType"
                  value={formData.loanType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select loan type</option>
                  <option value="personal">Personal Loan</option>
                  <option value="business">Business Loan</option>
                  <option value="mortgage">Mortgage</option>
                </select>
              </div>

              <div className="form-group">
                <label>Purpose:</label>
                <textarea
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  required
                  placeholder="Describe the purpose of your loan"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Loan Duration (months):</label>
                <input
                  type="number"
                  name="loanDuration"
                  value={formData.loanDuration}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter loan duration in months"
                  min="1"
                />
              </div>

              <div className="form-group">
                <label>Monthly Income:</label>
                <input
                  type="number"
                  name="monthlyIncome"
                  value={formData.monthlyIncome}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your monthly income"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label>Employment Status:</label>
                <select
                  name="employmentStatus"
                  value={formData.employmentStatus}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select employment status</option>
                  <option value="employed">Employed</option>
                  <option value="self-employed">Self Employed</option>
                  <option value="business-owner">Business Owner</option>
                  <option value="retired">Retired</option>
                </select>
              </div>

              <div className="form-buttons">
                <button type="submit" className="submit-button">Submit Application</button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => setIsModalVisible(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Loan;
