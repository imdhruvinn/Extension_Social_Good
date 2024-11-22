document.addEventListener("DOMContentLoaded", () => {
  const socket = io("http://localhost:3000"); // Connect to backend WebSocket

  socket.on("triggerChatbot", (data) => {
    console.log("Chatbot Trigger Event:", data);

    const chatContainer = document.createElement("div");
    chatContainer.id = "chat-container";
    chatContainer.innerHTML = `
      <div id="chatbox">
        <p>Chatbot triggered due to ${data.label} (${data.value.toFixed(2)}%)</p>
        <input type="text" id="chat-input" placeholder="Type a message" />
        <button id="send-button">Send</button>
      </div>
    `;

    document.body.appendChild(chatContainer);
  });
});
