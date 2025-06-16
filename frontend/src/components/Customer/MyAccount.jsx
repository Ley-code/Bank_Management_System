import { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownLeft, CreditCard, Wallet } from 'lucide-react';

const MyAccount = () => {
  // State for managing accounts data
  const [accounts, setAccounts] = useState([]);
  // State for currently selected account
  const [selectedAccount, setSelectedAccount] = useState(null);
  // State for transaction history
  const [transactions, setTransactions] = useState([]);
  // State for loading and error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const customerId = "62a2645c-5367-4734-85dc-c2ac2dbbde2f"

  // Fetch accounts data when component mounts
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        //const customerId = "35194d9c-c9c3-4b97-b7c8-f139f7a929e2"; // Use the same customer ID as Dashboard
        
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
        if (mappedAccounts.length > 0) {
          setSelectedAccount(mappedAccounts[0]); // Select first account by default
        }
      } catch (error) {
        console.error("Error fetching accounts:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  // Fetch transactions when selected account changes
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!selectedAccount) return;

      try {
        // TODO: Replace with actual API endpoint when available
        // For now, using mock data
        const response = await fetch(`http://localhost:8000/api/user/${customerId}/transactions/${selectedAccount.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }
        const transactionsData = await response.json();
        console.log("Transactions Data:", transactionsData);
        // Map transactions data to desired structure
        const transactions = transactionsData.data.map(transaction => ({
          id: transaction.id,
          type: transaction.type,
          amount: transaction.amount,
          date: transaction.createdAt,
          description: transaction.notes,
          status: transaction.status,
          direction: transaction.direction,
        }));
        setTransactions(transactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setError(error.message);
      }
    };

    fetchTransactions();
  }, [selectedAccount]);

  // Helper function to get appropriate icon based on transaction type
  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="w-5 h-5 text-green-500" />;
      case 'withdrawal':
        return <ArrowUpRight className="w-5 h-5 text-red-500" />;
      case 'transfer':
        return <CreditCard className="w-5 h-5 text-blue-500" />;
      default:
        return <Wallet className="w-5 h-5 text-gray-500" />;
    }
  };

  // Helper function to format dates
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
    // Main container with responsive padding
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Accounts</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage your accounts and transactions
        </p>
      </div>

      {/* Account selection grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {accounts.map((account) => (
          // Account card with interactive selection
          <div
            key={account.id}
            onClick={() => setSelectedAccount(account)}
            className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
              selectedAccount?.id === account.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            {/* Account header with type and status */}
            <div className="flex justify-between items-start">
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
            {/* Account balance and opening date */}
            <div className="mt-4">
              <p className="text-2xl font-bold text-gray-900">
                ${account.balance.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                Opened on {formatDate(account.openedDate)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Transaction history section */}
      {selectedAccount && (
        <div className="bg-white rounded-lg shadow">
          {/* Transaction history header */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Transaction History
            </h2>
            <p className="text-sm text-gray-500">
              {selectedAccount.type} Account - {selectedAccount.accountNumber}
            </p>
          </div>
          {/* Transaction list */}
          <div className="divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="p-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getTransactionIcon(transaction.type)}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(transaction.date)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${
                    transaction.direction === 'credit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.direction === 'credit' ? '+' : '-'}${transaction.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{transaction.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAccount;