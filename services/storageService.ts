import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageService = {
  /**
   * Recupera un oggetto tipizzato dallo storage locale tramite chiave.
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const raw = await AsyncStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch (error) {
      console.error(`[StorageService] Errore nella lettura di ${key}:`, error);
      return null;
    }
  },

  /**
   * Salva un oggetto tipizzato nello storage locale associandolo a una chiave.
   */
  async set<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`[StorageService] Errore nella scrittura di ${key}:`, error);
    }
  },

  /**
   * Rimuove un elemento dallo storage locale.
   */
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`[StorageService] Errore nella rimozione di ${key}:`, error);
    }
  },
};
