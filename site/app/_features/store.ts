import { configureStore } from "@reduxjs/toolkit";
import chatbotReducer from './chatbot/chatbotSlice';
import bodySlice from "./body/bodySlice";
import popupCarouselReducer from "./popupCarousel/popupCarouselSlice";

export const store = configureStore({
  reducer: {
    body: bodySlice,
    popupCarousel: popupCarouselReducer,
    chatbot: chatbotReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ["popupCarousel"],
        ignoredActions: ["popupCarousel/setPopupCarousel"],
      },
    }),
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
