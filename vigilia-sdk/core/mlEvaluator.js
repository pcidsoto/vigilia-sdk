// Placeholder: luego lo reemplazamos por inferencia real (modelo local o API)
async function evaluarPayload(payload) {
    // Aquí puedes conectar tu modelo de detección real

    // Retorna un valor random para simular la evaluación.
    const valoresPosibles = ['normal', 'SQLi', 'XSS', 'CSRF'];
    return valoresPosibles[Math.floor(Math.random() * valoresPosibles.length)];
}

module.exports = { evaluarPayload };
