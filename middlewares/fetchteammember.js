const Teammember = require('../models/TeamMember');

// Middleware to get a single problem statement
const fetchteammember = async (req, res, next) => {
  
  try {
    const id=req.params.id;
    let TeammemberDetails = await Teammember.find({teamId:id})
    function json2array(json) {
        var result = [];
        var keys = Object.keys(json);
        keys.forEach(function(key) {
            result.push(json[key]);
        });
        return result;
    }
    const TeammemberDetailsarray = json2array(TeammemberDetails);
   
    if (TeammemberDetails === null){
      return res.redirect(`/get_team_member_details/${id}`);
    }
    else if(TeammemberDetailsarray.length==0){
      return res.redirect(`/get_team_member_details/${id}`)
    }
    else if(TeammemberDetailsarray.length>0 && TeammemberDetailsarray.length<5){
      
        return res.redirect(`/get_team_member_details/${id}`)
    }
  } catch (error) {
    res.redirect(`/get_team_member_details/${id}`)
  }

  
  next();
};

module.exports = fetchteammember;