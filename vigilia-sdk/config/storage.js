// config/index.js

const MongoAdapter = require('../adapters/mongoAdapter');
const MySQLAdapter = require('../adapters/mysqlAdapter');
const MemoryAdapter = require('../adapters/memoryAdapter');

let adapter = null;

function initStorage(db, connectionString, persistenceTime) {
  if (!db) throw new Error('Debes especificar el tipo de base de datos (db).');

  switch (db) {
    case 'mongo': {
      adapter = new MongoAdapter();
      adapter.connect(connectionString);
      break;
    }
    case 'mysql': {
      adapter = new MysqlAdapter();
      adapter.connect(connectionString);
      break;
    }
    case 'memory': {
      adapter = new MemoryAdapter();
      adapter.connect();
      adapter.setTTL(persistenceTime);
      break;
    }
    default:
      throw new Error(`Tipo de base de datos no soportado: ${db}`);
  }
}

function getAdapter() {
  if (!adapter) throw new Error('El almacenamiento no ha sido inicializado.');
  return adapter;
}

module.exports = {
  initStorage,
  getAdapter
};
