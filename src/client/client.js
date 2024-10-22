const WebSocket = require("ws");

// Create WebSocket connection
const options = {
  headers: {
    Authorization: "Bearer 12345",
  },
};
const ws = new WebSocket("ws://localhost:3000", options);

// Handle connection open
ws.on("open", function open() {
  console.log("Connected to WebSocket server");

  // Set up stdin to read user input
  process.stdin.setEncoding("utf8");
  console.log("Type your message and press Enter to send (Ctrl+C to quit):");

  process.stdin.on("data", function (data) {
    // Remove the trailing newline
    const message = data.trim();

    // Send the message to the server
    ws.send(message);
    console.log("Sent: " + message);
  });
});

// Handle incoming messages
ws.on("message", function incoming(data) {
  console.log("Received:", data.toString());
});

// Handle errors
ws.on("error", function error(error) {
  console.error("WebSocket error:", error);
});

// Handle connection close
ws.on("close", function close() {
  console.log("Disconnected from WebSocket server");
  process.exit(0);
});

// Handle process termination
process.on("SIGINT", function () {
  ws.close();
  process.exit(0);
});
