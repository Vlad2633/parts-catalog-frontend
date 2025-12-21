import { useEffect, useState } from "react";
import { CatalogApi } from "../api/catalog";

export default function AdminPage() {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [catName, setCatName] = useState("");
  const [catSlug, setCatSlug] = useState("");

  const [brandName, setBrandName] = useState("");
  const [brandSlug, setBrandSlug] = useState("");

  const [pTitle, setPTitle] = useState("");
  const [pSku, setPSku] = useState("");
  const [pPrice, setPPrice] = useState(0);
  const [pStock, setPStock] = useState(0);
  const [pCategoryId, setPCategoryId] = useState("");
  const [pBrandId, setPBrandId] = useState("");
  const [pCompat, setPCompat] = useState("");
  const [pDesc, setPDesc] = useState("");

  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function reload() {
    const [c, b] = await Promise.all([CatalogApi.getCategories(), CatalogApi.getBrands()]);
    setCategories(c);
    setBrands(b);
    if (!pCategoryId && c[0]?._id) setPCategoryId(c[0]._id);
    if (!pBrandId && b[0]?._id) setPBrandId(b[0]._id);
  }

  useEffect(() => {
    reload().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addCategory = async () => {
    setMsg(""); setErr("");
    try {
      await CatalogApi.createCategory({ name: catName, slug: catSlug });
      setMsg("Категорію додано");
      setCatName(""); setCatSlug("");
      await reload();
    } catch (e) {
      setErr(e?.response?.data?.message || "Помилка");
    }
  };

  const addBrand = async () => {
    setMsg(""); setErr("");
    try {
      await CatalogApi.createBrand({ name: brandName, slug: brandSlug });
      setMsg("Бренд додано");
      setBrandName(""); setBrandSlug("");
      await reload();
    } catch (e) {
      setErr(e?.response?.data?.message || "Помилка");
    }
  };

  const addPart = async () => {
    setMsg(""); setErr("");
    try {
      await CatalogApi.createPart({
        title: pTitle,
        description: pDesc,
        sku: pSku,
        price: Number(pPrice),
        stock: Number(pStock),
        categoryId: pCategoryId,
        brandId: pBrandId,
        compatibility: pCompat,
        images: [],
      });
      setMsg("Запчастину додано");
      setPTitle(""); setPSku(""); setPPrice(0); setPStock(0); setPCompat(""); setPDesc("");
    } catch (e) {
      setErr(e?.response?.data?.message || "Помилка");
    }
  };

  return (
    <div style={{ maxWidth: 760 }}>
      <h2>Адмін-панель</h2>
      {msg ? <div style={{ color: "green" }}>{msg}</div> : null}
      {err ? <div style={{ color: "crimson" }}>{err}</div> : null}

      <h3>Категорії</h3>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input value={catName} onChange={(e) => setCatName(e.target.value)} placeholder="Назва" />
        <input value={catSlug} onChange={(e) => setCatSlug(e.target.value)} placeholder="slug" />
        <button onClick={addCategory}>Додати</button>
      </div>

      <h3 style={{ marginTop: 16 }}>Бренди</h3>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="Назва" />
        <input value={brandSlug} onChange={(e) => setBrandSlug(e.target.value)} placeholder="slug" />
        <button onClick={addBrand}>Додати</button>
      </div>

      <h3 style={{ marginTop: 16 }}>Додати запчастину</h3>
      <div style={{ display: "grid", gap: 8 }}>
        <input value={pTitle} onChange={(e) => setPTitle(e.target.value)} placeholder="Назва" />
        <input value={pSku} onChange={(e) => setPSku(e.target.value)} placeholder="Артикул (sku)" />

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input value={pPrice} onChange={(e) => setPPrice(e.target.value)} placeholder="Ціна" type="number" />
          <input value={pStock} onChange={(e) => setPStock(e.target.value)} placeholder="К-сть" type="number" />
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <select value={pCategoryId} onChange={(e) => setPCategoryId(e.target.value)}>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <select value={pBrandId} onChange={(e) => setPBrandId(e.target.value)}>
            {brands.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
          </select>
        </div>

        <input value={pCompat} onChange={(e) => setPCompat(e.target.value)} placeholder="Сумісність (рядок)" />
        <textarea value={pDesc} onChange={(e) => setPDesc(e.target.value)} placeholder="Опис" rows={4} />
        <button onClick={addPart}>Створити запчастину</button>
      </div>
    </div>
  );
}
