import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchProductsItemsApi,
  createProductAPI,
  editProductApi,
  deleteProductApi
} from "./productApi";
import type { Product } from "./productType";

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

// Fetch all products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, thunkAPI) => {
    try {
      return await fetchProductsItemsApi();
    } catch {
      return thunkAPI.rejectWithValue("Failed to fetch products");
    }
  }
);

//create
export const createProduct = createAsyncThunk(
  "products/create",
  async (product: Product, thunkAPI) => {
    try {
      return await createProductAPI(product);
      
    } catch  {
      return thunkAPI.rejectWithValue("Failed to create product");
    }
  }
);
// editProduct now accepts { id, formData }
export const editProduct = createAsyncThunk(
  "products/edit",
  async (
    payload: { id: number; formData: FormData },
    thunkAPI
  ) => {
    try {
      // Destructure payload
      const { id, formData } = payload;

      // Pass both to your API call
      return await editProductApi(id, formData);
    } catch  {
      return thunkAPI.rejectWithValue("Failed to edit product");
    }
  }
);

// deleteProduct stays the same
export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id: number, thunkAPI) => {
    try {
      return await deleteProductApi(id);
    } catch {
      return thunkAPI.rejectWithValue("Failed to delete product");
    }
  }
);


const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
      builder
      //create
      .addCase(createProduct.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload); // ✅ Correct usage
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
     // edit
    builder
      .addCase(editProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload; // ✅ update instead of push
        }
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    //delete
    builder
    .addCase(deleteProduct.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(deleteProduct.fulfilled, (state, action) => {
  state.loading = false;
  // Remove the deleted product from state by ID
  state.products = state.products.filter(
    (product) => product.id !== action.payload
  );
})
.addCase(deleteProduct.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload as string;
});

    

  },
});

export default productSlice.reducer;

