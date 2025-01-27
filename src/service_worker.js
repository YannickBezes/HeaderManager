function getChromeVersion() {
	let pieces = navigator.userAgent.match(/Chrom(?:e|ium)\/([0-9]+)\.([0-9]+)\.([0-9]+)\.([0-9]+)/);
	if (pieces == null || pieces.length !== 5) {
		return {};
	}
	pieces = pieces.map(piece => parseInt(piece, 10));
	return {
		major: pieces[1],
		minor: pieces[2],
		build: pieces[3],
		patch: pieces[4]
	};
}

const browser = chrome;
const CHROME_VERSION = getChromeVersion();
const SPECIAL_CHARS = "^$&+?.()|{}[]/".split("");
const MAX_PROFILES_IN_CLOUD = 50;
const EXTRA_REQUEST_HEADERS = new Set([ "accept-language", "accept-encoding", "referer", "cookie" ]);
const EXTRA_RESPONSE_HEADERS = new Set([ "set-cookie" ]);
let currentProfile;
let tabUrls = {};

/**
 * Check whether the current request url pass the given list of filters.
 */
function passFilters_(url, type, filters) {
	if (!filters) {
		return true;
	}

	let allowUrls = false;
	let hasUrlFilters = false;
	let allowTypes = false;
	let hasResourceTypeFilters = false;
	for (let filter of filters) {
		if (filter.enabled) {
			switch (filter.type) {
				case "urls":
					hasUrlFilters = true;
					if (url.search(filter.urlRegex) === 0) {
						allowUrls = true;
					}
					break;
				case "types":
					hasResourceTypeFilters = true;
					if (filter.resourceType.indexOf(type) >= 0) {
						allowTypes = true;
					}
					break;
			}
		}
	}
	return (
		(!hasUrlFilters || allowUrls)
		&& (!hasResourceTypeFilters || allowTypes)
	);
}

async function loadSelectedProfile_() {
	let appendMode = false;
	let headers = [];
	let respHeaders = [];
	let filters = [];

	/** @type {ExtensionStorage} */
	const storage = await chrome.storage.local.get() ?? null;
	if (typeof storage.profiles !== "undefined") {
		const profiles = storage.profiles;
		if (!storage.selectedProfile) {
			storage.selectedProfile = 0;
		}
		const selectedProfile = profiles[storage.selectedProfile];

		function filterEnabledHeaders_(headers) {
			let output = [];
			for (let header of headers) {
				// Overrides the header if it is enabled and its name is not empty.
				if (header.enabled && header.name) {
					output.push({ name: header.name, value: header.value });
				}
			}
			return output;
		}

		for (let filter of selectedProfile.filters) {
			if (filter.urlPattern) {
				const urlPattern = filter.urlPattern;
				const joiner = [];
				for (let i = 0; i < urlPattern.length; ++i) {
					let c = urlPattern.charAt(i);
					if (SPECIAL_CHARS.indexOf(c) >= 0) {
						c = "\\" + c;
					} else if (c === "\\") {
						c = "\\\\";
					} else if (c === "*") {
						c = ".*";
					}
					joiner.push(c);
				}
				filter.urlRegex = joiner.join("");
			}
			filters.push(filter);
		}
		// 	appendMode = selectedProfile.appendMode;
		// 	headers = filterEnabledHeaders_(selectedProfile.headers);
		// 	respHeaders = filterEnabledHeaders_(selectedProfile.respHeaders);
	}
	return {
		appendMode: appendMode,
		headers: headers,
		respHeaders: respHeaders,
		filters: filters
	};
};

// function modifyHeader(source, dest) {
// 	if (!source.length) {
// 		return;
// 	}
// 	// Create an index map so that we can more efficiently override
// 	// existing header.
// 	const indexMap = {};
// 	for (const index in dest) {
// 		const header = dest[index];
// 		indexMap[header.name.toLowerCase()] = index;
// 	}
// 	for (let header of source) {
// 		const index = indexMap[header.name.toLowerCase()];
// 		if (index !== undefined) {
// 			if (!currentProfile.appendMode) {
// 				dest[index].value = header.value;
// 			} else if (currentProfile.appendMode == "comma") {
// 				if (dest[index].value) {
// 					dest[index].value += ",";
// 				}
// 				dest[index].value += header.value;
// 			} else {
// 				dest[index].value += header.value;
// 			}
// 		} else {
// 			dest.push({ name: header.name, value: header.value });
// 			indexMap[header.name.toLowerCase()] = dest.length - 1;
// 		}
// 	}
// };

// function modifyRequestHeaderHandler_(details) {
// 	if (localStorage.isPaused) {
// 		return {};
// 	}
// 	if (details.type == "main_frame" && details.url && details.tabId) {
// 		tabUrls[details.tabId] = details.url;
// 		localStorage.activeTabId = details.tabId;
// 		browser.tabs.get(details.tabId, onTabUpdated);
// 	}
// 	if (!localStorage.lockedTabId
// 		|| localStorage.lockedTabId == details.tabId) {
// 		if (currentProfile
// 			&& passFilters_(details.url, details.type, currentProfile.filters)) {
// 			modifyHeader(currentProfile.headers, details.requestHeaders);
// 		}
// 	}
// 	return { requestHeaders: details.requestHeaders };
// }

// function modifyResponseHeaderHandler_(details) {
// 	if (localStorage.isPaused) {
// 		return {};
// 	}
// 	if (!localStorage.lockedTabId
// 		|| localStorage.lockedTabId == details.tabId) {
// 		if (currentProfile
// 			&& passFilters_(details.url, details.type, currentProfile.filters)) {
// 			const serializedOriginalResponseHeaders = JSON.stringify(details.responseHeaders);
// 			const responseHeaders = JSON.parse(serializedOriginalResponseHeaders);
// 			modifyHeader(currentProfile.respHeaders, responseHeaders);
// 			if (JSON.stringify(responseHeaders) != serializedOriginalResponseHeaders) {
// 				return { responseHeaders: responseHeaders };
// 			}
// 		}
// 	}
// };

// function setupHeaderModListener() {
// 	browser.webRequest.onBeforeSendHeaders.removeListener(modifyRequestHeaderHandler_);
// 	browser.webRequest.onHeadersReceived.removeListener(modifyResponseHeaderHandler_);
//
// 	// Chrome 72+ requires 'extraHeaders' to be added for some headers to be modifiable.
// 	// Older versions break with it.
// 	if (currentProfile.headers.length > 0) {
// 		let requiresExtraRequestHeaders = false;
// 		if (CHROME_VERSION.major >= 72) {
// 			for (let header of currentProfile.headers) {
// 				if (EXTRA_REQUEST_HEADERS.has(header.name.toLowerCase())) {
// 					requiresExtraRequestHeaders = true;
// 					break;
// 				}
// 			}
// 		}
// 		browser.webRequest.onBeforeSendHeaders.addListener(
// 			modifyRequestHeaderHandler_,
// 			{ urls: [ "<all_urls>" ] },
// 			requiresExtraRequestHeaders ? [ "requestHeaders", "blocking", "extraHeaders" ] : [ "requestHeaders", "blocking" ]
// 		);
// 	}
// 	if (currentProfile.respHeaders.length > 0) {
// 		let requiresExtraResponseHeaders = false;
// 		if (CHROME_VERSION.major >= 72) {
// 			for (let header of currentProfile.respHeaders) {
// 				if (EXTRA_RESPONSE_HEADERS.has(header.name.toLowerCase())) {
// 					requiresExtraResponseHeaders = true;
// 					break;
// 				}
// 			}
// 		}
// 		browser.webRequest.onHeadersReceived.addListener(
// 			modifyResponseHeaderHandler_,
// 			{ urls: [ "<all_urls>" ] },
// 			requiresExtraResponseHeaders ? [ "responseHeaders", "blocking", "extraHeaders" ] : [ "responseHeaders", "blocking" ]
// 		);
// 	}
// }

// function onTabUpdated(tab) {
// 	if (tab.active) {
// 		delete localStorage.currentTabUrl;
// 		// Since we don't have access to the "tabs" permission, we may not have
// 		// access to the url property all the time. So, match it against the URL
// 		// found during request modification.
// 		let url = tab.url;
// 		if (url) {
// 			tabUrls[tab.id] = url;
// 		} else {
// 			url = tabUrls[tab.id];
// 		}
// 		localStorage.activeTabId = tab.id;
//
// 		// Only set the currentTabUrl property if the tab is active and the window
// 		// is in focus.
// 		browser.windows.get(tab.windowId, {}, (win) => {
// 			if (win.focused) {
// 				localStorage.currentTabUrl = url;
// 			}
// 		});
// 		if (!url) {
// 			return;
// 		}
// 		resetBadgeAndContextMenu();
// 	}
// }

// browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
// 	onTabUpdated(tab);
// });

// browser.tabs.onActivated.addListener((activeInfo) => {
// 	browser.tabs.get(activeInfo.tabId, onTabUpdated);
// });

// browser.windows.onFocusChanged.addListener((windowId) => {
// 	if (windowId == browser.windows.WINDOW_ID_NONE) {
// 		return;
// 	}
// 	browser.windows.get(windowId, { populate: true }, (win) => {
// 		for (let tab of win.tabs) {
// 			onTabUpdated(tab);
// 		}
// 	});
// });

// function createContextMenu() {
// 	if (localStorage.isPaused) {
// 		browser.contextMenus.update(
// 			"pause",
// 			{
// 				title: "Unpause HeaderManager",
// 				contexts: [ "browser_action" ],
// 				onclick: () => {
// 					localStorage.removeItem("isPaused");
// 					resetBadgeAndContextMenu();
// 				}
// 			});
// 	} else {
// 		browser.contextMenus.update(
// 			"pause",
// 			{
// 				title: "Pause HeaderManager",
// 				contexts: [ "browser_action" ],
// 				onclick: () => {
// 					localStorage.isPaused = true;
// 					resetBadgeAndContextMenu();
// 				}
// 			});
// 	}
// 	if (localStorage.lockedTabId) {
// 		browser.contextMenus.update(
// 			"lock",
// 			{
// 				title: "Unlock to all tabs",
// 				contexts: [ "browser_action" ],
// 				onclick: () => {
// 					localStorage.removeItem("lockedTabId");
// 					resetBadgeAndContextMenu();
// 				}
// 			});
// 	} else {
// 		browser.contextMenus.update(
// 			"lock",
// 			{
// 				title: "Lock to this tab",
// 				contexts: [ "browser_action" ],
// 				onclick: () => {
// 					localStorage.lockedTabId = localStorage.activeTabId;
// 					resetBadgeAndContextMenu();
// 				}
// 			});
// 	}
// }

// function resetBadgeAndContextMenu() {
// 	if (localStorage.isPaused) {
// 		browser.browserAction.setIcon({ path: "icon_bw.png" });
// 		browser.browserAction.setBadgeText({ text: "\u275A\u275A" });
// 		browser.browserAction.setBadgeBackgroundColor({ color: "#666" });
// 	} else {
// 		const numHeaders = (currentProfile.headers.length + currentProfile.respHeaders.length);
// 		if (numHeaders == 0) {
// 			browser.browserAction.setBadgeText({ text: "" });
// 			browser.browserAction.setIcon({ path: "icon_bw.png" });
// 		} else if (localStorage.lockedTabId
// 			&& localStorage.lockedTabId != localStorage.activeTabId) {
// 			browser.browserAction.setIcon({ path: "icon_bw.png" });
// 			browser.browserAction.setBadgeText({ text: "\uD83D\uDD12" });
// 			browser.browserAction.setBadgeBackgroundColor({ color: "#ff8e8e" });
// 		} else {
// 			browser.browserAction.setIcon({ path: "icon.png" });
// 			browser.browserAction.setBadgeText({ text: numHeaders.toString() });
// 			browser.browserAction.setBadgeBackgroundColor({ color: "#db4343" });
// 		}
// 	}
// 	createContextMenu();
// }

async function initializeStorage() {
	currentProfile = loadSelectedProfile_();
	// setupHeaderModListener();

	const localStorage = await browser.storage.local.get();
	chrome.storage.local.onChanged.addListener(async (e) => {
		currentProfile = await loadSelectedProfile_();
		// setupHeaderModListener();
		// resetBadgeAndContextMenu();
	});
}


initializeStorage();
// resetBadgeAndContextMenu();

browser.contextMenus.create({
	id: "pause",
	title: "Pause",
	contexts: [ "browser_action" ]
});
browser.contextMenus.create({
	id: "lock",
	title: "Lock",
	contexts: [ "browser_action" ]
});
