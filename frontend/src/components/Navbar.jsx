import "../App.css";
export default function Navbar({ onLogout }) {
  return (
    <div className="navbar">
      <h1>💸 Finance Tracker</h1>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}
