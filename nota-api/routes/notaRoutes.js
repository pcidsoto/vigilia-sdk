const express = require('express');
const router = express.Router();
const db = require('../db');
const Nota = require('../models/nota');

router.get('/', (req, res) => res.json(db.getAll()));
router.get('/:id', (req, res) => res.json(db.getById(req.params.id)));

router.post('/', (req, res) => {
  const nota = new Nota(req.body.titulo, req.body.contenido);
  db.add(nota);
  res.status(201).json(nota);
});

router.put('/:id', (req, res) => {
  db.update(req.params.id, req.body);
  res.sendStatus(204);
});

router.delete('/:id', (req, res) => {
  db.remove(req.params.id);
  res.sendStatus(204);
});

module.exports = router;
