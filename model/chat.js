const mongoose = require('mongoose');

// Define the schema
const chatSchema = new mongoose.Schema({
    username: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

// Export the model
module.exports = mongoose.model('Chat', chatSchema);
