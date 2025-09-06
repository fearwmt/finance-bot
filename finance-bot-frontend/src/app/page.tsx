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

  // Chart
  const chartData = {
    labels: transactions.map((t) => t.description),
    datasets: [
      {
        label: "Amount",
        data: transactions.map((t) => (t.type === "expense" ? -t.amount : t.amount)),
        backgroundColor: "rgba(59, 130, 246, 0.65)", // neon blue
        borderColor: "#60a5fa",
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, labels: { color: "#b5f3ff" } },
      title: { display: true, text: "Transactions", color: "#c084fc" },
      tooltip: { enabled: true },
    },
    scales: {
      x: { ticks: { color: "#88e2ff" }, grid: { color: "rgba(136,226,255,0.12)" } },
      y: { ticks: { color: "#c084fc" }, grid: { color: "rgba(192,132,252,0.12)" } },
    },
  };

  return (
    <div className="min-h-screen relative text-cyan-100">
      {/* --- HOLOGRAPHIC BACKGROUND --- */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Nebula gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_70%_20%,rgba(99,102,241,0.25),transparent),radial-gradient(50%_50%_at_20%_80%,rgba(34,211,238,0.25),transparent)]" />
        {/* Animated grid */}
        <div className="absolute inset-0 opacity-30 [background:linear-gradient(transparent_23px,rgba(0,255,255,0.15)_24px),linear-gradient(90deg,transparent_23px,rgba(192,132,252,0.15)_24px)] [background-size:24px_24px] animate-slow-pan" />
        {/* Scanlines */}
        <div className="absolute inset-0 mix-blend-soft-light opacity-25 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[length:100%_3px]" />
        {/* Corner glow orbs */}
        <div className="absolute -top-28 -left-28 h-96 w-96 rounded-full blur-3xl bg-fuchsia-500/20" />
        <div className="absolute -bottom-28 -right-28 h-96 w-96 rounded-full blur-3xl bg-cyan-400/20" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 py-10">
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-8">
          <span className="h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-400 to-fuchsia-500 shadow-[0_0_25px_#22d3ee80] grid place-items-center">
            <span className="h-3 w-3 rounded-full bg-white/90 shadow-[0_0_12px_#fff]"></span>
          </span>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-fuchsia-300 drop-shadow-[0_0_16px_#22d3ee80]">
              NEO • Finance Bot
            </h1>
            <p className="text-sm text-cyan-200/80">“Adaptive cyber assistant for your money flow.”</p>
          </div>
        </div>

        {/* INTRO NOTE */}
        <div className="max-w-3xl mx-auto mb-8 p-4 rounded-2xl bg-black/50 backdrop-blur-xl border border-cyan-500/30 shadow-[0_0_15px_#22d3ee66]">
          <h2 className="text-lg font-semibold text-cyan-300 mb-2">🧭 วิธีใช้งาน NEO • Finance Bot</h2>
          <ul className="text-sm text-cyan-100/80 leading-relaxed list-disc list-inside space-y-1">
            <li>พิมพ์ <span className="text-cyan-200">"เงินเดือน 25000"</span> เพื่อบันทึกรายรับ</li>
            <li>พิมพ์ <span className="text-cyan-200">"กาแฟ 50"</span> เพื่อบันทึกค่าใช้จ่าย</li>
            <li>หรือถามอะไรก็ได้ เช่น <span className="text-cyan-200">"เล่าเรื่องตลก"</span>, <span className="text-cyan-200">"AI คืออะไร?"</span></li>
          </ul>
        </div>

        {/* CHAT + INPUT (HOLOGRAPHIC CARD) */}
        <div className="mb-8 p-[1px] rounded-2xl bg-gradient-to-r from-cyan-500/50 via-fuchsia-500/40 to-blue-500/50 shadow-[0_0_30px_#22d3ee66]">
          <section className="rounded-2xl backdrop-blur-xl bg-black/40 border border-white/10 p-4 md:p-6">
            <h2 className="text-xs tracking-[0.25em] uppercase text-fuchsia-200/80 mb-3">Dialog Matrix</h2>

            {/* CHAT BOX — ใช้ flex-col เพื่อ align ซ้าย/ขวา ต่อบรรทัด */}
            <div className="chat-box rounded-xl bg-black/40 border border-white/10 h-72 overflow-y-auto p-3 flex flex-col gap-2">
              {chatLog.map((line, idx) => (
                <div
                  key={idx}
                  className={`flex ${line.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`
                      px-4 py-2 inline-block w-fit max-w-[80%] rounded-xl text-sm leading-relaxed
                      whitespace-pre-wrap break-words relative
                      ${line.sender === "user"
                        ? "text-white bg-gradient-to-r from-fuchsia-600/70 to-cyan-600/60 shadow-[0_0_18px_#22d3ee80]"
                        : "text-cyan-100 bg-gradient-to-r from-slate-800/70 to-slate-800/30 border border-white/10"}
                    `}
                  >
                    <span
                      className={`absolute -top-1 -left-1 h-2 w-2 rounded-full ${
                        line.sender === "user" ? "bg-fuchsia-300" : "bg-cyan-300"
                      } shadow-[0_0_8px_#ffffff]`}
                    />
                    {line.text}
                  </div>
                </div>
              ))}
            </div>

            {/* INPUT BAR */}
            <div className="mt-4 flex gap-2">
              <input
                className="flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-cyan-100 placeholder:text-cyan-300/40 outline-none focus:ring-2 focus:ring-cyan-400/70"
                placeholder="พิมพ์ ‘กาแฟ 50’ / ‘เงินเดือน 25000’ หรือ ‘เล่าเรื่องตลก’"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                className="rounded-xl px-6 py-3 font-semibold text-black bg-gradient-to-r from-cyan-300 to-fuchsia-300 hover:from-cyan-200 hover:to-fuchsia-200 transition shadow-[0_0_22px_#22d3ee80] active:scale-[0.98]"
                onClick={handleSend}
              >
                ส่ง
              </button>
            </div>
          </section>
        </div>

        {/* METRICS + CHART */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Metrics card */}
          <div className="p-[1px] rounded-2xl bg-gradient-to-r from-blue-500/40 via-cyan-500/40 to-fuchsia-500/40 shadow-[0_0_30px_#60a5fa55]">
            <div className="rounded-2xl backdrop-blur-xl bg-black/40 border border-white/10 p-5">
              <h3 className="text-xs tracking-[0.25em] uppercase text-cyan-200/80 mb-4">Ledger Pulse</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <Stat label="Income" value={summary?.income ?? 0} color="text-emerald-300" />
                <Stat label="Expense" value={summary?.expense ?? 0} color="text-rose-300" />
                <Stat label="Balance" value={summary?.balance ?? 0} color="text-cyan-300" />
                <Stat label="Forecast" value={forecast?.forecast ?? 0} color="text-fuchsia-300" />
              </div>
            </div>
          </div>

          {/* Chart card */}
          <div className="p-[1px] rounded-2xl bg-gradient-to-r from-fuchsia-500/40 via-blue-500/40 to-cyan-500/40 shadow-[0_0_30px_#c084fc55]">
            <div className="rounded-2xl backdrop-blur-xl bg-black/40 border border-white/10 p-5">
              <h3 className="text-xs tracking-[0.25em] uppercase text-fuchsia-200/80 mb-4">Transaction Spectrum</h3>
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>

        <p className="mt-6 text-xs text-cyan-200/70">
          * Forecast = เงินเดือน − (ค่าใช้จ่ายเฉลี่ย/วัน × จำนวนวันทั้งเดือน)
        </p>
      </div>

      {/* Local styles for animations */}
      <style jsx>{`
        .animate-slow-pan {
          animation: pan 30s linear infinite;
        }
        @keyframes pan {
          0% { background-position: 0 0, 0 0; }
          100% { background-position: 240px 240px, 240px 240px; }
        }
      `}</style>
    </div>
  );
}

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-3">
      <div className="text-[11px] tracking-wider uppercase text-cyan-200/70">{label}</div>
      <div className={`mt-1 text-lg font-semibold ${color}`}>{value}</div>
    </div>
  );
}
