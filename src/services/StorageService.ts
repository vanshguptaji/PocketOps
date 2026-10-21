import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_VERSION = 1;

export const StorageKeys = {
    TODOS: '@pocketops/todos',
    HABITS: '@pocketops/habits',
    NOTES: '@pocketops/notes',
    EXPENSES: '@pocketops/expenses',
    APP_VERSION: '@pocketops/version',
} as const;

export async function saveData<T>(key: string, data: T): Promise<void> {
    try {
        const json = JSON.stringify(data);
        await AsyncStorage.setItem(key, json);
    } catch (error) {
        console.error(`[StorageService] Failed to save ${key}:`, error);
    }
}

export async function loadData<T>(key: string): Promise<T | null> {
    try {
        const json = await AsyncStorage.getItem(key);
        if (json === null) return null;
        return JSON.parse(json) as T;
    } catch (error) {
        console.error(`[StorageService] Failed to load ${key}:`, error);
        return null;
    }
}

export async function removeData(key: string): Promise<void> {
    try {
        await AsyncStorage.removeItem(key);
    } catch (error) {
        console.error(`[StorageService] Failed to remove ${key}:`, error);
    }
}

export async function clearAll(): Promise<void> {
    try {
        const keys = Object.values(StorageKeys);
        await Promise.all(keys.map((key) => AsyncStorage.removeItem(key)));
    } catch (error) {
        console.error('[StorageService] Failed to clear all:', error);
    }
}

/**
 * Check and run migrations if needed.
 * Currently at version 1 — no migrations needed.
 */
export async function checkVersion(): Promise<void> {
    try {
        const storedVersion = await loadData<number>(StorageKeys.APP_VERSION);
        if (storedVersion === null || storedVersion < STORAGE_VERSION) {
            // Future migrations go here
            // if (storedVersion === null || storedVersion < 2) { migrateV1toV2(); }
            await saveData(StorageKeys.APP_VERSION, STORAGE_VERSION);
        }
    } catch (error) {
        console.error('[StorageService] Version check failed:', error);
    }
}
