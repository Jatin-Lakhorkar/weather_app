const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.OPENWEATHER_API_KEY;

app.use(cors());
app.use(express.static('.')); // Serve static files

// Weather endpoint - fetch weather data from OpenWeatherMap API and proxy to client
app.get('/api/weather', async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ error: 'City parameter is required' });
  }

  try {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.statusText}`);
    }

    const weatherData = await response.json();
    res.json(weatherData);
  } catch (error) {
    console.error('Error fetching weather:', error);
    res.status(500).json({ error: 'Could not fetch weather data' });
  }
});

// Vercel uses a serverless runtime and does not require manual port binding.
// Locally, this still starts the app on PORT for development.
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;