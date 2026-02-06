import { useEffect, useMemo, useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";
import TransactionForm from "../components/TransactionForm";
import SummaryChart from "../components/SummaryChart";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const username = localStorage.getItem("username");

  const fetchData = async () => {
    const res = await api.get(`/transactions/?username=${username}`);
    setTransactions(res.data);
  };

  useEffect(() => {
    fetchData();
  }, [username]);

  const { totalIncome, totalExpense, net } = useMemo(() => {
    const totals = transactions.reduce(
      (acc, t) => {
        const amt = Number(t.amount) || 0;
        if (t.type === "income") acc.totalIncome += amt;
        else acc.totalExpense += amt;
        return acc;
      },
      { totalIncome: 0, totalExpense: 0 }
    );
    return { ...totals, net: totals.totalIncome - totals.totalExpense };
  }, [transactions]);

  const fmt = (n) => n.toLocaleString(undefined, { style: "currency", currency: "USD" });

  const handleLogout = () => {
    localStorage.removeItem("username");
    window.location.href = "/";
  };

  const handleDelete = async (id) => {
    await api.delete(`/transactions/${id}`);
    setTransactions((prev) => prev.filter((t) => t._id !== id));
  };

  return (
    <>
      <Navbar onLogout={handleLogout} />

      <div className="dashboard">
        {/* Totals */}
        <div className="card">
          <div className="totals-grid">
            <div className="total-card">
              <h4>Income</h4>
              <p style={{ color: "#38A169" }}>{fmt(totalIncome)}</p>
            </div>
            <div className="total-card">
              <h4>Expenses</h4>
              <p style={{ color: "#E53E3E" }}>{fmt(totalExpense)}</p>
            </div>
            <div className="total-card">
              <h4>Net</h4>
              <p style={{ color: net >= 0 ? "#38A169" : "#E53E3E" }}>{fmt(net)}</p>
            </div>
          </div>
        </div>

        {/* Add Transaction */}
        <div className="card">
          <h3>Add Transaction</h3>
          <TransactionForm onAdd={fetchData} />
        </div>

        {/* Transactions Table */}
        <div className="card">
          <h3>Transactions</h3>
          <table className="transactions-list">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Note</th>
                <th>Amount</th>
                <th>Type</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn._id}>
                  <td>{txn.date}</td>
                  <td>{txn.category}</td>
                  <td>{txn.note || "-"}</td>
                  <td>{fmt(Number(txn.amount))}</td>
                  <td
                    style={{
                      color: txn.type === "income" ? "#38A169" : "#E53E3E",
                      fontWeight: 500,
                    }}
                  >
                    {txn.type}
                  </td>
                  <td>
                    <button className="delete-btn" onClick={() => handleDelete(txn._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Charts */}
        <div className="card">
          <h3>Summary</h3>
          <div className="charts">
            <SummaryChart transactions={transactions} />
          </div>
        </div>
      </div>
    </>
  );
}
