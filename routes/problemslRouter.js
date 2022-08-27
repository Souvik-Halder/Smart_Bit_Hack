const express = require('express');
const router = express.Router();

const ProblemStatement = require('../models/ProblemStatements');

// Middleware to get a single problem statement
const getProblem = async (req, res, next) => {
  try {
    var problem = await ProblemStatement.findById(req.params.id);
    if (problem === null)
      return res
        .status(404)
        .json({ message: 'Can not find problem statement.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.problem = problem;
  next();
};

// GET all problem statements
router.get('/', async (req, res) => {
  try {
    const statements = await ProblemStatement.find();
    res.json({ statements });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET one problem statement
router.get('/:id', getProblem, async (req, res) => {});

// POST one problem statement
router.post('/', async (req, res) => {
  const problem = new ProblemStatement({
    title: req.body.title,
    description: req.body.description,
    theme: req.body.theme,
  });

  try {
    const newProblem = await problem.save();
    res.status(201).json(newProblem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE one problem statement
router.patch('/:id', async (req, res) => {});

// DELETE one problem statement
router.delete('/:id', async (req, res) => {});

module.exports = router;
