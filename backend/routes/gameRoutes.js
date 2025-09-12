// backend/modules/gameRoutes.js
const express = require('express');
const router = express.Router();
const GameResult = require('../models/gameResult'); // MongoDB model

// Example existing route
router.get('/', (req, res) => {
    res.send('Game routes working');
});

// SAVE GAME RESULT ROUTE
router.post('/save-result', async (req, res) => {
    try {
        const { sessionId, playerBid, lowestBid, winner, profit, gameMode, levelDifficulty} = req.body;

        const newResult = new GameResult({
            sessionId,
            playerBid,
            lowestBid,
            winner,
            profit,
            gameMode,
            levelDifficulty,
            timestamp: new Date() 
        });

        await newResult.save();
        res.status(201).json({ message: 'Game result saved successfully' });
    } catch (error) {
        console.error('Error saving game result:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get results for a session
router.get("/results/:sessionId", async (req, res) => {
    try {
        const results = await GameResult.find({ sessionId: req.params.sessionId });
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
