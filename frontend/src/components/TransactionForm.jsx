import { useState } from "react";
import api from "../api";

export default function TransactionForm({ onAdd }) {
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const username = localStorage.getItem("username");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newTxn = { username, type, category, amount: parseFloat(amount), date, note };
      await api.post("/transactions/", newTxn);
      onAdd();
      setCategory("");
      setAmount("");
      setDate("");
      setNote("");
    } catch (err) {
      alert(err.response?.data?.error || "Error adding transaction");
    }
  };

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Type</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>

      <div className="form-group">
        <label>Category</label>
        <input
          type="text"
          placeholder="e.g. Food, Rent, Salary"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Amount ($)</label>
        <input
          type="number"
          step="0.01"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div className="form-group" style={{ flex: "1 1 200px" }}>
        <label>Note</label>
        <input
          type="text"
          placeholder="Optional note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <button type="submit">Add Transaction</button>
    </form>
  );
}
