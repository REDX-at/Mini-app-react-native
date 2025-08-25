import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  visible: boolean;
  type: "editProductTitle" | null;
  payload?: any; // e.g., product id or data
}

const initialState: ModalState = {
  visible: false,
  type: null,
  payload: undefined,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openModal: (
      state,
      action: PayloadAction<{ type: ModalState["type"]; payload?: any }>
    ) => {
      state.visible = true;
      state.type = action.payload.type;
      state.payload = action.payload.payload;
    },
    closeModal: (state) => {
      state.visible = false;
      state.type = null;
      state.payload = undefined;
    },
  },
});

export const { openModal, closeModal } = uiSlice.actions;
export default uiSlice.reducer;
