import { useState, useEffect } from 'react';

interface OfflineData {
  sessions: any[];
  progress: any[];
  preferences: any;
}

const DB_NAME = 'AsanoGaOfflineDB';
const DB_VERSION = 1;
const STORES = {
  sessions: 'sessions',
  progress: 'progress', 
  preferences: 'preferences'
};

export function useOfflineStorage() {
  const [isSupported, setIsSupported] = useState(false);
  const [db, setDb] = useState<IDBDatabase | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'indexedDB' in window) {
      setIsSupported(true);
      initDB();
    }
  }, []);

  const initDB = () => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => {
      console.error('Failed to open IndexedDB');
    };

    request.onsuccess = () => {
      setDb(request.result);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      
      Object.values(STORES).forEach(storeName => {
        if (!database.objectStoreNames.contains(storeName)) {
          const store = database.createObjectStore(storeName, { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      });
    };
  };

  const saveData = async (storeName: string, data: any) => {
    if (!db) return false;
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add({ ...data, timestamp: Date.now() });
      
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(false);
    });
  };

  const getData = async (storeName: string): Promise<any[]> => {
    if (!db) return [];
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject([]);
    });
  };

  const clearStore = async (storeName: string) => {
    if (!db) return false;
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();
      
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(false);
    });
  };

  return {
    isSupported,
    saveData,
    getData,
    clearStore,
    stores: STORES
  };
}