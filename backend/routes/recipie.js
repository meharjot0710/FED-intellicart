const express= require('express');
const router = express.Router();
const { getIngredientsFromYoutube } = require('../services/gemini');

router.post('/check-ingredients', async (req, res) => {
    const { youtubeUrl, inventory } = req.body;

    if (!youtubeUrl || !inventory || !Array.isArray(inventory)) {
        return res.status(400).json({ error: "Invalid input" });
    }

    try {
        const ingredients = await getIngredientsFromYoutube(youtubeUrl);
        console.log("🧪 Raw Gemini Ingredients:", ingredients);

        res.json({
            ingredients_required: ingredients
        });

    } catch (error) {
        console.error("❌ Gemini API Error:", error?.response?.data || error.message);
        res.status(500).json({ error: "Gemini API failed or something went wrong." });
    }
});

module.exports = router;