const Teams = require('../models/Teams');

// Middleware to get a single problem statement
const checkteamleaderlimit = async (req, res, next) => {
  const id=req.params.id;
  try {
   
    let Teamlead = await Teams.findOne({teamid:id})
    if(Teamlead!=null){
    function json2array(json) {
        var result = [];
        var keys = Object.keys(json);
        keys.forEach(function(key) {
            result.push(json[key]);
        });
        return result;
    }
    const Teamleadarray = json2array(Teamlead);
   
   
   
     if(TeammemberDetailsarray.length==1){
      return res.redirect(`/get_team_intro/${id}`)
    }
  }
  } catch (error) {
   return res.redirect(`/get_team_intro/${id}`)
  }

  next()
 
};

module.exports = checkteamleaderlimit;