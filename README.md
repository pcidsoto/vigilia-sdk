
# Vigilia SDK & Nota-API

> **Vigilia SDK** es una librería para monitoreo, análisis y visualización de tráfico HTTP en APIs, con arquitectura extensible y soporte para IA. **Nota-API** es una aplicación de ejemplo que demuestra cómo integrar y utilizar Vigilia SDK en una API real.

---

## Resumen de los proyectos

### vigilia-sdk
- **Tipo:** Librería/SDK para Node.js
- **Funcionalidad:**
	- Monitoreo de tráfico HTTP en tiempo real
	- Dashboard web integrado (`/monitoring-dashboard`)
	- Análisis de amenazas con IA (extensible)
	- Soporte para múltiples backends de almacenamiento (MongoDB, MySQL, memoria)
- **Instalación:**
	```bash
	npm install vigilia-sdk
	```

### nota-api
- **Tipo:** API de ejemplo (Node.js + Express)
- **Funcionalidad:**
	- CRUD de notas
	- Integra y ejemplifica el uso de vigilia-sdk
	- Permite probar el monitoreo y dashboard en un entorno real

---

## Arquitectura y estructura de carpetas

### vigilia-sdk
```
vigilia-sdk/
├── adapters/      # Adaptadores de almacenamiento (mongo, mysql, memoria)
├── assets/        # Archivos estáticos (JS, CSS)
├── config/        # Configuración inicial
├── core/          # Lógica de negocio, ML, servicios
├── dashboard/     # MVC del dashboard web
├── middleware/    # Middleware de monitoreo
├── ports/         # Puertos/Interfaces (principio DIP)
├── index.js       # Punto de entrada
```

**Principios aplicados:**
- **SOLID:**
	- *Single Responsibility:* Cada módulo tiene una única responsabilidad (ej: adapters, core, dashboard).
	- *Open/Closed:* Los adaptadores y el evaluador ML pueden extenderse sin modificar el core.
	- *Liskov Substitution:* Los adaptadores implementan una interfaz común (`StoragePort`).
	- *Interface Segregation:* Interfaces claras para almacenamiento y monitoreo.
	- *Dependency Inversion:* El core depende de abstracciones (ports), no de implementaciones concretas.
- **Patrones de diseño:**
	- *Adapter:* Para soportar distintos backends de almacenamiento.
	- *MVC:* En el dashboard web.
	- *Middleware:* Para interceptar tráfico HTTP.

### nota-api
```
nota-api/
├── app.js           # Punto de entrada
├── db.js            # Lógica de almacenamiento en memoria
├── models/          # Modelo de Nota
├── routes/          # Rutas de la API
├── package.json     # Dependencias y scripts
```

---

## Ejemplo de uso

**Integración básica en una API Express:**
```js
const vigilia = require('vigilia-sdk');
vigilia.initMonitoringSDK({
	db: 'mongo',
	connectionString: 'mongodb://localhost:27017/monitoring',
	persistenceTime: 60
});
vigilia.serveDashboardAssets(app);
vigilia.mountDashboard(app);
app.use(vigilia.monitoringMiddleware);
```

**En nota-api:**
```js
const vigilia = require('../vigilia-sdk');
vigilia.initMonitoringSDK({ db: 'memory', connectionString: 'memory', persistenceTime: 3600 });
vigilia.serveDashboardAssets(app);
vigilia.mountDashboard(app);
app.use(vigilia.monitoringMiddleware);
```

---

## Dashboard web

Disponible en: `http://localhost:3000/monitoring-dashboard`

Widgets incluidos:
- Tráfico por minuto
- Clasificación de tráfico vs amenazas
- Top IPs maliciosas
- Tabla de eventos recientes

---

## Extensión y personalización

- Puedes crear nuevos adaptadores de almacenamiento implementando la interfaz `StoragePort`.
- El evaluador de amenazas (`core/mlEvaluator.js`) es reemplazable por modelos propios.

---

## Licencia
MIT
