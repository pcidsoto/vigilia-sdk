class StoragePort {
  connect() {
    throw new Error('Método connect() no implementado');
  }

  async saveRequestLog(log) {
    throw new Error('Método saveRequestLog() no implementado');
  }

  async getRequestLogs(filter = {}) {
    throw new Error('Método getRequestLogs() no implementado');
  }
}

module.exports = StoragePort;
