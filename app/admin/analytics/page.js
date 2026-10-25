"use client";

import { useEffect, useState } from "react";
import AdminShell from "../AdminShell";

const StatCard = ({ label, value, sub, color = "#C9A96E" }) => (
  <div style={{
    background: "#1A1A1A",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "10px",
    padding: "1.5rem",
  }}>
    <p style={{ fontSize: "0.58rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(245,240,232,0.35)", marginBottom: "0.8rem" }}>{label}</p>
    <p style={{ fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', fontSize: "2.4rem", fontWeight: 400, color, lineHeight: 1 }}>{value}</p>
    {sub && <p style={{ fontSize: "0.65rem", color: "rgba(245,240,232,0.3)", marginTop: "0.4rem", letterSpacing: "0.08em" }}>{sub}</p>}
  </div>
);

const Bar = ({ value, max, color = "#C9A96E", label }) => {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div style={{ marginBottom: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.65rem", color: "rgba(245,240,232,0.4)", marginBottom: "0.25rem" }}>
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div style={{ background: "rgba(255,255,255,0.04)", height: "8px", borderRadius: "4px", overflow: "hidden" }}>
        <div style={{ background: color, width: `${pct}%`, height: "100%" }}></div>
      </div>
    </div>
  );
};

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    let mounted = true;
    const params = new URLSearchParams();
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);

    fetch(`/api/analytics?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => { if (mounted) setData(d); })
      .catch(() => { if (mounted) setData(null); })
      .finally(() => { if (mounted) setLoading(false); });

    return () => { mounted = false; };
  }, [startDate, endDate]);

  return (
    <AdminShell>
      <div style={{ padding: "2.5rem 2rem" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p style={{ fontSize: "0.58rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#C9A96E", marginBottom: "0.3rem" }}>Reports</p>
            <h1 style={{ fontFamily: 'BeausiteFit, "SF Pro Display", sans-serif', fontSize: "1.9rem", color: "#F5F0E8" }}>Analytics</h1>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{
                background: "rgba(245,240,232,0.05)", border: "1px solid rgba(255,255,255,0.08)",
                color: "#F5F0E8", fontSize: "0.75rem", padding: "0.5rem", borderRadius: "6px",
              }}
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{
                background: "rgba(245,240,232,0.05)", border: "1px solid rgba(255,255,255,0.08)",
                color: "#F5F0E8", fontSize: "0.75rem", padding: "0.5rem", borderRadius: "6px",
              }}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "rgba(245,240,232,0.25)", fontSize: "0.8rem" }}>Loading analytics…</div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
              <StatCard label="Total Orders" value={data?.totalOrders ?? "—"} sub="All orders in range" />
              <StatCard label="Total Revenue" value={data?.totalRevenue ?? "—"} sub={`₹ ${data?.totalRevenue ?? 0}`} color="#81c784" />
              <StatCard label="Pending Orders" value={data?.pendingOrders ?? "—"} sub="Awaiting fulfillment" color="#ffb74d" />
              <StatCard label="Total Inquiries" value={data?.totalInquiries ?? "—"} sub="Customer inquiries" color="#64b5f6" />
              <StatCard label="Total Users" value={data?.totalUsers ?? "—"} sub="Registered accounts" color="#ce93d8" />
              <StatCard label="Conversion Rate" value={`${data?.conversionRate ?? 0}%`} sub="Orders vs Inquiries" color="#b388ff" />
            </div>

            <div style={{ border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "1.5rem" }}>
              <p style={{ fontSize: "0.58rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#C9A96E", marginBottom: "1rem" }}>Key Metrics</p>
              <Bar value={data?.totalOrders ?? 0} max={data?.totalOrders ?? 1} color="#C9A96E" label="Total Orders" />
              <Bar value={data?.pendingOrders ?? 0} max={data?.totalOrders ?? 1} color="#ffb74d" label="Pending Orders" />
              <Bar value={data?.totalInquiries ?? 0} max={data?.totalInquiries ?? 1} color="#64b5f6" label="Total Inquiries" />
            </div>
          </>
        )}
      </div>
    </AdminShell>
  );
}