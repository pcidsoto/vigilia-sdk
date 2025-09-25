const { getAdapter } = require('../config/storage');
const { evaluarPayload } = require('./mlEvaluator'); // lo haremos opcional + dummy

async function procesarPeticion(req) {
  //console.log('Evento recibido:', req);

  console.log("Headers:", req.rawHeaders);
  console.log("Body:", req.body);
  console.log("Method:", req.method);
  console.log("URL:", req.originalUrl);
  console.log("URL 2:", req.url);

  const payload = {
    method: req.method,
    path: req.originalUrl,
    headers: req.headers,
    body: req.body,
    timestamp: new Date(),
    source_ip: req.ip || req.connection.remoteAddress,
  };

  let amenaza = 'desconocida';
  try {
    amenaza = await evaluarPayload(payload);
  } catch (err) {
    console.warn('Evaluación ML fallida o no implementada:', err.message);
  }

  const log = { ...payload, amenazaDetectada: amenaza };
  await getAdapter().saveRequestLog(log);
}
module.exports = { procesarPeticion };
