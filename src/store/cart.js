const KEY = "parts_cart_v1";

export function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveCart(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function addToCart(part, qty = 1) {
  const items = loadCart();
  const idx = items.findIndex((x) => x.partId === part._id);
  if (idx >= 0) items[idx].qty += qty;
  else {
    items.push({
      partId: part._id,
      title: part.title,
      price: part.price,
      category: part.categoryId?.name,
      brand: part.brandId?.name,
      qty,
    });
  }
  saveCart(items);
  return items;
}

export function setQty(partId, qty) {
  const items = loadCart().map((x) => (x.partId === partId ? { ...x, qty } : x));
  const filtered = items.filter((x) => x.qty > 0);
  saveCart(filtered);
  return filtered;
}

export function removeFromCart(partId) {
  const items = loadCart().filter((x) => x.partId !== partId);
  saveCart(items);
  return items;
}

export function clearCart() {
  saveCart([]);
  return [];
}

export function cartTotals(items) {
  const totalQty = items.reduce((s, x) => s + (Number(x.qty) || 0), 0);
  const totalSum = items.reduce((s, x) => s + (Number(x.qty) || 0) * (Number(x.price) || 0), 0);
  return { totalQty, totalSum };
}
