const express = require('express');
const router = express.Router();
const axios = require('axios'); // axios ইনস্টল করা থাকতে হবে: npm install axios

// @route   GET /api/order/reverse-geocode
// @desc    Get address details from latitude and longitude
// @access  Public
router.get('/reverse-geocode', async (req, res) => {
    try {
        const { lat, lon } = req.query;

        // ভ্যালিডেশন: ল্যাটিটিউড বা লঙ্গিটিউড না থাকলে এরর দিবে
        if (!lat || !lon) {
            return res.status(400).json({ 
                success: false, 
                message: "Latitude and Longitude are required." 
            });
        }

        // Nominatim API কল (সার্ভার সাইড থেকে)
        const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse`,
            {
                params: {
                    format: 'jsonv2',
                    lat: lat,
                    lon: lon,
                    'accept-language': 'en' // ইংরেজি ভাষায় ডাটা পাওয়ার জন্য
                },
                headers: { 
                    "User-Agent": "DigitalShop_Server_v1" // এটি অত্যন্ত জরুরি
                }
            }
        );

        // সফল হলে ডাটা সেন্ড করবে
        res.json(response.data);

    } catch (error) {
        console.error("Geocoding Error:", error.message);
        res.status(500).json({ 
            success: false, 
            message: "Location fetch failed. Please try again later." 
        });
    }
});

module.exports = router;