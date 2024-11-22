const SERVER_URL = "http://localhost:3000/api/browsing-data";
let dataBuffer = [];
const BUFFER_LIMIT = 10;
const SEND_INTERVAL = 5000; // Send data every 5 seconds
let isSending = false; // Lock to prevent overlapping sends

// Retrieve the user UID from chrome.storage.local
function getUserUID() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["userUID"], (result) => {
      if (result.userUID && typeof result.userUID === "string") {
        resolve(result.userUID);
      } else {
        console.error("No UID found in chrome storage.");
        resolve(null);
      }
    });
  });
}

// Initialize tracking once UID is obtained
getUserUID().then((userUID) => {
  if (userUID) {
    console.log("User UID:", userUID);
    startTracking(userUID); // Start tracking with the UID
  } else {
    console.error("Cannot start tracking without a valid UID.");
  }
});

// Function to send buffered data
function sendBufferedData(userUID) {
  if (isSending) {
    console.warn("Send in progress, skipping this call.");
    return;
  }

  if (dataBuffer.length > 0) {
    isSending = true; // Set lock
    const payload = { uid: String(userUID), data: dataBuffer }; // Ensure uid is a string
    console.log("Sending data buffer:", payload);

    fetch(SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Data sent successfully");
          dataBuffer = [];
        } else {
          console.error("Failed to send data:", response.statusText);
        }
      })
      .catch((error) => console.error("Error sending data:", error))
      .finally(() => {
        isSending = false; // Release lock
      });
  } else {
    console.warn("Data buffer is empty. No data sent.");
  }
}

// Start tracking browsing data and history
function startTracking(userUID) {
  const browserAPI = typeof browser !== "undefined" ? browser : chrome;

  // Debounce mechanism to avoid flooding the buffer
  let debounceTimer = null;
  function debouncePush(data) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      dataBuffer.push(data);
      console.log("Buffer size after push:", dataBuffer.length);
      if (dataBuffer.length >= BUFFER_LIMIT) {
        sendBufferedData(userUID);
      }
    }, 100); // Debounce delay of 100ms
  }

  // Track web requests
  browserAPI.webRequest.onBeforeRequest.addListener(
    function (details) {
      debouncePush({ type: "webRequest", data: details });
    },
    { urls: [":///*"] }
  );

  // Track browsing history
  browserAPI.history.onVisited.addListener(function (historyItem) {
    debouncePush({ type: "history", data: historyItem });
  });

  // Periodic send to flush the buffer
  setInterval(() => {
    if (dataBuffer.length > 0) {
      sendBufferedData(userUID);
    }
  }, SEND_INTERVAL);
}
