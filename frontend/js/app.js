// Function to add a new message to the chatbox
function addMessage(content, sender) {
    const chatbox = document.getElementById("chatbox");
    const message = document.createElement("div");
    message.className = `message ${sender}`;
    message.textContent = content;
    chatbox.appendChild(message);
    chatbox.scrollTop = chatbox.scrollHeight;  // Scroll to the bottom
}

// Function to handle the response from the backend
function handleResponse(response) {
    // Add the chatbot's response
    addMessage(response.response, "bot");

    // If suggestions are provided, display them
    if (response.suggestions && response.suggestions.length > 0) {
        response.suggestions.forEach(suggestion => addMessage(suggestion, "bot"));
    }
}

// Function to send user input to the Flask backend
function sendMessage() {
    const inputBox = document.getElementById("inputBox");
    const message = inputBox.value.trim();

    if (message) {
        // Add the user's message to the chatbox
        addMessage(message, "user");

        // Clear the input box
        inputBox.value = "";

        // Send request to the Flask backend
        fetch('http://127.0.0.1:5000/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_input: message })
        })
        
        
        .then(response => response.json())
        .then(data => handleResponse(data))
        .catch(error => console.error("Error:", error));
    }
}

// Add event listener to the "Send" button
document.getElementById("sendButton").addEventListener("click", sendMessage);

// Enable "Enter" key to send message
document.getElementById("inputBox").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

// Functions to show and hide the chatbot window
function showChatbot() {
    document.getElementById("overlay").style.display = "block";
    document.getElementById("chat-container").style.display = "flex";
}

function hideChatbot() {
    document.getElementById("overlay").style.display = "none";
    document.getElementById("chat-container").style.display = "none";
}

// Initially show the chatbot
showChatbot();
