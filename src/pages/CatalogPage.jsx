import { useEffect, useState } from "react";
import { CatalogApi } from "../api/catalog";
import { Link } from "react-router-dom";
import CategoryImage from "../components/CategoryImage";
import { addToCart } from "../store/cart";

export default function CatalogPage() {
  const [q, setQ] = useState("");
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [parts, setParts] = useState([]);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // для мікро-підтвердження "Додано"
  const [addedId, setAddedId] = useState(null);

  async function fetchParts(nextPage) {
    const data = await CatalogApi.getParts({
      q: q || undefined,
      category: category || undefined,
      brand: brand || undefined,
      page: nextPage,
      limit: 12,
    });

    setParts(data.items || []);
    setPages(data.pages || 1);
  }

  useEffect(() => {
    Promise.all([CatalogApi.getCategories(), CatalogApi.getBrands()])
      .then(([c, b]) => {
        setCategories(c);
        setBrands(b);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchParts(page)
      .catch(() => {})
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const onSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPage(1);
    try {
      await fetchParts(1);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = async () => {
    setQ("");
    setCategory("");
    setBrand("");
    setLoading(true);
    setPage(1);
    try {
      await CatalogApi.getParts({ page: 1, limit: 12 }).then((data) => {
        setParts(data.items || []);
        setPages(data.pages || 1);
      });
    } finally {
      setLoading(false);
    }
  };

  const onAdd = (e, part) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(part, 1);
    setAddedId(part._id);
    window.clearTimeout(window.__cartToast);
    window.__cartToast = window.setTimeout(() => setAddedId(null), 1200);
  };

  return (
    <div>
      <form onSubmit={onSearch} className="card toolbar">
        <input
          className="input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Пошук запчастини…"
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Усі категорії</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <select value={brand} onChange={(e) => setBrand(e.target.value)}>
          <option value="">Усі бренди</option>
          {brands.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name}
            </option>
          ))}
        </select>

        <button className="btn primary" type="submit">
          Застосувати
        </button>

        <button className="btn" type="button" onClick={resetFilters}>
          Скинути
        </button>
      </form>

      <div style={{ height: 14 }} />

      {loading ? (
        <div className="card" style={{ padding: 14 }}>
          <span className="muted">Завантаження…</span>
        </div>
      ) : parts.length === 0 ? (
        <div className="card" style={{ padding: 14 }}>
          <div className="h2">Нічого не знайдено</div>
          <div className="muted" style={{ marginTop: 6 }}>
            Спробуй інший запит або скинь фільтри.
          </div>
        </div>
      ) : (
        <>
          <div className="grid">
            {parts.map((p) => (
              <div key={p._id} className="card item">
                <CategoryImage
                  category={p.categoryId}
                  height={130}
                  alt={p.categoryId?.name || "Категорія"}
                />

                <div style={{ height: 10 }} />

                <div className="itemTitle">{p.title}</div>

                <div className="price">{p.price} грн</div>

                <div className="itemMeta">
                  {p.categoryId?.name || "—"} · {p.brandId?.name || "—"}
                </div>

                <div style={{ display: "flex", gap: 10, marginTop: 12, alignItems: "center" }}>
                  <span className="badge">{p.inStock ? `Є (${p.stock})` : "Немає"}</span>
                  <div className="spacer" />

                  <button
                    className={addedId === p._id ? "btn" : "btn primary"}
                    onClick={(e) => onAdd(e, p)}
                    disabled={!p.inStock}
                    title={!p.inStock ? "Немає в наявності" : "Додати в корзину"}
                  >
                    {addedId === p._id ? "Додано" : "В корзину"}
                  </button>

                  <Link className="btn" to={`/parts/${p._id}`}>
                    Детальніше
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div style={{ height: 14 }} />

          <div className="card" style={{ padding: 12 }}>
            <div className="row">
              <button className="btn" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Назад
              </button>

              <div className="badge" style={{ alignSelf: "center", textAlign: "center" }}>
                Сторінка {page} / {pages}
              </div>

              <button className="btn" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
                Далі
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
