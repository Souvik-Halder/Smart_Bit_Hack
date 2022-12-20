const ProblemStatement = require('../models/ProblemStatements');

// GET all problem statements
const getProblems = async (req, res) => {
  try {
    const statements = await ProblemStatement.find();
    function json2array(json) {
      var result = [];
      var keys = Object.keys(json);
      keys.forEach(function(key) {
          result.push(json[key]);
      });
      return result;
  }
  const statementsarr = json2array(statements);
  res.render('All_Problem_Statements',{statementsarr})
  } catch (error) {
   res.redirect('/')
  }
};

// GET form to add new problem
const getNewProblemForm = (req, res) => {
  res.render('addProblemForm', { title: 'Add New Problem' });
};

// GET one problem statement
const getOneProblem = async (req, res) => {
  res.json(res.problem);
};

// POST one problem statement
const addProblem = async (req, res) => {
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
};

// UPDATE one problem statement
const updateProblem = async (req, res) => {
  const currentCount = res.problem.submitCount;
  res.problem.submitCount = currentCount + 1;

  try {
    const updatedProblem = await res.problem.save();
    res.json(updatedProblem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE a problem statement
const deleteProblem = async (req, res) => {
  try {
    const problemId = res.problem._id;
    await res.problem.remove();
    res.json({
      message: `Delete success for problem statement with id ${problemId}`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProblems,
  getNewProblemForm,
  getOneProblem,
  addProblem,
  updateProblem,
  deleteProblem,
};
