import { useState } from "react";
import { AuthApi } from "../api/auth";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  const [name, setName] = useState("Цехмейстер Влад");
  const [email, setEmail] = useState("vlad2@test.com");
  const [password, setPassword] = useState("12345678");
  const [ok, setOk] = useState("");
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setOk("");
    try {
      await AuthApi.register({ name, email, password });
      setOk("Користувача створено. Тепер увійди.");
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Помилка реєстрації");
    }
  };

  return (
    <div style={{ maxWidth: 420 }}>
      <h2>Реєстрація</h2>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 8 }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ім’я" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Пароль" type="password" />
        <button type="submit">Створити акаунт</button>
        {ok ? <div style={{ color: "green" }}>{ok}</div> : null}
        {err ? <div style={{ color: "crimson" }}>{err}</div> : null}
      </form>
      <p style={{ marginTop: 8 }}>
        Уже є акаунт? <Link to="/login">Вхід</Link>
      </p>
    </div>
  );
}
