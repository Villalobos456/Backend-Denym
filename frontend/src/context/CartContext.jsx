// src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ds_cart') || '[]'); } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('ds_cart', JSON.stringify(items));
    window.dispatchEvent(new Event('cartchange'));
  }, [items]);

  const addItem = (product, qty = 1, talla = null, color = null) => {
    setItems(prev => {
      const key = `${product.product_id}-${talla}-${color}`;
      const exists = prev.find(i => `${i.product_id}-${i.talla}-${i.color}` === key);
      if (exists) {
        return prev.map(i => `${i.product_id}-${i.talla}-${i.color}` === key
          ? { ...i, quantity: i.quantity + qty, subtotal: i.price * (i.quantity + qty) }
          : i
        );
      }
      return [...prev, {
        product_id: product.product_id,
        name:       product.nombre,
        price:      parseFloat(product.precio),
        image_url:  product.imagen_url,
        quantity:   qty,
        talla, color,
        subtotal:   parseFloat(product.precio) * qty
      }];
    });
  };

  const updateQty = (product_id, talla, color, qty) => {
    if (qty <= 0) return removeItem(product_id, talla, color);
    setItems(prev => prev.map(i =>
      i.product_id === product_id && i.talla === talla && i.color === color
        ? { ...i, quantity: qty, subtotal: i.price * qty }
        : i
    ));
  };

  const removeItem = (product_id, talla, color) => {
    setItems(prev => prev.filter(i =>
      !(i.product_id === product_id && i.talla === talla && i.color === color)
    ));
  };

  const clearCart = () => setItems([]);

  const subtotal   = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, updateQty, removeItem, clearCart, subtotal, totalItems }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
