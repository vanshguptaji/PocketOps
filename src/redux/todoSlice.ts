import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";

export type Priority = "low" | "medium" | "high";

export interface Todo {
    id: string;
    title: string;
    completed: boolean;
    priority: Priority;
    dueLabel: string;
    section: 'Today' | 'Tomorrow';
}

interface TodoState {
    todos: Todo[];
}

const initialState: TodoState = {
    todos: [],
};

interface AddTodoPayload {
    title: string;
    completed: boolean;
    priority: Priority;
    dueLabel: string;
    section: 'Today' | 'Tomorrow';
}

interface UpdateTodoPayload extends AddTodoPayload {
    id: string;
}

interface ToggleTodoPayload {
    id: string;
}

interface SetPriorityPayload {
    id: string;
    priority: Priority;
}

interface SetDueDatePayload {
    id: string;
    dueLabel: string;
}

export const todoSlice = createSlice({
    name: "todo",
    initialState,
    reducers: {
        addTodo: (state, action: PayloadAction<AddTodoPayload>) => {
            const todo: Todo = {
                id: nanoid(),
                title: action.payload.title,
                completed: action.payload.completed,
                priority: action.payload.priority,
                dueLabel: action.payload.dueLabel,
                section: action.payload.section,
            };
            state.todos.push(todo);
        },
        removeTodo: (state, action: PayloadAction<string>) => {
            state.todos = state.todos.filter((todo) => todo.id !== action.payload);
        },
        updateTodo: (state, action: PayloadAction<UpdateTodoPayload>) => {
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
        toggleTodo: (state, action: PayloadAction<ToggleTodoPayload>) => {
            const id = action.payload.id;
            const todo = state.todos.find((todo) => todo.id === id);
            if (todo) {
                todo.completed = !todo.completed;
            }
        },
        setPriority: (state, action: PayloadAction<SetPriorityPayload>) => {
            const id = action.payload.id;
            const todo = state.todos.find((todo) => todo.id === id);
            if (todo) {
                todo.priority = action.payload.priority;
            }
        },
        setDueDate: (state, action: PayloadAction<SetDueDatePayload>) => {
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
        },
    },
});

export const {
    addTodo,
    removeTodo,
    updateTodo,
    toggleTodo,
    setPriority,
    setDueDate,
    clearCompletedTodo,
    clearAllTodos,
} = todoSlice.actions;

export default todoSlice.reducer;