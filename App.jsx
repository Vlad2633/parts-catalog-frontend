import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { loadToken, clearToken, saveToken } from "./store/session";
import { setAuthToken } from "./api/http";
import { AuthApi } from "./api/auth";

import CatalogPage from "./pages/CatalogPage";
import PartPage from "./pages/PartPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminPage from "./pages/AdminPage";

function Guard({ user, role, children }) {
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const [user, setUser] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const token = loadToken();
    if (token) {
      setAuthToken(token);
      AuthApi.me()
        .then(setUser)
        .catch(() => {
          clearToken();
          setUser(null);
        });
    }
  }, []);

  const onLogout = () => {
    clearToken();
    setUser(null);
    nav("/");
  };

  const onLoginSuccess = async (token) => {
    saveToken(token);
    setAuthToken(token);
    const me = await AuthApi.me();
    setUser(me);
    nav("/");
  };

  return (
    <div className="container">
      <header className="card navbar">
        <div className="brand">
          <span>Каталог запчастин</span>
          <span className="badge">ЗАІ-221 · Цехмейстер Влад</span>
        </div>

        <div className="spacer" />

        <Link className="btn" to="/cart">Корзина</Link>

        {user ? (
          <>
            <span className="badge">
              {user.name} · {user.role}
            </span>

            {user.role === "ADMIN" && (
              <Link className="btn primary" to="/admin">
                Адмін
              </Link>
            )}

            <button className="btn danger" onClick={onLogout}>
              Вийти
            </button>
          </>
        ) : (
          <>
            <Link className="btn primary" to="/login">
              Увійти
            </Link>
            <Link className="btn" to="/register">
              Реєстрація
            </Link>
          </>
        )}
      </header>

      <div style={{ height: 14 }} />

      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/parts/:id" element={<PartPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/login" element={<LoginPage onLoginSuccess={onLoginSuccess} />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/admin"
          element={
            <Guard user={user} role="ADMIN">
              <AdminPage />
            </Guard>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
