import dotenv from 'dotenv';
import express from 'express';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const port = 3000;

const apiKey = process.env.apiKey;
if (!apiKey) {
    console.error('apiKey is missing in .env file');
    process.exit(1);
}

const url = 'https://api.themoviedb.org/3';

// Middleware to parse JSON requests
app.use(express.json());

// Middleware to serve static files (like HTML, CSS, and JavaScript)
app.use(express.static('public'));

// Route to handle movie search
app.get('/search', async (req, res) => {
    const { title } = req.query;
    try {
        const response = await fetch(`${url}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(title)}`);
        const data = await response.json();
        res.json(data.results);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch movies. Please try again.' });
    }
});

// Route to handle similar movies
app.get('/similar', async (req, res) => {
    const { id } = req.query;
    try {
        const response = await fetch(`${url}/movie/${id}/similar?api_key=${apiKey}`);
        const data = await response.json();
        res.json(data.results);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch similar movies. Please try again.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});