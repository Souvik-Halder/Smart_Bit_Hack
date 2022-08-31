const express = require('express');
const router = express.Router();

const ProblemStatement = require('../models/ProblemStatements');

const {
  getProblems,
  getNewProblemForm,
  getOneProblem,
  addProblem,
  updateProblem,
  deleteProblem,
} = require('../controllers/problemsController');

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

router.get('/', getProblems);
router.get('/add', getNewProblemForm);
router.get('/:id', getProblem, getOneProblem);
router.post('/add', addProblem);
router.patch('/:id', getProblem, updateProblem);
router.delete('/:id', getProblem, deleteProblem);

module.exports = router;
