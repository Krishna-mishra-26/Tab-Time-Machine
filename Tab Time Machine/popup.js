document.getElementById("saveBtn").addEventListener("click", () => {
    const snapshotName = document.getElementById("snapshotName").value.trim();
    if (!snapshotName) {
      alert("Please enter a name for the snapshot.");
      return;
    }
  
    chrome.runtime.sendMessage({ action: "saveSnapshot", name: snapshotName }, (response) => {
      alert(response.status);
      loadSnapshots();
    });
  });
  
  function loadSnapshots() {
    chrome.runtime.sendMessage({ action: "getSnapshots" }, (response) => {
      const snapshots = response.snapshots || [];
      const snapshotList = document.getElementById("snapshotList");
      snapshotList.innerHTML = "";
  
      snapshots.forEach((snapshot) => {
        const li = document.createElement("li");
  
        // Create a span element for the snapshot name and make it bold
        const nameSpan = document.createElement("span");
        nameSpan.textContent = `${snapshot.name} (${new Date(snapshot.timestamp).toLocaleString()})`;
  
        const restoreBtn = document.createElement("button");
        restoreBtn.textContent = "Restore";
        restoreBtn.addEventListener("click", () => {
          chrome.runtime.sendMessage({ action: "restoreSnapshot", tabs: snapshot.tabs });
        });
  
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("delete"); // Add a class to style the delete button
        deleteBtn.addEventListener("click", () => {
          chrome.runtime.sendMessage({ action: "deleteSnapshot", name: snapshot.name }, () => {
            loadSnapshots(); // Reload the snapshots after deletion
          });
        });
  
        li.appendChild(nameSpan);
        li.appendChild(restoreBtn);
        li.appendChild(deleteBtn);
        snapshotList.appendChild(li);
      });
    });
  }
  
  // Load snapshots when the popup is opened
  loadSnapshots();
  