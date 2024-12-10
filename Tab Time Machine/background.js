chrome.runtime.onInstalled.addListener(() => {
    console.log("Tab Time Machine Installed!");
  });
  
  // Save Snapshot
  function saveSnapshot(snapshotName) {
    chrome.tabs.query({}, (tabs) => {
      const snapshot = {
        name: snapshotName,
        timestamp: new Date().toISOString(),
        tabs: tabs.map(tab => ({ title: tab.title, url: tab.url }))
      };
  
      chrome.storage.local.get("snapshots", (data) => {
        const snapshots = data.snapshots || [];
        snapshots.push(snapshot);
        chrome.storage.local.set({ snapshots }, () => {
          console.log("Snapshot saved:", snapshot);
        });
      });
    });
  }
  
  // Listen for Snapshot Save Request
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "saveSnapshot") {
      saveSnapshot(message.name);
      sendResponse({ status: "Snapshot saved successfully!" });
    } else if (message.action === "getSnapshots") {
      chrome.storage.local.get("snapshots", (data) => {
        sendResponse({ snapshots: data.snapshots || [] });
      });
      return true;
    } else if (message.action === "restoreSnapshot") {
      message.tabs.forEach((tab) => {
        chrome.tabs.create({ url: tab.url });
      });
      sendResponse({ status: "Snapshot restored!" });
    } else if (message.action === "deleteSnapshot") {
      chrome.storage.local.get("snapshots", (data) => {
        let snapshots = data.snapshots || [];
        snapshots = snapshots.filter(snapshot => snapshot.name !== message.name);
        chrome.storage.local.set({ snapshots }, () => {
          sendResponse({ status: "Snapshot deleted!" });
        });
      });
      return true;
    }
  });
  