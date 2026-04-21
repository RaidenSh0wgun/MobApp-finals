const hasLocalStorage = typeof window !== "undefined" && typeof window.localStorage !== "undefined";
let SecureStore: typeof import("expo-secure-store") | null | undefined;

async function loadSecureStore() {
  if (SecureStore !== undefined) {
    return SecureStore;
  }

  try {
    SecureStore = await import("expo-secure-store");
    return SecureStore;
  } catch {
    SecureStore = null;
    return null;
  }
}

async function secureStoreAvailableAsync(): Promise<boolean> {
  if (hasLocalStorage) {
    return true;
  }

  const store = await loadSecureStore();
  if (!store?.isAvailableAsync) {
    return false;
  }

  return store.isAvailableAsync().catch(() => false);
}

export async function getSecureItemAsync(key: string): Promise<string | null> {
  if (hasLocalStorage) {
    try {
      return window.localStorage.getItem(key);
    } catch{ }
  }

  const store = await loadSecureStore();
  if (!store?.getItemAsync) {
    return null;
  }

  const available = await secureStoreAvailableAsync();
  if (!available) {
    return null;
  }

  return store.getItemAsync(key).catch(() => null);
}

export async function setSecureItemAsync(key: string, value: string): Promise<void> {
  if (hasLocalStorage) {
    try {
      window.localStorage.setItem(key, value);
      return;
    } catch{ }
  }

  const store = await loadSecureStore();
  if (!store?.setItemAsync) {
    return;
  }

  const available = await secureStoreAvailableAsync();
  if (!available) {
    return;
  }

  await store.setItemAsync(key, value).catch(() => undefined);
}

export async function deleteSecureItemAsync(key: string): Promise<void> {
  if (hasLocalStorage) {
    try {
      window.localStorage.removeItem(key);
      return;
    } catch{ }
  }

  const store = await loadSecureStore();
  if (!store?.deleteItemAsync) {
    return;
  }

  const available = await secureStoreAvailableAsync();
  if (!available) {
    return;
  }

  await store.deleteItemAsync(key).catch(() => undefined);
}
