import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";

export type ExpenseCategory =
    | 'FOOD'
    | 'TRANSPORT'
    | 'SHOPPING'
    | 'BILLS'
    | 'ENTERTAINMENT'
    | 'HEALTH'
    | 'EDUCATION'
    | 'OTHER';

export const EXPENSE_CATEGORIES: { key: ExpenseCategory; icon: string }[] = [
    { key: 'FOOD', icon: '⊡' },
    { key: 'TRANSPORT', icon: '⊞' },
    { key: 'SHOPPING', icon: '⊟' },
    { key: 'BILLS', icon: '⊠' },
    { key: 'ENTERTAINMENT', icon: '⊡' },
    { key: 'HEALTH', icon: '⊕' },
    { key: 'EDUCATION', icon: '⊗' },
    { key: 'OTHER', icon: '⊘' },
];

export interface Expense {
    id: string;
    title: string;
    amount: number;
    category: ExpenseCategory;
    date: string; // ISO date string YYYY-MM-DD
    note?: string;
    createdAt: string;
}

interface ExpenseState {
    expenses: Expense[];
}

const initialState: ExpenseState = {
    expenses: [],
};

interface AddExpensePayload {
    title: string;
    amount: number;
    category: ExpenseCategory;
    date: string;
    note?: string;
}

interface UpdateExpensePayload extends AddExpensePayload {
    id: string;
}

const expenseSlice = createSlice({
    name: "expense",
    initialState,
    reducers: {
        addExpense: (state, action: PayloadAction<AddExpensePayload>) => {
            const expense: Expense = {
                id: nanoid(),
                title: action.payload.title,
                amount: action.payload.amount,
                category: action.payload.category,
                date: action.payload.date,
                note: action.payload.note,
                createdAt: new Date().toISOString(),
            };
            state.expenses.unshift(expense);
        },
        updateExpense: (state, action: PayloadAction<UpdateExpensePayload>) => {
            const expense = state.expenses.find((e) => e.id === action.payload.id);
            if (expense) {
                expense.title = action.payload.title;
                expense.amount = action.payload.amount;
                expense.category = action.payload.category;
                expense.date = action.payload.date;
                expense.note = action.payload.note;
            }
        },
        removeExpense: (state, action: PayloadAction<string>) => {
            state.expenses = state.expenses.filter((e) => e.id !== action.payload);
        },
        setExpenses: (state, action: PayloadAction<Expense[]>) => {
            state.expenses = action.payload;
        },
        clearExpenses: (state) => {
            state.expenses = [];
        },
    },
});

export const { addExpense, updateExpense, removeExpense, setExpenses, clearExpenses } = expenseSlice.actions;

export default expenseSlice.reducer;
