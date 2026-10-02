const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Viewer Battle Server is running!");
});

wss.on("connection", (ws) => {
  console.log("Game connected");

  ws.send(JSON.stringify({
    type: "connected",
    message: "เชื่อมต่อเกมสำเร็จ"
  }));
});

app.post("/event", (req, res) => {
  const event = req.body;

  console.log("EVENT:", event);

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(event));
    }
  });

  res.status(200).json({
    ok: true
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
