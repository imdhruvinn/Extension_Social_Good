// script_termsAndCond.js

// Function to generate or retrieve a user UID and save it to chrome storage
function getOrCreateUID() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["userUID"], (result) => {
      if (result.userUID && typeof result.userUID === "string") {
        resolve(result.userUID); // UID exists; return it
      } else {
        const uid = generateUID(); // Generate a new UID if none exists
        chrome.storage.local.set({ userUID: uid }, () => resolve(uid)); // Save UID to chrome storage
      }
    });
  });
}

// Function to generate a new UID
function generateUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

document.addEventListener("DOMContentLoaded", async function () {
  const userForm = document.getElementById("user-form");

  if (userForm) {
    userForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const email = document.getElementById("email").value;
      const phone = document.getElementById("phone").value;
      const userUID = await getOrCreateUID(); // Use the centralized UID function

      const data = {
        email: email,
        phone: phone,
        uid: userUID,
      };

      console.log("Sending user information to backend:", data);

      fetch("http://localhost:3000/api/user-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (response.ok) {
            console.log("User information sent successfully");
            return response.json();
          } else {
            return response.json().then((data) => {
              console.error("Response data:", data);
              throw new Error(
                data.message || "Failed to send user information"
              );
            });
          }
        })
        .then((data) => {
          console.log("Response from backend:", data);
          window.location.href = "cookies_popup.html"; // Redirect to cookie page
        })
        .catch((error) => {
          console.error("Error:", error);
          const errorMessage = document.getElementById("error-message");
          if (errorMessage) {
            errorMessage.style.display = "block";
            errorMessage.textContent = error.message;
          }
        });
    });
  } else {
    console.error("Element with ID 'user-form' not found in the DOM.");
  }
});
