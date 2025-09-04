"use client";

import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Home() {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState<{ sender: string; text: string }[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({});
  const [forecast, setForecast] = useState<any>({});

  const fetchData = async () => {
    try {
      const tx = await fetch("http://localhost:3000/transactions").then((r) => r.json());
      const sum = await fetch("http://localhost:3000/transactions/summary").then((r) => r.json());
      const fc = await fetch("http://localhost:3000/transactions/forecast").then((r) => r.json());
      setTransactions(tx);
      setSummary(sum);
      setForecast(fc);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSend = async () => {
    if (!message.trim()) return;

    setChatLog((prev) => [...prev, { sender: "user", text: message }]);

    try {
      const res = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      setChatLog((prev) => [...prev, { sender: "bot", text: data.reply }]);
      fetchData();
    } catch (err) {
      setChatLog((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ เกิดข้อผิดพลาด ติดต่อ backend ไม่ได้" },
      ]);
    }
    setMessage("");
  };

  const chartData = {
    labels: transactions.map((t) => t.description),
    datasets: [
      {
        label: "Amount",
        data: transactions.map((t) => (t.type === "expense" ? -t.amount : t.amount)),
        backgroundColor: "rgba(0, 255, 255, 0.7)", // neon cyan
        borderColor: "#00ffff",
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, labels: { color: "#00ffff" } },
      title: { display: true, text: "Transactions", color: "#ff00ff" },
    },
    scales: {
      x: { ticks: { color: "#00ffff" } },
      y: { ticks: { color: "#ff00ff" } },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white font-mono">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-cyan-400 drop-shadow-[0_0_10px_#00ffff]">
        🤖 Mini Finance Bot 💰
      </h1>

      {/* Chat box */}
      <div className="chat-box border border-cyan-500 shadow-[0_0_15px_#00ffff] p-4 mb-6 h-72 overflow-y-auto rounded-xl bg-black/50 backdrop-blur-md max-w-3xl mx-auto">
        {chatLog.map((line, idx) => (
          <div
            key={idx}
            className={`mb-3 p-3 rounded-xl max-w-xs whitespace-pre-wrap ${
              line.sender === "user"
                ? "bg-gradient-to-r from-cyan-600 to-blue-700 text-white ml-auto text-right shadow-[0_0_10px_#00ffff]"
                : "bg-gradient-to-r from-gray-700 to-gray-800 text-cyan-200 mr-auto text-left shadow-[0_0_5px_#ff00ff]"
            }`}
          >
            {line.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-3 max-w-3xl mx-auto mb-6">
        <input
          className="flex-1 p-3 rounded-xl bg-gray-900 border border-cyan-400 text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-[0_0_10px_#00ffff]"
          placeholder="⚡ พิมพ์เช่น 'กาแฟ 50' หรือ 'เงินเดือน 25000' หรือ 'เล่าเรื่องตลก'"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="px-6 py-2 rounded-xl bg-cyan-600 text-black font-bold hover:bg-cyan-400 shadow-[0_0_15px_#00ffff] transition"
          onClick={handleSend}
        >
          ส่ง
        </button>
      </div>

      {/* Summary */}
      <div className="max-w-3xl mx-auto mb-6 bg-gray-900/70 border border-purple-500 shadow-[0_0_15px_#ff00ff] p-5 rounded-xl">
        <h2 className="text-xl font-bold mb-3 text-purple-400">📊 Summary</h2>
        <p>Income: <span className="text-green-400">{summary?.income ?? 0}</span></p>
        <p>Expense: <span className="text-red-400">{summary?.expense ?? 0}</span></p>
        <p>Balance: <span className="text-cyan-400">{summary?.balance ?? 0}</span></p>
        <p>Forecast (สิ้นเดือน): <span className="text-yellow-400">{forecast?.forecast ?? 0}</span></p>
      </div>

      {/* Chart */}
      <div className="max-w-3xl mx-auto bg-gray-900/70 border border-cyan-500 shadow-[0_0_15px_#00ffff] p-5 rounded-xl">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
