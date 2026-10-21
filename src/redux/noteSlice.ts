import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";

export interface Note {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

interface NoteState {
    notes: Note[];
}

const initialState: NoteState = {
    notes: [],
};

interface AddNotePayload {
    title: string;
    content: string;
}

interface UpdateNotePayload {
    id: string;
    title: string;
    content: string;
}

const noteSlice = createSlice({
    name: "note",
    initialState,
    reducers: {
        addNote: (state, action: PayloadAction<AddNotePayload>) => {
            const now = new Date().toISOString();
            const note: Note = {
                id: nanoid(),
                title: action.payload.title,
                content: action.payload.content,
                createdAt: now,
                updatedAt: now,
            };
            state.notes.unshift(note);
        },
        updateNote: (state, action: PayloadAction<UpdateNotePayload>) => {
            const note = state.notes.find((n) => n.id === action.payload.id);
            if (note) {
                note.title = action.payload.title;
                note.content = action.payload.content;
                note.updatedAt = new Date().toISOString();
            }
        },
        removeNote: (state, action: PayloadAction<string>) => {
            state.notes = state.notes.filter((n) => n.id !== action.payload);
        },
        setNotes: (state, action: PayloadAction<Note[]>) => {
            state.notes = action.payload;
        },
        clearNotes: (state) => {
            state.notes = [];
        },
    },
});

export const { addNote, updateNote, removeNote, setNotes, clearNotes } = noteSlice.actions;

export default noteSlice.reducer;
