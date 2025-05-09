// models/AudioMessage.js
const mongoose = require('mongoose');

const audioMessageSchema = new mongoose.Schema({
  audio: Buffer, // données chiffrées
  iv: Buffer,     // vecteur d'initialisation
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AudioMessage', audioMessageSchema);