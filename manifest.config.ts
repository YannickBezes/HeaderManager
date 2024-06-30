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
  icons: {
    16: "src/assets/images/headerManager_16.png",
    32: "src/assets/images/headerManager_32.png",
    48: "src/assets/images/headerManager_48.png",
    128: "src/assets/images/headerManager_128.png"
  },
  action: {
    default_popup: "index.html",
    default_title: "Modify request and response headers"
  },
  permissions: [
    "storage",
    "webRequest",
    "contextMenus",
    "declarativeNetRequest"
  ],
  declarative_net_request: {
    rule_resources: [
      {
        id: "block-url",
        enabled: true,
        path: "block_url.json"
      }
    ]
  },
  background: {
    service_worker: "src/service_worker.js",
    type: "module"
  }
}));
