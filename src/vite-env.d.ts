/// <reference types="vite/client" />

interface Profile {
  id: number,
  name: string,
  request: {
    headers: Map<string, string>
  },
  response: {
    headers: Map<string, string>
  },
  activate: boolean
}
