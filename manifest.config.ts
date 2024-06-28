import {defineManifest} from "@crxjs/vite-plugin";
import {version} from "./package.json";
import type {ConfigEnv} from "vite";

const names = {
  build: "HeaderManager",
  serve: "[INTERNAL] HeaderManager"
};


export default defineManifest((env: ConfigEnv) => ({
  manifest_version: 3,
  name: names[env.command],
  version,
  description: "HeaderManager - manage headers",
  action: {
    default_popup: 'index.html',
    default_title: 'Modify request and response headers'
  },
  permissions: [
    "storage",
    "webRequest",
    "contextMenus",
    "webRequestBlocking",
    "<all_urls>"
  ],
  background: {
    service_worker: "src/service_worker.js"
  }
}));
