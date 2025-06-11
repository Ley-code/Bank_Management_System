import { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownLeft, CreditCard, Wallet } from 'lucide-react';

const MyAccount = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Fetch accounts data
    // This would be replaced with actual API call
    const fetchAccounts = async () => {
      try {
        // Mock data for accounts
        const mockAccounts = [
          {
            id: 1,
            accountNumber: "SAV-001",
            type: "Savings",
            balance: 15000,
            currency: "USD",
            status: "Active",
            openedDate: "2023-01-15"
          },
          {
            id: 2,
            accountNumber: "CHK-001",
            type: "Checking",
            balance: 8500,
            currency: "USD",
            status: "Active",
            openedDate: "2023-02-20"
          }
        ];
        setAccounts(mockAccounts);
        setSelectedAccount(mockAccounts[0]); // Select first account by default
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };

    fetchAccounts();
  }, []);

  useEffect(() => {
    // Fetch transactions for selected account
    // This would be replaced with actual API call
    const fetchTransactions = async () => {
      if (!selectedAccount) return;

      try {
        // Mock data for transactions
        const mockTransactions = [
          {
            id: 1,
            type: "deposit",
            amount: 1000,
            date: "2024-03-15",
            description: "Salary Deposit",
            status: "completed"
          },
          {
            id: 2,
            type: "withdrawal",
            amount: 500,
            date: "2024-03-14",
            description: "ATM Withdrawal",
            status: "completed"
          },
          {
            id: 3,
            type: "transfer",
            amount: 200,
            date: "2024-03-13",
            description: "Transfer to John",
            status: "completed"
          },
          {
            id: 4,
            type: "deposit",
            amount: 750,
            date: "2024-03-12",
            description: "Mobile Deposit",
            status: "completed"
          },
          {
            id: 5,
            type: "withdrawal",
            amount: 300,
            date: "2024-03-11",
            description: "Online Purchase",
            status: "completed"
          }
        ];
        setTransactions(mockTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, [selectedAccount]);

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Accounts</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage your accounts and transactions
        </p>
      </div>

      {/* Account Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {accounts.map((account) => (
          <div
            key={account.id}
            onClick={() => setSelectedAccount(account)}
            className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
              selectedAccount?.id === account.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
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

      {/* Transaction History */}
      {selectedAccount && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Transaction History
            </h2>
            <p className="text-sm text-gray-500">
              {selectedAccount.type} Account - {selectedAccount.accountNumber}
            </p>
          </div>
          <div className="divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="p-4 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-gray-100 rounded-full">
                    {getTransactionIcon(transaction.type)}
                  </div>
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
                  <p
                    className={`text-sm font-medium ${
                      transaction.type === 'deposit'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {transaction.type === 'deposit' ? '+' : '-'}$
                    {transaction.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {transaction.status}
                  </p>
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