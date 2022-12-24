const express=require('express');
const router=express();
const admin=require('../middlewares/admin')
const auth=require('../middlewares/auth')
const ProblemStatement=require('../models/ProblemStatements')
const {

    getOneProblemDashboard
    
  } = require('../controllers/problemsController');
  const getProblem = require('../middlewares/fetchProblem');

//About Us Dashboard
router.get('/about_us_dashboard',auth,(req,res)=>{
    const id=req.user._id;
    res.render('about_us_dashboard',{id});
})

router.get('/contact_us',(req,res)=>{
    res.render('contact_us');
})

router.get('/contact_us_dashboard',auth,(req,res)=>{
    const id=req.user._id;
    res.render('contact_us_dashboard',{id})
})



router.get('/expand_ps_dashboard/:id', auth,getProblem, getOneProblemDashboard);

router.get('/problem_statements_dashboard',auth,async(req,res)=>{
    const id=req.user._id;
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
      res.render('all_problem_statements_dashboard',{id,statementsarr})
      } catch (error) {
       res.redirect('/dashboard')
      }
   
})

module.exports = router;