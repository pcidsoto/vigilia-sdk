const mongoose = require('mongoose');

const EventoSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  source_ip: String,
  user_agent: String,
  endpoint: String,
  method: String,
  classification: {
    label: String,
    confidence: Number
  }
});


const Evento = mongoose.models.Evento || mongoose.model('Evento', EventoSchema);

module.exports = Evento;