//This is for user login and user registration
//This model is for user registration and login

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const ProblemStatement=require('../models/ProblemStatements')
const admin=require('../middlewares/admin')
const Teams=require('../models/Teams')
const TeamMember=require('../models/TeamMember')
const passport = require('passport');
const guest = require('../middlewares/guest')
const User = require('../models/User');
const PSsubmission = require('../models/PSsubmission');
//Login page
router.get('/login', (req, res) => {
    let errors=[]
    res.render('login',{errors});
});
//Redirect url after login function
const _getRedirectUrl = (req) => {
    if(req.user!=null){
    return req.user.role === 'admin' ? '/admin' : 'dashboard'
    }
    else{
        return 'index'
    }
}
//Register Page
router.get('/register', (req, res) => {
   const errors=[]
    res.render('register',{errors});
})

//Register Handle
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];
    //Check required fields
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill all the fields Properly' });
        
    }

    //check password match
    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match ' });
    }
    if (password.length < 6) {
        errors.push({ msg: 'Passwords should be atleast 6 characters' })
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    } else {
        //validation passed
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    errors.push({ msg: 'Email is already register please try to login' })
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    })
                } else {
                    const newUSer = new User({
                        name,
                        email,
                        password
                    });
                    //Hash Password
                    bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUSer.password, salt, (err, hash) => {
                        if (err) throw err;
                        //Set the password to the hash
                        newUSer.password = hash;
                        //Save user
                        newUSer.save()
                            .then(user => {
                                req.flash('message', 'You are now registered and can log in');
                                req.flash('type','danger')
                               
                                res.redirect('/login');
                            })
                            .catch(err => console.log(err));
                    }))
                }
            })
    }
})

router.post('/login', (req, res, next) => {
    let errors = [];
    passport.authenticate('local', (err, user, info) => {
        if (err) {
           errors.push({msg:'Please provide the correct credentials'})
           
            res.render('login',{errors});
        }
        if (!user) {
            errors.push({msg:'Please provide the correct credentials'})
            res.render('login',{errors})
        }
        req.logIn(user, (err) => {
            if (err) {
                errors.push({msg:'Please provide the correct credentials'})
               res.render('login',{errors})
            }
         else{
            console.log(user.id)
            const user_id = user.id
            console.log(user_id)
            req.flash('message','Logged In Successfully');
          
            req.flash('type','success')
            res.redirect(_getRedirectUrl(req))
         }
        })
    })(req, res, next);
})

// User Logout Route
router.post('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      req.flash('message','Logged Out Successfully')
      req.flash('type','success')
      res.redirect('/');
    });
  });

router.get('/tailwind', guest, (req, res) => {
    res.render('tailwind');
})

//Admin Team Leader Details page 
router.get('/admin',admin,async(req,res)=>{
   res.render('admin_handler')
})

router.get('/admin_team_handler',admin,async(req,res)=>{
    let TeamDetails=await Teams.find();
    function json2array(json) {
        var result = [];
        var keys = Object.keys(json);
        keys.forEach(function(key) {
            result.push(json[key]);
        });
        return result;
    }
    const TeamDetailsarr = json2array(TeamDetails);
 
    res.render('admin_handler_team',{TeamDetailsarr})
})

//Admin Team member Details Page
router.get('/admin_team_member/:id',admin,async(req,res)=>{
    const id=req.params.id;
    TeamMember.find({ teamId: id }, (err, teammember) => {

        if (err) {
            res.json({ err });
        } else {
            function json2array(json) {
                var result = [];
                var keys = Object.keys(json);
                keys.forEach(function(key) {
                    result.push(json[key]);
                });
                return result;
            }
            const teammemberdetails = json2array(teammember);

            if (teammemberdetails.length > 0) {
                const success = "true";
                    let message=req.flash('message')[0]
                    let type=req.flash('type')[0]
                res.render('admin_team_member_handler', { teammemberdetails, id , message,type })
            } else {

                res.render('admin_team_member_handler', { teammemberdetails, id })
            }

        }

    });
})

router.get('/admin_all_ps_handler',admin,async(req,res)=>{
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
    
    res.render('All_Problem_Statements_admin_handler',{statementsarr})
    } catch (error) {
        console.log(error)
     res.redirect('/')
    }
  })
  

//Admin Team Problem Statement Detials Page
router.get('/admin_prolem_statement/:id',admin,(req,res)=>{
    const id=req.params.id;
    PSsubmission.find({ teamId: id }, (err, pssubmissiondetails) => {

        if (err) {
            res.json({ err });
        } else {
            function json2array(json) {
                var result = [];
                var keys = Object.keys(json);
                keys.forEach(function(key) {
                    result.push(json[key]);
                });
                return result;
            }
            const pssubmissiondetailsarr = json2array(pssubmissiondetails);

            if (pssubmissiondetailsarr.length > 0) {
                const success = "true";
               
                res.render('adimin_problem_statement_handler', { pssubmissiondetailsarr, id  })
            } else {

                res.render('adimin_problem_statement_handler', { pssubmissiondetailsarr, id })
            }

        }

    });
})
module.exports = router;