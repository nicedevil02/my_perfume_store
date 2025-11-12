import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  variantId: string;
  productId: string;
  productName: string;
  productSlug: string;
  productImage: string;
  brandName: string;
  size: number;
  price: number;
  quantity: number;
  stock: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.variantId === newItem.variantId
          );

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            const newQty = updatedItems[existingIndex].quantity + newItem.quantity;
            
            if (newQty > newItem.stock) {
              alert(`موجودی کافی نیست. حداکثر: ${newItem.stock}`);
              return state;
            }

            updatedItems[existingIndex].quantity = newQty;
            return { items: updatedItems };
          } else {
            return {
              items: [
                ...state.items,
                { ...newItem, id: `cart_${Date.now()}_${Math.random()}` },
              ],
            };
          }
        });
      },

      removeItem: (variantId) => {
        set((state) => ({
          items: state.items.filter((item) => item.variantId !== variantId),
        }));
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity < 1) return;

        set((state) => {
          const updatedItems = state.items.map((item) => {
            if (item.variantId === variantId) {
              if (quantity > item.stock) {
                alert(`موجودی کافی نیست. حداکثر: ${item.stock}`);
                return item;
              }
              return { ...item, quantity };
            }
            return item;
          });
          return { items: updatedItems };
        });
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
