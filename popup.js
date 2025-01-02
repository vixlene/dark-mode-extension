let darkModeEnabled = false;

// Load the saved state from chrome.storage when popup is opened
document.addEventListener("DOMContentLoaded", async () => {
  const savedState = await chrome.storage.local.get("darkModeEnabled");
  darkModeEnabled = savedState.darkModeEnabled || false; // Default to false

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Check if the tab URL is a supported page
  if (tab.url.startsWith("chrome://") || tab.url.startsWith("about:")) {
    document.getElementById("status").innerText =
      "Dark mode is not supported on this page.";
    return;
  }

  if (darkModeEnabled) {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => document.body.classList.add("dark-mode"),
    });
    document.getElementById("toggle").innerText = "Disable Dark Mode";
  } else {
    document.getElementById("toggle").innerText = "Enable Dark Mode";
  }
});

// Add click event listener to the button
document.getElementById("toggle").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Check if the tab URL is a supported page
  if (tab.url.startsWith("chrome://") || tab.url.startsWith("about:")) {
    document.getElementById("status").innerText =
      "Dark mode cannot be applied to this page.";
    return;
  }

  darkModeEnabled = !darkModeEnabled;

  if (darkModeEnabled) {
    // Add dark-mode class to the page
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => document.body.classList.add("dark-mode"),
    });
    document.getElementById("toggle").innerText = "Disable Dark Mode";
  } else {
    // Remove dark-mode class from the page
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => document.body.classList.remove("dark-mode"),
    });
    document.getElementById("toggle").innerText = "Enable Dark Mode";
  }

  // Save the new state to chrome.storage
  await chrome.storage.local.set({ darkModeEnabled });
});
