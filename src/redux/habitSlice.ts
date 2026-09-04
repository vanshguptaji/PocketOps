export interface Habit {
    id: string;
    title: string;
    done: boolean;
    streak: number;
    best: number;
    frequency: string;
    time?: string;
    segments: boolean[];
    completeDates: string[];
}
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    habits: [] as Habit[],
};

const habitSlice = createSlice({
    name: "habits",
    initialState,
    reducers: {
        addHabit: (state, action) => {
            state.habits.push(action.payload);
        },
        toggleHabit: (state, action) => {
            const habit = state.habits.find(h => h.id === action.payload);
            if (habit) {
                habit.done = !habit.done;
                habit.completeDates.push(new Date().toISOString());
            }
        },
        removeHabit: (state, action) => {
            state.habits = state.habits.filter(h => h.id !== action.payload);
        },
        editHabit: (state, action) => {
            const { id } = action.payload;
            const habit = state.habits.find(h => h.id === id);
            if (habit) {
                habit.title = action.payload.title;
                habit.done = action.payload.done;
                habit.streak = action.payload.streak;
                habit.best = action.payload.best;
                habit.frequency = action.payload.frequency;
                habit.time = action.payload.time;
                habit.segments = action.payload.segments;
            }
        },
        clearHabits: (state) => {
            state.habits = [];
        },
        
    },
});

export const { addHabit, toggleHabit } = habitSlice.actions;

export default habitSlice.reducer;