import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  discount: number;
  count: number;
  options?: { key: string; value: string }[];
}

interface CartState {
  items: CartItem[];
  response: number;
}

const initialState: CartState = {
  items: [],
  response: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{
        id: number;
        name: string;
        price: number;
        quantity: number;
        image: string;
        discount: number;
        count: number;
        options?: { key: string; value: any }[];
      }>
    ) => {
      if (!state.items) {
        state.items = [];
      }

      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        existingItem.options = action.payload.options ?? [];

        if (existingItem.quantity < action.payload.count) {
          existingItem.quantity += action.payload.quantity;

          state.response = 200;
        } else {
          state.response = 400;
        }
      } else {
        state.items.push({
          id: action.payload.id,
          name: action.payload.name,
          price: action.payload.price,
          quantity: action.payload.quantity,
          image: action.payload.image,
          discount: action.payload.discount,
          count: action.payload.count,
          options: action.payload.options ?? [],
        });
        state.response = 200;
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      // state.error = null;
    },
    clearCart: (state) => {
      state.items = [];
      // state.error = null;
    },

    clearResponse: (state) => {
      state.response = 0;
    },

    // updatePrice: (
    //   state,
    //   action: PayloadAction<{ id: number; price: number }>
    // ) => {
    //   const item = state.items.find((item) => item.id === action.payload.id);
    //   if (item) {
    //     item.price = action.payload.price;
    //   }
    // },

    updatePriceAndDiscount: (
      state,
      action: PayloadAction<{ id: number; price: number; discount: number }>
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.price = action.payload.price;
        item.discount = action.payload.discount;
      }
      // state.error = null;
    },

    decreaseQuantity: (state, action: PayloadAction<number>) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload
      );

      if (existingItem) {
        if (existingItem.quantity > 1) {
          existingItem.quantity -= 1;
          // state.error = null;
        } else {
          // If the quantity is 1, remove the item from the cart
          state.items = state.items.filter(
            (item) => item.id !== action.payload
          );
          // state.error = null;
        }
      }
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,

  decreaseQuantity,
  updatePriceAndDiscount,
  clearResponse,
} = cartSlice.actions;
export default cartSlice.reducer;
