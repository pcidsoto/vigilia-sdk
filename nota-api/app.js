const express = require('express');
const app = express();
const path = require('path');

// SDK local
const vigilia = require('../vigilia-sdk');

app.use(express.json());

vigilia.initMonitoringSDK({
  db: 'memory',
  connectionString: 'memory',
  persistenceTime: 3600
});

vigilia.serveDashboardAssets(app);
vigilia.mountDashboard(app);
app.use(vigilia.monitoringMiddleware);

app.use('/notas', require('./routes/notaRoutes'));

app.listen(3000, () => console.log('http://localhost:3000'));
