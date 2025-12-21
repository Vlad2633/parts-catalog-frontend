import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loadCart, setQty, removeFromCart, cartTotals, clearCart } from "../store/cart";

export default function CartPage() {
  const [items, setItems] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    setItems(loadCart());
  }, []);

  const totals = useMemo(() => cartTotals(items), [items]);

  const onQty = (partId, qty) => {
    const n = Number(qty);
    setItems(setQty(partId, Number.isFinite(n) ? n : 1));
  };

  const onRemove = (partId) => setItems(removeFromCart(partId));

  const onClear = () => setItems(clearCart());

  if (items.length === 0) {
    return (
      <div className="card" style={{ padding: 16 }}>
        <div className="h2">Корзина порожня</div>
        <div className="muted" style={{ marginTop: 6 }}>
          Додай запчастини з каталогу.
        </div>
        <div style={{ height: 12 }} />
        <Link className="btn primary" to="/">До каталогу</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="card" style={{ padding: 14 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <div className="h2">Корзина</div>
          <span className="badge">Позицій: {items.length}</span>
          <span className="badge">К-сть: {totals.totalQty}</span>
          <div className="spacer" />
          <button className="btn" onClick={onClear}>Очистити</button>
          <button className="btn primary" onClick={() => nav("/checkout")}>Оформити</button>
        </div>
      </div>

      <div style={{ height: 14 }} />

      <div className="card" style={{ padding: 14 }}>
        {items.map((x) => (
          <div key={x.partId} style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 0" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800 }}>{x.title}</div>
              <div className="muted" style={{ fontSize: 12 }}>
                {x.category || "—"} · {x.brand || "—"}
              </div>
            </div>

            <div className="badge">{x.price} грн</div>

            <input
              className="input"
              style={{ width: 90 }}
              type="number"
              min="1"
              value={x.qty}
              onChange={(e) => onQty(x.partId, e.target.value)}
            />

            <div className="badge">{x.price * x.qty} грн</div>

            <button className="btn danger" onClick={() => onRemove(x.partId)}>✕</button>
          </div>
        ))}

        <div className="hr" style={{ margin: "10px 0" }} />

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div className="spacer" />
          <div className="badge">Разом: {totals.totalSum} грн</div>
        </div>
      </div>

      <div style={{ height: 14 }} />
      <Link className="btn" to="/">← Назад до каталогу</Link>
    </div>
  );
}
