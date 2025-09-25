const { procesarPeticion } = require('../core/monitorService');

function trafficMonitor(req, res, next) {
  // No monitorear el dashboard para evitar bucles infinitos
  if (req.originalUrl.includes('/monitoring-dashboard')) {
    return next();
  }

  // Captura y delega
  procesarPeticion(req).catch((err) => {
    console.error('Error al procesar petición de monitoreo:', err.message);
    console.error(err.stack);
  });

  next();
}

module.exports = trafficMonitor;
