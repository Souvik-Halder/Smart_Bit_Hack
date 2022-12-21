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
  res.render('addProblemForm_admin');
};

// GET one problem statement
const getOneProblem = async (req, res) => {
  function json2array(json) {
    var result = [];
    var keys = Object.keys(json);
    keys.forEach(function(key) {
        result.push(json[key]);
    });
    return result;
}
const problemstatements = [json2array(res.problem)[2]];

  res.render('expand_ps',{problemstatements})
};
const getOneProblemDashboard = async (req, res) => {
  function json2array(json) {
    var result = [];
    var keys = Object.keys(json);
    keys.forEach(function(key) {
        result.push(json[key]);
    });
    return result;
}
const problemstatements = [json2array(res.problem)[2]];

  res.render('expand_ps_dashboard',{problemstatements})
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
    res.redirect('/admin_all_ps_handler')
  } catch (error) {
    res.redirect('/admin_all_ps_handler') 
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
    res.redirect('/admin_all_ps_handler')
  } catch (error) {
    res.redirect('/admin_all_ps_handler')
  }
};

module.exports = {
  getProblems,
  getNewProblemForm,
  getOneProblemDashboard,
  getOneProblem,
  addProblem,
  updateProblem,
  deleteProblem,
};
