import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../services/api";
import { Product } from "../types/product";

interface ProductsState {
  items: Product[];
  loading: boolean;
  error?: string;
  skip: number;
  hasMore: boolean;
}

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: undefined,
  skip: 0,
  hasMore: true,
};

// Thunk to fetch products
export const fetchProducts = createAsyncThunk<
  { products: Product[]; skip: number; total: number },
  undefined,
  { rejectValue: string }
>("products/fetchProducts", async (_, { rejectWithValue, getState }) => {
  try {
    const state = getState() as { products: ProductsState };
    const skip = state.products.skip;

    const response = await api.get(`/products?limit=20&skip=${skip}`);
    return {
      products: response.data.products,
      skip,
      total: response.data.total,
    };
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch products"
    );
  }
});

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    resetProducts: (state) => {
      state.items = [];
      state.skip = 0;
      state.hasMore = true;
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(
        fetchProducts.fulfilled,
        (
          state,
          action: PayloadAction<{
            products: Product[];
            skip: number;
            total: number;
          }>
        ) => {
          state.loading = false;
          state.items = [...state.items, ...action.payload.products];
          state.skip += action.payload.products.length;
          state.hasMore = state.items.length < action.payload.total;
        }
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetProducts } = productsSlice.actions;
export default productsSlice.reducer;
