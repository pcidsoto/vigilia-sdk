const { getAdapter } = require('../../config/storage');

// Render clásico con EJS
exports.renderizarDashboard = async (req, res) => {
  res.render('dashboard'); // solo estructura HTML, lo carga dashboard.js
};

// API para JS: eventos desde un rango
exports.listarEventos = async (req, res) => {
  try {
    const { desde } = req.query;
    const storage = getAdapter();

    if (!storage || !storage.getRequestLogs) {
      return res.status(500).json({ error: 'Storage no disponible' });
    }

    const eventos = await storage.getRequestLogs();

    const eventosFiltrados = (desde && !isNaN(new Date(desde)))
      ? eventos.filter(e => new Date(e.timestamp) >= new Date(desde))
      : eventos;

    res.json(eventosFiltrados);
  } catch (err) {
    console.error('Error en listarEventos:', err);
    res.status(500).json({ error: 'Error al obtener eventos' });
  }
};
