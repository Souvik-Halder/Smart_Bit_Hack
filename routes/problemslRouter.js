const express = require('express');
const router = express.Router();

const ProblemStatement = require('../models/ProblemStatements');

// GET all problem statements
router.get('/', async (req, res) => {});

// GET one problem statement
router.get('/:id', async (req, res) => {});

// POST one problem statement
router.post('/', async (req, res) => {});

// UPDATE one problem statement
router.patch('/:id', async (req, res) => {});

// DELETE one problem statement
router.delete('/:id', async (req, res) => {});

module.exports = router;
