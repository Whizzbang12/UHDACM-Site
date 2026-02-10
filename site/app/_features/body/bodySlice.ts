import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type initialState = {
  overflowY: 'auto' | 'hidden' | 'scroll';
  chatbotDisableScrollOnMobile: boolean
};

const initialState: initialState = {
  overflowY: "auto",
  chatbotDisableScrollOnMobile: false
};

const bodySlice = createSlice({
  name: "body",
  initialState: initialState,
  reducers: {
    setOverflowY: (state, action: PayloadAction<initialState["overflowY"]>) => {
      state.overflowY = action.payload;
    },
    setChatbotDisableScrollOnMobile: (state, action: PayloadAction<initialState['chatbotDisableScrollOnMobile']>) => {
      state.chatbotDisableScrollOnMobile = action.payload;
    }
  },
});

export const { setOverflowY, setChatbotDisableScrollOnMobile } = bodySlice.actions;
export default bodySlice.reducer;
