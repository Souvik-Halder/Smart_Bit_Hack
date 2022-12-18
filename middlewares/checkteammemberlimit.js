const Teammember = require('../models/TeamMember');

// Middleware to get a single problem statement
const checkteammemberlimit = async (req, res, next) => {
  const id=req.params.id;
  try {
   
    let Teammemberlimit = await Teammember.find({teamId:id})
    if(Teammemberlimit!=null){
    function json2array(json) {
        var result = [];
        var keys = Object.keys(json);
        keys.forEach(function(key) {
            result.push(json[key]);
        });
        return result;
    }
    const Teammemberlimitarray = json2array(Teammemberlimit);
   
   
   
     if(Teammemberlimitarray.length==5){
      return res.redirect(`/get_team_member_details/${id}`)
    }
  }
  } catch (error) {
   return res.redirect(`/get_team_member_details/${id}`)
  }

  next()
 
};

module.exports = checkteammemberlimit;