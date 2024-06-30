export async function getDataFromStorage<T>(key: string): Promise<T | null> {
  const data = await chrome.storage.local.get(key);

  if (typeof data[key] === "undefined") {
    return null;
  }
  return data[key] as T;
}

export function saveData(key: string, data: any): Promise<void> {
  return chrome.storage.local.set({[key]: data});
}
