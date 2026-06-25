const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and JSON body parsing
app.use(cors());
app.use(express.json());

// Load the destination database
const dbPath = path.join(__dirname, 'api', 'destinations.json');
let destinations = {};

try {
  destinations = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  console.log("Database loaded successfully.");
} catch (error) {
  console.error("Error loading destinations.json:", error);
}

/**
 * Endpoint: POST /api/destination
 * Input: { "destinationId": "norway" }
 * Returns: Only the requested country's data object
 */
app.post('/api/destination', (req, res) => {
  const { destinationId } = req.body;

  if (!destinationId) {
    return res.status(400).json({ error: "Missing 'destinationId' in request body" });
  }

  const countryKey = destinationId.toLowerCase().trim();
  const countryData = destinations[countryKey];

  if (countryData) {
    res.json(countryData);
  } else {
    res.status(404).json({ error: `Country '${destinationId}' not found.` });
  }
});

/**
 * Endpoint: GET /api/destination
 * Query: ?id=norway
 * Returns: Only the requested country's data object
 */
app.get('/api/destination', (req, res) => {
  const destinationId = req.query.id;

  if (!destinationId) {
    return res.status(400).json({ error: "Missing 'id' query parameter" });
  }

  const countryKey = destinationId.toLowerCase().trim();
  const countryData = destinations[countryKey];

  if (countryData) {
    res.json(countryData);
  } else {
    res.status(404).json({ error: `Country '${destinationId}' not found.` });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
