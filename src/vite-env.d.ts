/// <reference types="vite/client" />

interface Header {
  name: string;
  value: string;
  active: boolean
}

interface Profile {
  id: number,
  name: string,
  request: {
    headers: Array<Header>
  },
  response: {
    headers: Array<Header>
  },
  activate: boolean
}
