const mongoose = require('mongoose');

const GameResultSchema = new mongoose.Schema({
    gameNumber: Number,
    playerBid: Number,
    lowestBid: Number,
    winner: String,
    profit: Number,
    gameMode: String,
    levelDifficulty: String,
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GameResult', GameResultSchema);
