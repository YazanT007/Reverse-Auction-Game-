const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const gameRoutes = require('./routes/gameRoutes');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use('/api/games', gameRoutes);

mongoose.connect('mongodb://127.0.0.1:27017/reverseAuctionGame', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.error(err));

