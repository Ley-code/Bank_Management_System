import { useState, useEffect } from "react";

const Withdrawal = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    // Fetch customer accounts
    // This is a placeholder - replace with actual API call
    const fetchAccounts = async () => {
      try {
        // const response = await fetch('/api/customer/accounts');
        // const data = await response.json();
        // setAccounts(data);
        
        // Temporary mock data
        setAccounts([
          { id: 1, accountNumber: "ACC001", type: "Savings", balance: 15000 },
          { id: 2, accountNumber: "ACC002", type: "Checking", balance: 10000 }
        ]);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };

    fetchAccounts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedAccount || !amount || amount <= 0) {
      setMessage({
        type: "error",
        text: "Please fill in all required fields"
      });
      return;
    }

    const selectedAccountData = accounts.find(acc => acc.id === parseInt(selectedAccount));
    if (selectedAccountData && parseFloat(amount) > selectedAccountData.balance) {
      setMessage({
        type: "error",
        text: "Insufficient funds in the selected account"
      });
      return;
    }

    try {
      // This is a placeholder - replace with actual API call
      // const response = await fetch('/api/customer/withdraw', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     accountId: selectedAccount,
      //     amount: parseFloat(amount)
      //   })
      // });
      
      // const data = await response.json();
      
      // Temporary success message
      setMessage({
        type: "success",
        text: `Successfully withdrew $${amount} from your account`
      });
      
      // Reset form
      setAmount("");
      setSelectedAccount("");
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to process withdrawal. Please try again."
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Withdraw Money</h1>

        {message.text && (
          <div
            className={`p-4 mb-6 rounded ${
              message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="account"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select Account
            </label>
            <select
              id="account"
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select an account</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.type} Account - {account.accountNumber} (Balance: $
                  {account.balance.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Withdrawal Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
                min="0.01"
                step="0.01"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Withdraw Money
          </button>
        </form>
      </div>
    </div>
  );
};

export default Withdrawal; 