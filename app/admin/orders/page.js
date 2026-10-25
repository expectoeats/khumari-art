"use client";

import { useEffect, useState, useCallback } from "react";
import AdminShell from "../AdminShell";

const STATUS_COLORS = {
  pending:   { bg: "rgba(255,183,77,0.12)", color: "#ffb74d", border: "rgba(255,183,77,0.3)" },
  confirmed: { bg: "rgba(100,181,246,0.1)",  color: "#64b5f6", border: "rgba(100,181,246,0.25)" },
  shipped:   { bg: "rgba(171,134,217,0.1)",  color: "#b388ff", border: "rgba(171,134,217,0.25)" },
  delivered: { bg: "rgba(129,199,132,0.1)",  color: "#81c784", border: "rgba(129,199,132,0.3)" },
  cancelled: { bg: "rgba(229,115,115,0.1)",  color: "#e57373", border: "rgba(229,115,115,0.3)" },
};

const PAYMENT_COLORS = {
  pending:  { bg: "rgba(255,183,77,0.12)", color: "#ffb74d", border: "rgba(255,183,77,0.3)" },
  paid:     { bg: "rgba(129,199,132,0.1)", color: "#81c784", border: "rgba(129,199,132,0.3)" },
  failed:   { bg: "rgba(229,115,115,0.1)", color: "#e57373", border: "rgba(229,115,115,0.3)" },
  refunded: { bg: "rgba(171,134,217,0.1)", color: "#b388ff", border: "rgba(171,134,217,0.25)" },
};

function Badge({ type, status }) {
  const map = type === "payment" ? PAYMENT_COLORS : STATUS_COLORS;
  const s = map[status] || map.pending;
  return (
    <span
      style={{
        fontSize: "0.58rem",
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        borderRadius: "4px",
        padding: "0.2rem 0.55rem",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      }}
    >
      {status}
    </span>
  );
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [open, setOpen] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (paymentFilter !== "all") params.set("paymentStatus", paymentFilter);
      const res = await fetch(`/api/orders?${params.toString()}`);
      const data = await res.json();
      setOrders(data.orders || []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, paymentFilter]);

  useEffect(() => { load(); }, [load]);

  const visible = orders.filter(
    (o) =>
      !search ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.artworkTitle.toLowerCase().includes(search.toLowerCase())
  );

  const handleStatusChange = async (id, status) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: status }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o._id === id ? { ...o, orderStatus: status } : o))
        );
        setOpen(null);
      }
    } catch {
      alert("Failed to update order status");
    } finally {
      setSaving(false);
    }
  };

  const handlePaymentChange = async (id, status) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: status }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o._id === id ? { ...o, paymentStatus: status } : o))
        );
        setOpen(null);
      }
    } catch {
      alert("Failed to update payment status");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this order permanently?")) return;
    try {
      await fetch(`/api/orders/${id}`, { method: "DELETE" });
      setOrders((prev) => prev.filter((o) => o._id !== id));
      setOpen(null);
    } catch {
      alert("Failed to delete order");
    }
  };

  return (
    <AdminShell>
      <div style={{ padding: "2.5rem 2rem" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p style={{ fontSize: "0.58rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#C9A96E", marginBottom: "0.3rem" }}>Manage</p>
            <h1 style={{ fontFamily: 'BeausiteFit, "SF Pro Display", sans-serif', fontSize: "1.9rem", color: "#F5F0E8" }}>Orders</h1>
          </div>
          <div style={{ background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.2)", borderRadius: "6px", padding: "0.5rem 1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <p style={{ fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', fontSize: "1.4rem", color: "#C9A96E", lineHeight: 1 }}>{orders.length}</p>
            <p style={{ fontSize: "0.58rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(201,169,110,0.6)" }}>Total orders</p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order number, customer, artwork…"
            style={{
              background: "rgba(245,240,232,0.05)", border: "1px solid rgba(255,255,255,0.08)",
              color: "#F5F0E8", fontSize: "0.82rem", padding: "0.55rem 1rem", outline: "none",
              borderRadius: "6px", fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', width: "320px",
            }}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              background: "rgba(245,240,232,0.05)", border: "1px solid rgba(255,255,255,0.08)",
              color: "#F5F0E8", fontSize: "0.82rem", padding: "0.55rem 1rem", outline: "none",
              borderRadius: "6px", fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            <option value="all">All Order Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            style={{
              background: "rgba(245,240,232,0.05)", border: "1px solid rgba(255,255,255,0.08)",
              color: "#F5F0E8", fontSize: "0.82rem", padding: "0.55rem 1rem", outline: "none",
              borderRadius: "6px", fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            <option value="all">All Payment Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        <p style={{ fontSize: "0.62rem", color: "rgba(245,240,232,0.25)", letterSpacing: "0.1em", marginBottom: "1.2rem" }}>
          {loading ? "Loading…" : `${visible.length} order${visible.length !== 1 ? "s" : ""}`}
        </p>

        <div style={{ border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 140px 100px 100px 110px", background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            {["Order #", "Customer", "Artwork", "Amount", "Order Status", "Payment"].map((h, i) => (
              <div key={i} style={{ padding: "0.65rem 0.8rem", fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(245,240,232,0.3)" }}>{h}</div>
            ))}
          </div>

          {loading ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "rgba(245,240,232,0.25)", fontSize: "0.8rem" }}>Loading orders…</div>
          ) : visible.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "rgba(245,240,232,0.25)", fontSize: "0.8rem" }}>No orders found.</div>
          ) : (
            visible.map((order, i) => (
              <div
                key={order._id}
                style={{
                  display: "grid", gridTemplateColumns: "120px 1fr 140px 100px 100px 110px",
                  borderBottom: i < visible.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  alignItems: "center", cursor: "pointer",
                }}
                onClick={() => setOpen(order)}
              >
                <div style={{ padding: "0.8rem 0.8rem", fontSize: "0.8rem", color: "#F5F0E8", fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif' }}>{order.orderNumber}</div>
                <div style={{ padding: "0.8rem 0.8rem" }}>
                  <p style={{ fontSize: "0.8rem", color: "#F5F0E8", fontFamily: '"SF Pro Display", "SF Pro", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif', marginBottom: "0.15rem" }}>{order.customerName}</p>
                  <p style={{ fontSize: "0.65rem", color: "rgba(245,240,232,0.35)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{order.customerEmail}</p>
                </div>
                <div style={{ padding: "0.8rem 0.8rem", fontSize: "0.75rem", color: "#F5F0E8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{order.artworkTitle}</div>
                <div style={{ padding: "0.8rem 0.8rem", fontSize: "0.75rem", color: "#F5F0E8" }}>{order.totalAmount} {order.currency || "₹"}</div>
                <div style={{ padding: "0.8rem 0.8rem" }}><Badge type="order" status={order.orderStatus} /></div>
                <div style={{ padding: "0.8rem 0.8rem" }}><Badge type="payment" status={order.paymentStatus} /></div>
              </div>
            ))
          )}
        </div>

        {open && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", justifyContent: "flex-end" }}>
            <div style={{ background: "#1A1A1A", borderLeft: "1px solid rgba(255,255,255,0.08)", width: "100%", maxWidth: "460px", height: "100vh", overflowY: "auto", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ fontSize: "0.58rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#C9A96E", marginBottom: "0.3rem" }}>Order Details</p>
                  <h2 style={{ fontFamily: 'BeausiteFit, "SF Pro Display", sans-serif', fontSize: "1.3rem", color: "#F5F0E8" }}>{open.orderNumber}</h2>
                </div>
                <button onClick={() => setOpen(null)} style={{ background: "none", border: "none", color: "rgba(245,240,232,0.4)", fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <p style={{ fontSize: "0.58rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(245,240,232,0.3)", marginBottom: "0.6rem" }}>Customer</p>
                  <p style={{ fontSize: "0.85rem", color: "#F5F0E8", marginBottom: "0.4rem" }}>{open.customerName}</p>
                  <p style={{ fontSize: "0.75rem", color: "rgba(245,240,232,0.45)", marginBottom: "0.4rem" }}>{open.customerEmail}</p>
                  <p style={{ fontSize: "0.75rem", color: "rgba(245,240,232,0.45)" }}>{open.customerPhone || "—"}</p>
                </div>
                <div>
                  <p style={{ fontSize: "0.58rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(245,240,232,0.3)", marginBottom: "0.6rem" }}>Order Info</p>
                  <p style={{ fontSize: "0.75rem", color: "rgba(245,240,232,0.45)", marginBottom: "0.4rem" }}>{open.artworkTitle}</p>
                  <p style={{ fontSize: "0.75rem", color: "rgba(245,240,232,0.45)" }}>{open.quantity} × {open.price} = {open.totalAmount}</p>
                  <p style={{ fontSize: "0.75rem", color: "rgba(245,240,232,0.45)" }}>{new Date(open.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
              </div>

              <div>
                <p style={{ fontSize: "0.58rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(245,240,232,0.3)", marginBottom: "0.6rem" }}>Status</p>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {["pending", "confirmed", "shipped", "delivered", "cancelled"].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(open._id, s)}
                      disabled={saving || open.orderStatus === s}
                      style={{
                        background: open.orderStatus === s ? STATUS_COLORS[s].bg : "rgba(255,255,255,0.04)",
                        border: `1px solid ${open.orderStatus === s ? STATUS_COLORS[s].border : "rgba(255,255,255,0.08)"}`,
                        color: open.orderStatus === s ? STATUS_COLORS[s].color : "rgba(245,240,232,0.35)",
                        borderRadius: "4px", fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase",
                        padding: "0.3rem 0.7rem", cursor: open.orderStatus === s || saving ? "not-allowed" : "pointer",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p style={{ fontSize: "0.58rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(245,240,232,0.3)", marginBottom: "0.6rem" }}>Payment</p>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {["pending", "paid", "failed", "refunded"].map((s) => (
                    <button
                      key={s}
                      onClick={() => handlePaymentChange(open._id, s)}
                      disabled={saving || open.paymentStatus === s}
                      style={{
                        background: open.paymentStatus === s ? PAYMENT_COLORS[s].bg : "rgba(255,255,255,0.04)",
                        border: `1px solid ${open.paymentStatus === s ? PAYMENT_COLORS[s].border : "rgba(255,255,255,0.08)"}`,
                        color: open.paymentStatus === s ? PAYMENT_COLORS[s].color : "rgba(245,240,232,0.35)",
                        borderRadius: "4px", fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase",
                        padding: "0.3rem 0.7rem", cursor: open.paymentStatus === s || saving ? "not-allowed" : "pointer",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {open.notes && (
                <div>
                  <p style={{ fontSize: "0.58rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(245,240,232,0.3)", marginBottom: "0.6rem" }}>Notes</p>
                  <p style={{ fontSize: "0.75rem", color: "rgba(245,240,232,0.6)", whiteSpace: "pre-wrap" }}>{open.notes}</p>
                </div>
              )}

              <button
                onClick={() => handleDelete(open._id)}
                disabled={saving}
                style={{ background: "rgba(229,115,115,0.08)", border: "none", borderRadius: "6px", color: "#e57373", fontSize: "0.7rem", padding: "0.6rem 1.2rem", cursor: saving ? "not-allowed" : "pointer", letterSpacing: "0.1em", textTransform: "uppercase" }}
              >
                Delete Order
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}