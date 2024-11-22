// cookies_popup.js

document.addEventListener("DOMContentLoaded", function () {
  getUserUID().then((uid) => {
    document
      .getElementById("acceptCookies")
      .addEventListener("click", function () {
        sendCookieConsent("accepted", uid);
      });

    document
      .getElementById("rejectCookies")
      .addEventListener("click", function () {
        sendCookieConsent("rejected", uid);
      });
  });
});

// Function to retrieve the UID from chrome.storage.local
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
// Example of checking consent status before proceeding with extension installation
function checkConsentAndInstallExtension(uid) {
  fetch(`/api/cookies/consent-status/${uid}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.message === "Consent rejected, extension will not install.") {
        alert("You have rejected cookies consent. The extension will not be installed.");
        // Optionally disable the install button or prevent further action
      } else {
        // Proceed with extension installation
        installExtension();
      }
    })
    .catch((error) => {
      console.error("Error checking consent status:", error);
    });
}

function installExtension() {
  // Your logic for installing the extension or enabling its features
  console.log("Extension installation proceeding...");
}
// Function to send cookie consent choice to backend
async function sendCookieConsent(consent, uid) {
  try {
    const response = await fetch("http://localhost:3000/api/cookies-consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ consent, uid }),
    });

    if (response.ok) {
      console.log("Your preference has been saved.");
      alert("Your preference has been saved.");
      closePopup();
    } else {
      const errorText = await response.text();
      console.error("Failed to save your choice:", errorText);
      alert(`Failed to save your choice: ${errorText}`);
    }
  } catch (error) {
    console.error("Error connecting to the server:", error);
    alert(
      "Error connecting to the server. Please check the console for more details."
    );
  }
}

function closePopup() {
  const popup = document.getElementById("cookiesPopup");
  if (popup) {
    popup.style.display = "none";
  } else {
    console.warn("Cookies popup element not found.");
  }
}
