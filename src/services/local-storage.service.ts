export function getDataFromStorage<T>(key: string): T|null {
  const data = localStorage.getItem(key);
  if (!data) {
    return null;
  }
  return JSON.parse(data);
}

export function saveData(key: string, data: any): void {
  localStorage.setItem(key, JSON.stringify(data));
}
