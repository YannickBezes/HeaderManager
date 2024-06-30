/// <reference types="vite/client" />

type Header = {
  name: string;
  value: string;
  active: boolean
}

type Filter = {
  urlPattern: string;
  urlRegex: string
}

type Profile = {
  id: number,
  name: string,
  request: {
    headers: Array<Header>
  },
  response: {
    headers: Array<Header>
  },
  activate: boolean,
  filters: Filter[],
  appendMode: Boolean,
}

type ExtensionStorage = {
  profiles: Profile[];
  selectedProfile: number;
  savedToCloud: Boolean
}
