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

// GET form to add new problem
router.get('/add', (req, res) => {
  res.render('addProblemForm', { title: 'Add New Problem' });
});

// GET one problem statement
router.get('/:id', getProblem, async (req, res) => {
  res.json(res.problem);
});

// POST one problem statement
router.post('/add', async (req, res) => {
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
router.patch('/:id', getProblem, async (req, res) => {
  const currentCount = res.problem.submitCount;
  res.problem.submitCount = currentCount + 1;

  try {
    const updatedProblem = await res.problem.save();
    res.json(updatedProblem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE one problem statement
router.delete('/:id', getProblem, async (req, res) => {
  try {
    const problemId = res.problem._id;
    await res.problem.remove();
    res.json({
      message: `Delete success for problem statement with id ${problemId}`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
