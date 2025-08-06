const { YoutubeTranscript } = require('youtube-transcript');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

function cleanIngredient(text) {
    return text
        .toLowerCase()
        .replace(/^[\d\s/.,()-]+/, '') // remove leading quantity or punctuation
        .replace(/\b(?:cup|cups|tbsp|tablespoon|tablespoons|tsp|teaspoon|teaspoons|pound|pounds|oz|ounce|ounces|gram|grams|kg|g|ml|liter|liters|can|cans|packet|packets|clove|cloves|slice|slices|dash|pinch|bunch|stick|sticks)\b/g, '')
        .replace(/[^a-z\s]/g, '') // remove special characters
        .replace(/\s{2,}/g, ' ') // collapse multiple spaces
        .trim();
}

async function getIngredientsFromYoutube(youtubeUrl) {
    try {
        console.log("Fetching ingredients from YouTube URL:", youtubeUrl);
        const videoId = new URL(youtubeUrl).searchParams.get("v");
        console.log("Video ID:", videoId);
        if (!videoId) throw new Error("Invalid YouTube URL");

        const transcript = await YoutubeTranscript.fetchTranscript(videoId);
        const fullText = transcript.map(t => t.text).join(" ");

        const prompt = `
Extract only a JSON array of ingredients mentioned in the cooking video transcript below.
Respond with just the JSON array (no markdown, no extra text).

Transcript:
${fullText}
`;

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                contents: [{ parts: [{ text: prompt }] }]
            }
        );
        console.log("Gemini API Response:", response.data);
        const rawText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const cleanedJson = rawText.replace(/```(?:json)?\n?([\s\S]*?)\n?```/, '$1').trim();

        let ingredients = [];
        try {
            const parsed = JSON.parse(cleanedJson);
            if (Array.isArray(parsed)) {
                ingredients = parsed;
            }
        } catch (e) {
            console.warn("JSON parsing failed, rawText:", rawText);
            ingredients = [];
        }

        const cleanedIngredients = ingredients
            .map(cleanIngredient)
            .filter(i => i.length > 0);

        return [...new Set(cleanedIngredients)];

    } catch (err) {
        console.error("Gemini API Error:", err?.response?.data || err.message);
        return [];
    }
}

module.exports = { getIngredientsFromYoutube };

// For testing directly
// if (require.main === module) {
//     (async () => {
//         const url = "https://www.youtube.com/watch?v=4aZr5hZXP_s"; // change if needed
//         const result = await getIngredientsFromYoutube(url);
//         console.log("Ingredients:", result);
//     })();
// }
