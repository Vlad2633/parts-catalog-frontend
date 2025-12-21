import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadCart, cartTotals, clearCart } from "../store/cart";
import { OrdersApi } from "../api/orders";

export default function CheckoutPage() {
  const nav = useNavigate();
  const items = useMemo(() => loadCart(), []);
  const totals = useMemo(() => cartTotals(items), [items]);

  const [fullName, setFullName] = useState("Цехмейстер Влад");
  const [phone, setPhone] = useState("+380");
  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(""); setOk("");

    if (items.length === 0) return setErr("Корзина порожня.");
    if (!fullName.trim()) return setErr("Вкажи ПІБ.");
    if (!phone.trim()) return setErr("Вкажи телефон.");
    if (!address.trim()) return setErr("Вкажи адресу.");

    setLoading(true);
    try {
      const payload = {
        customer: { fullName, phone, address },
        comment,
        items: items.map((x) => ({ partId: x.partId, title: x.title, price: x.price, qty: x.qty })),
        totalSum: totals.totalSum,
      };

      const res = await OrdersApi.create(payload);
      clearCart();
      setOk(`Замовлення створено. Номер: ${res.orderNumber || res._id}`);
      setTimeout(() => nav("/"), 900);
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Помилка оформлення");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ padding: 16, maxWidth: 720, margin: "0 auto" }}>
      <div className="h2">Оформлення замовлення</div>
      <div className="muted" style={{ marginTop: 6 }}>
        Позицій: {items.length} · Сума: {totals.totalSum} грн
      </div>

      <div style={{ height: 12 }} />

      <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
        <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="ПІБ" />
        <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Телефон" />
        <input className="input" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Адреса доставки" />
        <textarea className="input" rows={4} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Коментар (необов'язково)" />

        <button className="btn primary" disabled={loading} type="submit">
          {loading ? "Оформлення…" : "Підтвердити замовлення"}
        </button>

        {err ? <div className="badge" style={{ borderColor: "rgba(239,68,68,.4)" }}>{err}</div> : null}
        {ok ? <div className="badge" style={{ borderColor: "rgba(34,197,94,.4)" }}>{ok}</div> : null}
      </form>
    </div>
  );
}
