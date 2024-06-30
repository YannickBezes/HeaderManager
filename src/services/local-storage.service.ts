export async function getDataFromStorage<T>(key: keyof  ExtensionStorage): Promise<T | null> {
  const data = await chrome.storage.local.get(key) as ExtensionStorage;

  if (typeof data[key] === "undefined") {
    return null;
  }
  return data[key] as T;
}

export function saveData(key: keyof ExtensionStorage, data: any): Promise<void> {
  return chrome.storage.local.set({[key]: data});
}
