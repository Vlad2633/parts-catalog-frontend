import { useState } from "react";
import { AuthApi } from "../api/auth";
import { Link } from "react-router-dom";

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState("vlad@test.com");
  const [password, setPassword] = useState("12345678");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await AuthApi.login({ email, password });
      await onLoginSuccess(res.token);
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Помилка входу");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 520, padding: 16, margin: "0 auto" }}>
      <h2 className="h2">Вхід до системи</h2>
      <div className="muted" style={{ marginTop: 4 }}>
        Увійди, щоб отримати доступ до каталогу та адмінки
      </div>

      <div style={{ height: 12 }} />

      <form onSubmit={onSubmit} className="row">
        <input
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          autoComplete="email"
        />

        <input
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          type="password"
          autoComplete="current-password"
        />

        <button className="btn primary" type="submit" disabled={loading}>
          {loading ? "Вхід…" : "Увійти"}
        </button>
      </form>

      {err ? (
        <div
          className="card"
          style={{
            marginTop: 12,
            padding: 10,
            borderColor: "rgba(239,68,68,.45)",
            background:
              "linear-gradient(180deg, rgba(239,68,68,.22), rgba(239,68,68,.08))",
          }}
        >
          <span style={{ color: "#fecaca" }}>{err}</span>
        </div>
      ) : null}

      <div className="hr" style={{ margin: "14px 0" }} />

      <div className="muted">
        Немає акаунта?{" "}
        <Link className="btn" to="/register">
          Реєстрація
        </Link>
      </div>
    </div>
  );
}
