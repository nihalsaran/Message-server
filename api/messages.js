const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000; // Define the port for local testing
const dbFilePath = path.join(__dirname, '..', 'messages.json');

app.use(bodyParser.json());

// Load existing messages from the JSON file
let messages = [];
if (fs.existsSync(dbFilePath)) {
  messages = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
}

// Route to handle sending messages
app.post('/send-message', (req, res) => {
  const { recipientId, messageContent } = req.body;
  const newMessage = { recipientId, messageContent, timestamp: new Date() };
  messages.push(newMessage);
  saveMessages();
  res.status(200).json({ success: true });
});

// Route to retrieve messages for a user
app.get('/get-messages/:recipientId', (req, res) => {
  const recipientId = req.params.recipientId;
  const userMessages = messages.filter(message => message.recipientId === recipientId);
  res.status(200).json(userMessages);
});

// Save messages to the JSON file
function saveMessages() {
  fs.writeFileSync(dbFilePath, JSON.stringify(messages), 'utf8');
}

// For local development, start the server with app.listen
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
}

module.exports = app;
