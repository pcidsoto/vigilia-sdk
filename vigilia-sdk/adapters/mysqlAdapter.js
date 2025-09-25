const mysql = require('mysql2/promise');
const StoragePort = require('../ports/storagePort');

class MySQLAdapter extends StoragePort {
  constructor(connectionString) {
    super();
    this.connectionString = connectionString;
    this.pool = null;
  }

  async connect() {
    this.pool = await mysql.createPool(this.connectionString);

    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS eventos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        source_ip VARCHAR(45),
        user_agent TEXT,
        endpoint VARCHAR(255),
        method VARCHAR(10),
        classification_label VARCHAR(50),
        classification_confidence FLOAT
      )
    `);
  }

  async saveRequestLog(log) {
    const {
      timestamp = new Date(),
      headers,
      path,
      method,
      amenazaDetectada,
      confidence = 1.0
    } = log;

    const source_ip = headers['x-forwarded-for'] || 'desconocido';
    const user_agent = headers['user-agent'] || '';

    await this.pool.query(
      `INSERT INTO eventos (
        timestamp, source_ip, user_agent, endpoint, method,
        classification_label, classification_confidence
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        timestamp,
        source_ip,
        user_agent,
        path,
        method,
        amenazaDetectada || 'desconocida',
        confidence
      ]
    );
  }

  async getRequestLogs(filter = {}) {
    const [rows] = await this.pool.query(
      `SELECT * FROM eventos ORDER BY timestamp DESC LIMIT 100`
    );
    return rows;
  }
}

module.exports = MySQLAdapter;
