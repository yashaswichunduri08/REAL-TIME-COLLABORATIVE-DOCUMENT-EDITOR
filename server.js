const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const app = express();
app.use(cors());
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
let document = "";
wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ type: 'init', data: document }));
  ws.on('message', (message) => {
    try {
      const { type, data } = JSON.parse(message);
      if (type === 'update') {
        document = data;
        for (const client of wss.clients) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'update', data: document }));
          }
        }
      }
    } catch (err) {
      console.error('Message parsing error:', err);
    }
  });
});
server.listen(5000, () => {
  console.log('WebSocket server running on http://localhost:5000');
});
