// Debug message to confirm script is loaded
console.log("Validation script loaded!");

document
  .getElementById("loginForm") // Select the form by ID
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission behavior

    // Get the values of the username and password inputs
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Define the correct credentials
    const validUsername = "admin123";
    const validPassword = "password456";

    // Check if fields are empty
    if (!username || !password) {
      alert("Please fill out all fields.");
      return; // Exit the function
    }

    // Check credentials and provide appropriate feedback
    if (username !== validUsername && password !== validPassword) {
      alert("Both username and password are incorrect.");
    } else if (username !== validUsername) {
      alert("Incorrect username.");
    } else if (password !== validPassword) {
      alert("Incorrect password.");
    } else {
      // If credentials are correct, navigate to the users.html page
      alert("Login successful!");
      window.location.href = "users.html";
    }
  });
