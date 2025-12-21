import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CatalogApi } from "../api/catalog";
import CategoryImage from "../components/CategoryImage";
import { addToCart } from "../store/cart";


export default function PartPage() {
  const { id } = useParams();
  const [part, setPart] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    CatalogApi.getPart(id)
      .then(setPart)
      .catch(() => setErr("Запчастину не знайдено"));
  }, [id]);

  if (err) return <p>{err}</p>;
  if (!part) return <p>Завантаження…</p>;

  return (
    <div>
      <Link to="/">← Назад</Link>
      <h2 style={{ marginTop: 8 }}>{part.title}</h2>
      <CategoryImage 
      category={part.categoryId} 
      height={220} 
      alt={part.categoryId?.name || "Категорія"} 
      />

<div style={{ height: 12 }} />
      <p><b>Ціна:</b> {part.price} грн</p>
      <p><b>Артикул:</b> {part.sku}</p>
      <p><b>Категорія:</b> {part.categoryId?.name}</p>
      <p><b>Бренд:</b> {part.brandId?.name}</p>
      <p><b>Наявність:</b> {part.inStock ? `є (${part.stock})` : "немає"}</p>
      <div style={{ margin: "14px 0", display: "flex", gap: 10 }}>
       <button
         className="btn primary"
         disabled={!part.inStock}
         onClick={() => addToCart(part, 1)}
      >
         {part.inStock ? "Додати в корзину" : "Немає в наявності"}
      </button>

      <Link className="btn" to="/cart">
        Перейти в корзину
      </Link>
    </div>
      {part.compatibility ? <p><b>Сумісність:</b> {part.compatibility}</p> : null}
      {part.description ? <p><b>Опис:</b> {part.description}</p> : null}
    </div>
  );
}
