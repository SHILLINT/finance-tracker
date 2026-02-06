import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import "../App.css";

export default function SummaryChart({ transactions }) {
  // Separate income and expense transactions
  const expenses = transactions.filter((t) => t.type === "expense");
  const incomes = transactions.filter((t) => t.type === "income");

  // Group by category and sum amounts
  const groupByCategory = (arr) => {
    const grouped = arr.reduce((acc, txn) => {
      const cat = txn.category || "Other";
      acc[cat] = (acc[cat] || 0) + Number(txn.amount);
      return acc;
    }, {});
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  };

  const expenseData = groupByCategory(expenses);
  const incomeData = groupByCategory(incomes);

  // 🎨 New, high-contrast color palettes
  const EXPENSE_COLORS = [
    "#FF2D00", // vivid red
    "#FF6A00", // strong orange
    "#FFB100", // golden yellow
    "#FF0090", // magenta-pink
    "#FF7AC8", // bright pink
    "#FFA500", // amber
  ];

  const INCOME_COLORS = [
    "#00C49A", // bright green-teal
    "#00B0FF", // vivid blue
    "#0088FE", // strong azure
    "#5E5EFF", // indigo-blue
    "#7B68EE", // medium purple
    "#4B0082", // deep indigo
  ];

  // Label renderer to show % inside slices
  const renderLabel = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={13}
        fontWeight="bold"
        style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}
      >
        {(percent * 100).toFixed(0)}%
      </text>
    );
  };

  const ChartBlock = ({ title, data, colors }) => (
    <div style={{ flex: 1, textAlign: "center", minWidth: 350 }}>
      <h4>{title}</h4>
      {data.length > 0 ? (
        <PieChart width={340} height={280}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={110}
            innerRadius={50}
            labelLine={false}
            label={renderLabel}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={colors[i % colors.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
          <Legend />
        </PieChart>
      ) : (
        <p style={{ color: "#888" }}>No data yet</p>
      )}
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        flexWrap: "wrap",
        marginTop: "20px",
      }}
    >
      <ChartBlock
        title="Expenses by Category"
        data={expenseData}
        colors={EXPENSE_COLORS}
      />
      <ChartBlock
        title="Income by Category"
        data={incomeData}
        colors={INCOME_COLORS}
      />
    </div>
  );
}
