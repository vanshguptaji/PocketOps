import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "./todoSlice";
import habitReducer from "./habitSlice"

export const store = configureStore({
    reducer: {
        todo: todoReducer,
        habit: habitReducer,
    }
})
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;