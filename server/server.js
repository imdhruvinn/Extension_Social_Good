const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000; // Define port

// Middleware to parse JSON data and handle cross-origin requests
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/BrowsingHistory', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Define the schema for storing general data
const DataSchema = new mongoose.Schema({
  type: String,
  data: mongoose.Schema.Types.Mixed, // Allows mixed data types
  url: String, // New field to store URLs
  timestamp: { type: Date, default: Date.now }, // Automatically set a timestamp
});

const Data = mongoose.model('Data', DataSchema); // Create a Mongoose model from the schema

// Define schema for storing browsing history
const HistorySchema = new mongoose.Schema({
  url: String, // Store URL
  visitTime: { type: Date, default: Date.now }, // Automatically set timestamp
});

const History = mongoose.model('History', HistorySchema); // Create a separate model for history

// POST endpoint to save general data to MongoDB
app.post('/data', async (req, res) => {
  const newData = new Data(req.body); // Create a new document from the request body
  try {
    const savedData = await newData.save(); // Save the document to the database
    res.status(201).send(savedData); // Respond with the saved document
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(400).send({ error: 'Failed to save data' }); // Send error response
  }
});

// POST endpoint to save browsing history to MongoDB
app.post('/history', async (req, res) => {
  const newHistory = new History(req.body); // Create a new history document
  try {
    const savedHistory = await newHistory.save(); // Save the history document
    res.status(201).send(savedHistory); // Respond with saved history
  } catch (error) {
    console.error('Error saving history:', error);
    res.status(400).send({ error: 'Failed to save history' });
  }
});

// GET endpoint to retrieve all general data
app.get('/data', async (req, res) => {
  try {
    const data = await Data.find({}); // Fetch all documents in the collection
    res.send(data); // Send the retrieved data
  } catch (error) {
    console.error('Error retrieving data:', error);
    res.status(500).send({ error: 'Failed to retrieve data' });
  }
});

// GET endpoint to retrieve browsing history
app.get('/history', async (req, res) => {
  try {
    const history = await History.find({}); // Fetch all browsing history
    res.send(history); // Send the retrieved history
  } catch (error) {
    console.error('Error retrieving history:', error);
    res.status(500).send({ error: 'Failed to retrieve history' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
