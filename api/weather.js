const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const city = req.query.city;
    const API_KEY = process.env.OPENWEATHER_API_KEY;

    if (!city) {
        return res.status(400).json({ error: 'City parameter is required' });
    }

    if (!API_KEY) {
        return res.status(500).json({ error: 'API key is not configured' });
    }

    try {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Weather API error: ${response.status} ${errorText}`);
        }

        const weatherData = await response.json();
        res.status(200).json(weatherData);
    } catch (error) {
        console.error('Error fetching weather:', error);
        res.status(500).json({ error: 'Could not fetch weather data' });
    }
};