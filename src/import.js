// server/index.js
const express = require('express');
const app = express();
const port = 5000;

// Middleware to parse JSON bodies
app.use(express.json());

// Simple route for testing
app.get('/', (req, res) => {
  res.send('Hello from the server!');
});

// POST route for handling data
app.post('/api/data', (req, res) => {
  const data = req.body;
  res.json({ message: 'Data received', data });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${5000}`);
});
