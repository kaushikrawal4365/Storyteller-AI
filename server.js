const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Your Hugging Face API token
require('dotenv').config();
const API_TOKEN = process.env.HF_API_TOKEN; // Load from environment

app.use(express.json());
app.use(express.static('public'));

app.post('/generate', async (req, res) => {
    const { story, prompt } = req.body;
    const fullPrompt = story ? `${story} ${prompt}` : prompt;

    try {
        const response = await axios.post(
            'https://api-inference.huggingface.co/models/gpt2',
            {
                inputs: fullPrompt,
                parameters: { max_length: 100, temperature: 0.9 }
            },
            {
                headers: { Authorization: `Bearer ${API_TOKEN}` }
            }
        );
        const generatedText = response.data[0].generated_text;
        const continuation = story ? generatedText.slice(story.length).trim() : generatedText.trim();
        res.json({ continuation });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong!' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});