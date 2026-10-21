import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "./todoSlice";
import habitReducer from "./habitSlice";
import noteReducer from "./noteSlice";
import expenseReducer from "./expenseSlice";

export const store = configureStore({
    reducer: {
        todo: todoReducer,
        habit: habitReducer,
        note: noteReducer,
        expense: expenseReducer,
    }
})
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;