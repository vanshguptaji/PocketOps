import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
    todos: []
}

export const todoSlice = createSlice ({
    name: 'todo',
    initialState,
    reducers:{
        addTodo: (state, action) => {
            const todo = {
                id: nanoid(),
                title: action.payload.title,
                completed: action.payload.completed,
                priority: action.payload.priority,
                dueLabel: action.payload.dueLabel,
                section: action.payload.section,
            }
            state.todos.push(todo)
        },
        removeTodo: (state, action) => {
            state.todos = state.todos.filter((todo) => todo.id !== action.payload )
        },
        updateTodo: (state, action) => {
            const id = action.payload.id;
            const todo = state.todos.find((todo) => todo.id === id);
            if (todo) {
                todo.title = action.payload.title;
                todo.completed = action.payload.completed;
                todo.priority = action.payload.priority;
                todo.dueLabel = action.payload.dueLabel;
                todo.section = action.payload.section;
            }
        },
        toggleTodo: (state, action) => {
            const id = action.payload.id;
            const todo = state.todos.find((todo) => todo.id === id);
            if (todo) {
                todo.completed = !todo.completed;
            }
        },
        setPriority: (state, action) => {
            const id = action.payload.id;
            const todo = state.todos.find((todo) => todo.id === id);
            if (todo) {
                todo.priority = action.payload.priority;
            }
        },
        setDueDate: (state, action) => {
            const id = action.payload.id;
            const todo = state.todos.find((todo) => todo.id === id);
            if (todo) {
                todo.dueLabel = action.payload.dueLabel;
            }
        },
        clearCompletedTodo: (state) => {
            state.todos = state.todos.filter((todo) => !todo.completed);
        },
        clearAllTodos: (state) => {
            state.todos = [];
        }
    }
})

export const {addTodo, removeTodo, updateTodo, toggleTodo, setPriority, setDueDate, clearCompletedTodo, clearAllTodos} = todoSlice.actions

export default todoSlice.reducer