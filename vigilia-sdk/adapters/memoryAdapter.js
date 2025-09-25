const StoragePort = require('../ports/storagePort');

class MemoryAdapter extends StoragePort {
  constructor(ttlSeconds = 300) {
    super();
    this.ttl = ttlSeconds * 1000;
    this.logs = [];
  }

  connect() {
    // Limpieza periódica
    setInterval(() => {
      const now = Date.now();
      this.logs = this.logs.filter(log => now - log._timestamp <= this.ttl);
    }, this.ttl / 2);
  }

  // Agregar ttl custom luego de la conexión
  setTTL(ttlSeconds) {
    this.ttl = ttlSeconds * 1000;
    // Limpieza periódica con el nuevo TTL
    setInterval(() => {
      const now = Date.now();
      this.logs = this.logs.filter(log => now - log._timestamp <= this.ttl);
    }, this.ttl / 2);
  }

  async saveRequestLog(data) {
    /*
    const payload = {
    method: req.method,
    path: req.originalUrl,
    headers: req.headers,
    body: req.body,
    timestamp: new Date(),
  };
    
    */
    const log = {
      timestamp: new Date(),
      source_ip: data.source_ip || 'unknown',
      user_agent: data.user_agent || '',
      endpoint: data.path || '',
      method: data.method,
      classification: {
        label: data.amenazaDetectada || 'desconocido',
        confidence: 0
      },
      _timestamp: Date.now()
    };
    this.logs.push(log);
  }

  async getRequestLogs() {
    return this.logs;
  }
}

module.exports = MemoryAdapter;
