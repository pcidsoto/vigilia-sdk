# Vigilia SDK

Sistema embebido de monitoreo de tráfico HTTP para APIs, con visualización web en tiempo real y soporte para análisis con IA.

---

## 🚀 Instalación

```bash
npm install vigilia-sdk
```

---

## ⚙️ Configuración básica en tu API

```js
const express = require('express');
const {
  initMonitoringSDK,
  monitoringMiddleware,
  serveDashboardAssets,
  mountDashboard
} = require('vigilia-sdk');

const app = express();

// Inicializa el SDK
initMonitoringSDK({
  db: 'mongo', // Opciones: 'mongo' | 'mysql' | 'memory'
  connectionString: 'mongodb://localhost:27017/monitoring',
  persistenceTime: 60 // minutos
});

// Sirve los assets CSS/JS del dashboard
serveDashboardAssets(app);

// Monta el dashboard visual
mountDashboard(app); // Se expone en /monitoring-dashboard

// Middleware para interceptar todo el tráfico entrante
app.use(monitoringMiddleware);

// Rutas propias de tu API
app.get('/api/ejemplo', (req, res) => res.send('OK'));

app.listen(3000, () => console.log('Servidor activo en http://localhost:3000'));
```

---

## 📊 Dashboard Web

Disponible en: `http://localhost:3000/monitoring-dashboard`

Widgets incluidos:
- Tráfico por minuto
- Clasificación de tráfico vs amenazas
- Top IPs maliciosas
- Tabla de eventos recientes

---

## 🧱 Estructura interna del SDK

```
VIGILIA-SDK/
├── adapters/               # Adaptadores de almacenamiento (mongo, mysql, memoria)
├── assets/                 # Archivos estáticos (JS, CSS)
├── config/                 # Configuración inicial
├── core/                   # Evaluador ML y servicios
├── dashboard/              # MVC del dashboard
├── middleware/             # Middleware de monitoreo
├── ports/                  # Interfaces para adaptadores
├── index.js                # Punto de entrada del SDK
```

---

## 📦 Dependencias necesarias

- `express`
- `ejs`
- `mongoose` (si usas MongoDB)
- `mysql2`, `sequelize` (si usas MySQL)

Instálalas según tu tipo de base de datos:

```bash
# Para MongoDB
npm install mongoose

# Para MySQL
npm install mysql2 sequelize
```

---

## 🧠 Notas adicionales

- El SDK solo intercepta métodos: `GET`, `POST`, `PUT`, `DELETE`, etc.
- Si deseas extender con tu propio modelo de ML, modifica `core/mlEvaluator.js`

---

## 🛡️ Licencia
MIT
