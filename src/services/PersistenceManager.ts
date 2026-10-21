import { store, AppDispatch } from '../redux/store';
import { setTodos, Todo } from '../redux/todoSlice';
import { setHabits, Habit } from '../redux/habitSlice';
import { setNotes, Note } from '../redux/noteSlice';
import { setExpenses, Expense } from '../redux/expenseSlice';
import { saveData, loadData, checkVersion, StorageKeys } from './StorageService';

let saveTimeout: ReturnType<typeof setTimeout> | null = null;
let unsubscribe: (() => void) | null = null;

/**
 * Load all persisted data from AsyncStorage and dispatch to Redux store.
 * Returns true when hydration is complete.
 */
export async function hydrateStore(dispatch: AppDispatch): Promise<void> {
    await checkVersion();

    const [todos, habits, notes, expenses] = await Promise.all([
        loadData<Todo[]>(StorageKeys.TODOS),
        loadData<Habit[]>(StorageKeys.HABITS),
        loadData<Note[]>(StorageKeys.NOTES),
        loadData<Expense[]>(StorageKeys.EXPENSES),
    ]);

    if (todos) dispatch(setTodos(todos));
    if (habits) dispatch(setHabits(habits));
    if (notes) dispatch(setNotes(notes));
    if (expenses) dispatch(setExpenses(expenses));
}

/**
 * Subscribe to Redux store changes and auto-save to AsyncStorage.
 * Uses a 1-second debounce to batch rapid changes.
 */
export function startPersistence(): void {
    if (unsubscribe) return; // Already subscribed

    let lastState = store.getState();

    unsubscribe = store.subscribe(() => {
        const currentState = store.getState();

        // Only save if something actually changed
        if (currentState === lastState) return;
        lastState = currentState;

        if (saveTimeout) clearTimeout(saveTimeout);
        saveTimeout = setTimeout(async () => {
            try {
                await Promise.all([
                    saveData(StorageKeys.TODOS, currentState.todo.todos),
                    saveData(StorageKeys.HABITS, currentState.habit.habits),
                    saveData(StorageKeys.NOTES, currentState.note.notes),
                    saveData(StorageKeys.EXPENSES, currentState.expense.expenses),
                ]);
            } catch (error) {
                console.error('[PersistenceManager] Auto-save failed:', error);
            }
        }, 1000);
    });
}

/**
 * Stop auto-saving. Call this on app teardown if needed.
 */
export function stopPersistence(): void {
    if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
    }
    if (saveTimeout) {
        clearTimeout(saveTimeout);
        saveTimeout = null;
    }
}
