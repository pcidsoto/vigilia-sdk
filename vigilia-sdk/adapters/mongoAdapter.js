const mongoose = require('mongoose');
const StoragePort = require('../ports/storagePort');

// Importa el modelo de evento que definiste con Mongoose
const Evento = require('../dashboard/models/Evento'); // asegúrate que la ruta coincida

class MongoAdapter extends StoragePort {
  constructor(connectionString) {
    super();
    this.connectionString = connectionString;
  }

  async connect() {
    await mongoose.connect(this.connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('[Vigilia SDK] Conectado a MongoDB con Mongoose');
  }

  async saveRequestLog(log) {
    const evento = new Evento({
      timestamp: log.timestamp || new Date(),
      source_ip: log.headers?.['x-forwarded-for'] || log.ip || 'desconocido',
      user_agent: log.headers?.['user-agent'] || '',
      endpoint: log.path,
      method: log.method,
      classification: {
        label: log.amenazaDetectada || 'desconocida',
        confidence: log.confidence || 1.0,
      }
    });

    await evento.save();
  }

  async getRequestLogs(filter = {}) {
    return await Evento.find(filter).sort({ timestamp: -1 }).limit(100);
  }
}

module.exports = MongoAdapter;
