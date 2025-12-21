import { categoryImagesBySlug, defaultCategoryImage } from "../assets/categoryImages";

export default function CategoryImage({ category, height = 130, alt = "category" }) {
  // category може бути об'єктом (populate) або просто id, тому страхуємось
  const slug = category?.slug;
  const src = (slug && categoryImagesBySlug[slug]) ? categoryImagesBySlug[slug] : defaultCategoryImage;

  return (
    <div
      style={{
        height,
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,.10)",
        background: "rgba(255,255,255,.04)",
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        loading="lazy"
      />
    </div>
  );
}
