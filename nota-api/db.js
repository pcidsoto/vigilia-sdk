const notas = [];
module.exports = {
  getAll: () => notas,
  getById: id => notas.find(n => n.id === id),
  add: nota => { notas.push(nota); return nota; },
  update: (id, nuevo) => {
    const i = notas.findIndex(n => n.id === id);
    if (i !== -1) notas[i] = { ...notas[i], ...nuevo };
  },
  remove: id => {
    const i = notas.findIndex(n => n.id === id);
    if (i !== -1) notas.splice(i, 1);
  }
};
