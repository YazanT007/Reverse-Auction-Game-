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
        const { gameNumber, playerBid, lowestBid, winner, profit, gameMode, levelDifficulty} = req.body;

        const newResult = new GameResult({
            gameNumber,
            playerBid,
            lowestBid,
            winner,
            profit,
            gameMode,
            levelDifficulty,
            date: new Date()
        });

        await newResult.save();
        res.status(201).json({ message: 'Game result saved successfully' });
    } catch (error) {
        console.error('Error saving game result:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
