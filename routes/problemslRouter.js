const express = require('express');
const router = express.Router();
const admin=require('../middlewares/admin')
const auth=require('../middlewares/auth')
const getProblem = require('../middlewares/fetchProblem');
const ProblemStatement =require('../models/ProblemStatements')
const {
  getProblems,
  getNewProblemForm,
  getOneProblem,
  addProblem,
  getOneProblemDashboard,
  updateProblem,
  deleteProblem,
} = require('../controllers/problemsController');

router.get('/', getProblems);
router.get('/add', admin,getNewProblemForm);
router.get('/:id', getProblem, getOneProblem);
router.get('/dashboard/:id', getProblem, getOneProblemDashboard);
router.post('/add', admin,addProblem);
router.patch('/:id', getProblem, updateProblem);
router.get('/delete/:id', admin,getProblem, deleteProblem);

//Admin view all  Problem Statement Route


module.exports = router;


