import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatbotMessage {
  sender: "self" | "bot";
  message: string;
  date: number;
  // chatInputValue: string;
}

export interface ChatbotState {
  isActive: boolean;
  messages: ChatbotMessage[];
  chatInputValue: string;
}

const initialState: ChatbotState = {
  isActive: false,
  messages: [],
  chatInputValue: "",
};

const chatbotSlice = createSlice({
  name: "chatbotCarousel",
  initialState,
  reducers: {
    setChatbotIsActive: (state, payload: PayloadAction<boolean>) => {
      state.isActive = payload.payload;
    },
    setChatbotInput: (state, payload: PayloadAction<string>) => {
      state.chatInputValue = payload.payload;
    },
    addMessage: (state, action: PayloadAction<ChatbotMessage>) => {
      state.messages.push(action.payload);
    },
  },
});

export const { setChatbotIsActive, setChatbotInput, addMessage } =
  chatbotSlice.actions;

export default chatbotSlice.reducer;
