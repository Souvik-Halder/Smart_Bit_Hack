const pssubmision = require('../models/PSsubmission');

// Middleware to get a single problem statement
const checkpslimit = async (req, res, next) => {
   
  const id=req.params.id;
  try {
   
    const pssubmit = await pssubmision.findOne({teamId:id})
if(pssubmit!=null){
 
    function json2array(json) {
        var result = [];
        var keys = Object.keys(json);
        keys.forEach(function(key) {
            result.push(json[key]);
        });
        return result;
    }
    const pssubmitarray = json2array(pssubmit);

   
   
     if(pssubmitarray.length==3){
      return res.redirect(`/get_problem_statement/${id}`)
    }
}
  } catch (error) {
    console.log(error)
   return res.redirect(`/get_problem_statement/${id}`)
  }

  next()
 
};

module.exports = checkpslimit;