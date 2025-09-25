const path = require('path');
const express = require('express');

// Rutas y middleware
const dashboardRoutes = require('./dashboard/routes/dashboardRoutes');
const monitoringMiddleware = require('./middleware/trafficMonitor');

// Corrige el path aquí si estaba mal antes
const { initStorage } = require('./config/storage'); // <- Ruta correcta al módulo de storage

// Inicializa el SDK
function initMonitoringSDK({ db, connectionString, persistenceTime = 60 }) {
  initStorage(db, connectionString, persistenceTime);
}

// Sirve archivos estáticos del dashboard
function serveDashboardAssets(app, mountPath = '/monitoring-dashboard') {
  const assetsPath = path.join(__dirname, 'assets');
  app.use(`${mountPath}/assets`, express.static(assetsPath));
}

// Configura EJS para el dashboard
function setupDashboardViewEngine(app) {
  app.set('views', path.join(__dirname, 'dashboard', 'views'));
  app.set('view engine', 'ejs');
}

// Monta el dashboard en la app
function mountDashboard(app, basePath = '/monitoring-dashboard') {
  setupDashboardViewEngine(app);
  app.use(basePath, dashboardRoutes);
}

// Exporta funciones del SDK
module.exports = {
  initMonitoringSDK,
  monitoringMiddleware,
  serveDashboardAssets,
  mountDashboard
};
