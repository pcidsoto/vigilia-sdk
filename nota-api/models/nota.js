module.exports = class Nota {
  constructor(titulo, contenido) {
    this.id = Math.random().toString(36).substring(7);
    this.titulo = titulo;
    this.contenido = contenido;
    this.fecha = new Date();
  }
};
