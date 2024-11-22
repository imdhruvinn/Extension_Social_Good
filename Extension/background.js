const SERVER_URL = "http://localhost:3000/api/browsing-data";
let dataBuffer = [];
const BUFFER_LIMIT = 10;
const SEND_INTERVAL = 5000; // Send data every 5 seconds

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

// Start tracking browsing data and history with consistent UID
function startTracking(userUID) {
  function sendBufferedData() {
    if (dataBuffer.length > 0) {
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
        .catch((error) => console.error("Error sending data:", error));
    } else {
      console.warn("Data buffer is empty. No data sent.");
    }
  }

  const browserAPI = typeof browser !== "undefined" ? browser : chrome;

  browserAPI.webRequest.onBeforeRequest.addListener(
    function (details) {
      dataBuffer.push({ type: "webRequest", data: details });
      if (dataBuffer.length >= BUFFER_LIMIT) {
        sendBufferedData();
      }
    },
    { urls: ["*://*/*"] }
  );

  browserAPI.history.onVisited.addListener(function (historyItem) {
    dataBuffer.push({ type: "history", data: historyItem });
    if (dataBuffer.length >= BUFFER_LIMIT) {
      sendBufferedData();
    }
  });

  setInterval(() => {
    if (dataBuffer.length > 0) {
      sendBufferedData();
    }
  }, SEND_INTERVAL);
}
