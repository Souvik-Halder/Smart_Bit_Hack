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

module.exports = getProblem;