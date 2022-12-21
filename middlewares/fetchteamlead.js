const Teams = require('../models/Teams');

// Middleware to get a single problem statement
const fetchteamlead = async (req, res, next) => {
  const id=req.params.id;
  try {
   
    var Teamleaderdetails = await Teams.findOne({teamid:id})
    if (Teamleaderdetails === null)
      return res.redirect(`/get_team_intro/${id}`);
  } catch (error) {
    res.redirect(`/get_team_intro/${id}`)
  }

 
  next();
};

module.exports = fetchteamlead;