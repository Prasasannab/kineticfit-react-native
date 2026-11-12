import { MMKV } from 'react-native-mmkv';

/**
 * KineticFit - Synchronous Offline-First MMKV Storage Service
 *
 * Built with WeChat C++ MMKV engine for <0.05ms synchronous read/writes.
 * Replaces slow, asynchronous AsyncStorage to eliminate UI jank and flickers.
 */

export const STORAGE_KEYS = {
  THEME_MODE: 'kf_theme_mode',
  USER_PROFILE: 'kf_user_profile',
  USER_PREFERENCES: 'kf_user_preferences',
  CACHED_TRAINERS: 'kf_cached_trainers',
  BOOKING_HISTORY: 'kf_booking_history',
  ACTIVE_CHECKOUT_LOCK: 'kf_active_checkout_lock',
  DAILY_ACTIVITY_METRICS: 'kf_daily_activity_metrics',
  OFFLINE_WORKOUT_ROUTINES: 'kf_offline_workout_routines',
  FAVORITE_TRAINER_IDS: 'kf_favorite_trainer_ids',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS] | string;

export interface IAppStorage {
  getString(key: StorageKey): string | undefined;
  setString(key: StorageKey, value: string): void;
  getNumber(key: StorageKey): number | undefined;
  setNumber(key: StorageKey, value: number): void;
  getBoolean(key: StorageKey): boolean | undefined;
  setBoolean(key: StorageKey, value: boolean): void;
  getObject<T>(key: StorageKey): T | null;
  setObject<T>(key: StorageKey, value: T): void;
  delete(key: StorageKey): void;
  contains(key: StorageKey): boolean;
  getAllKeys(): string[];
  clearAll(): void;
}

/**
 * In-memory fallback adapter for Node/Jest or non-native web preview environments
 */
class MemoryStorageAdapter implements IAppStorage {
  private memoryMap = new Map<string, string>();

  getString(key: StorageKey): string | undefined {
    return this.memoryMap.get(key);
  }

  setString(key: StorageKey, value: string): void {
    this.memoryMap.set(key, value);
  }

  getNumber(key: StorageKey): number | undefined {
    const val = this.memoryMap.get(key);
    return val !== undefined ? Number(val) : undefined;
  }

  setNumber(key: StorageKey, value: number): void {
    this.memoryMap.set(key, String(value));
  }

  getBoolean(key: StorageKey): boolean | undefined {
    const val = this.memoryMap.get(key);
    if (val === undefined) return undefined;
    return val === 'true';
  }

  setBoolean(key: StorageKey, value: boolean): void {
    this.memoryMap.set(key, String(value));
  }

  getObject<T>(key: StorageKey): T | null {
    const raw = this.getString(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  setObject<T>(key: StorageKey, value: T): void {
    this.setString(key, JSON.stringify(value));
  }

  delete(key: StorageKey): void {
    this.memoryMap.delete(key);
  }

  contains(key: StorageKey): boolean {
    return this.memoryMap.has(key);
  }

  getAllKeys(): string[] {
    return Array.from(this.memoryMap.keys());
  }

  clearAll(): void {
    this.memoryMap.clear();
  }
}

/**
 * Native MMKV Storage implementation
 */
class NativeMMKVStorage implements IAppStorage {
  private mmkv: MMKV;

  constructor() {
    this.mmkv = new MMKV({
      id: 'kineticfit-main-storage',
    });
  }

  getString(key: StorageKey): string | undefined {
    return this.mmkv.getString(key);
  }

  setString(key: StorageKey, value: string): void {
    this.mmkv.set(key, value);
  }

  getNumber(key: StorageKey): number | undefined {
    return this.mmkv.getNumber(key);
  }

  setNumber(key: StorageKey, value: number): void {
    this.mmkv.set(key, value);
  }

  getBoolean(key: StorageKey): boolean | undefined {
    return this.mmkv.getBoolean(key);
  }

  setBoolean(key: StorageKey, value: boolean): void {
    this.mmkv.set(key, value);
  }

  getObject<T>(key: StorageKey): T | null {
    const raw = this.mmkv.getString(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  setObject<T>(key: StorageKey, value: T): void {
    this.mmkv.set(key, JSON.stringify(value));
  }

  delete(key: StorageKey): void {
    this.mmkv.delete(key);
  }

  contains(key: StorageKey): boolean {
    return this.mmkv.contains(key);
  }

  getAllKeys(): string[] {
    return this.mmkv.getAllKeys();
  }

  clearAll(): void {
    this.mmkv.clearAll();
  }
}

function initializeStorage(): IAppStorage {
  try {
    return new NativeMMKVStorage();
  } catch (err) {
    // Falls back gracefully in mock/test, Expo Go, or unsupported environments without noisy LogBox banners
    if (__DEV__) {
      console.log('[KineticFit Storage] In-memory synchronous storage active for Expo Go session');
    }
    return new MemoryStorageAdapter();
  }
}

export const appStorage: IAppStorage = initializeStorage();

/**
 * High-level typed caching helpers
 */
export const storageService = {
  // User profile
  getUserProfile: <T>(): T | null => appStorage.getObject<T>(STORAGE_KEYS.USER_PROFILE),
  setUserProfile: <T>(profile: T): void => appStorage.setObject(STORAGE_KEYS.USER_PROFILE, profile),

  // Cached trainers
  getCachedTrainers: <T>(): T[] | null =>
    appStorage.getObject<T[]>(STORAGE_KEYS.CACHED_TRAINERS),
  setCachedTrainers: <T>(trainers: T[]): void =>
    appStorage.setObject(STORAGE_KEYS.CACHED_TRAINERS, trainers),

  // Daily activity
  getCachedActivity: <T>(): T | null =>
    appStorage.getObject<T>(STORAGE_KEYS.DAILY_ACTIVITY_METRICS),
  setCachedActivity: <T>(activity: T): void =>
    appStorage.setObject(STORAGE_KEYS.DAILY_ACTIVITY_METRICS, activity),

  // Favorites
  getFavoriteTrainerIds: (): string[] =>
    appStorage.getObject<string[]>(STORAGE_KEYS.FAVORITE_TRAINER_IDS) ?? [],
  toggleFavoriteTrainerId: (trainerId: string): string[] => {
    const current = appStorage.getObject<string[]>(STORAGE_KEYS.FAVORITE_TRAINER_IDS) ?? [];
    const exists = current.includes(trainerId);
    const updated = exists ? current.filter((id) => id !== trainerId) : [...current, trainerId];
    appStorage.setObject(STORAGE_KEYS.FAVORITE_TRAINER_IDS, updated);
    return updated;
  },

  // Reset
  clearCache: (): void => appStorage.clearAll(),
};
