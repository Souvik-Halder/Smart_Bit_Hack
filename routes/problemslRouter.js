const express = require('express');
const router = express.Router();

const getProblem = require('../middlewares/fetchProblem');

const {
  getProblems,
  getNewProblemForm,
  getOneProblem,
  addProblem,
  updateProblem,
  deleteProblem,
} = require('../controllers/problemsController');

router.get('/', getProblems);
router.get('/add', getNewProblemForm);
router.get('/:id', getProblem, getOneProblem);
router.post('/add', addProblem);
router.patch('/:id', getProblem, updateProblem);
router.delete('/:id', getProblem, deleteProblem);

module.exports = router;
