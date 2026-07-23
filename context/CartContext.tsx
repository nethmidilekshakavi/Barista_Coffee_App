import React, { createContext, useContext, useState, useMemo } from "react";

export type CartItem = {
  id: string; // composite id, e.g. "1-Short" (productId-optionLabel)
  name: string; // e.g. "Cappuccino Short"
  price: number;
  image: any;
  quantity: number;
};

type AddItemInput = Omit<CartItem, "quantity">;

type CartContextType = {
  items: CartItem[];
  addItem: (item: AddItemInput) => void;
  removeItem: (id: string) => void;
  incrementQty: (id: string) => void;
  decrementQty: (id: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  packagingCharge: number;
  total: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

// Packaging charge is 10% of the subtotal — adjust here if the business rule changes.
const PACKAGING_RATE = 0.1;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: AddItemInput) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const incrementQty = (id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i)));
  };

  const decrementQty = (id: string) => {
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items]);
  const packagingCharge = useMemo(() => Math.round(subtotal * PACKAGING_RATE * 100) / 100, [subtotal]);
  const total = useMemo(() => subtotal + packagingCharge, [subtotal, packagingCharge]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        incrementQty,
        decrementQty,
        clearCart,
        totalItems,
        subtotal,
        packagingCharge,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}