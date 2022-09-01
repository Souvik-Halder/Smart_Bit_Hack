const express=require('express');
const router=express.Router();
const multer=require('multer');
const Teams = require('../models/Teams');
var jwt = require('jsonwebtoken');


const TeamMember = require('../models/TeamMember');

const PSsubmission = require('../models/PSsubmission');
const JWT_SECRET="Souvikisagoodboy";

//upload image
var storage=multer.diskStorage({
    destination: function(req,file,cb) {
        cb(null,'./uploads')//we need to create the directory
    },
    filename:function(req,file,cb){
        cb(null,file.originalname)
    }
})

var upload = multer({
    storage:storage
}).single('file1')




//routes
router.get('/',(req,res)=>{
    res.render('index');
})
//problem statement submission
router.get('/teamsadd',(req,res)=>{
    res.render('TeamLeader');
});



router.post('/teamsadd',async(req,res)=>{
    console.log(req.body);

    const {teamname,teamleadername,phone,email,whatsappnumber,institution}=req.body;
    try{
        let team=await Teams.findOne({email:req.body.email})
        if(team){
            return res.status(400).json({success,errors:'Please enter a valid email'});
        }
       team= await Teams.create({
        teamname,
        teamleadername,
        phone,
        email,
        institution,
       whatsapp: whatsappnumber,
          })
          const data={
            team:{
                id:team.id
            }
        }
       res.redirect(`/add_team_member/${team.id}`);
        }catch(error){
            console.log("error.message");
           
            res.json({error});
        }  
    
})

//TeamMember information submission

router.post('/add_team_member/:id',async(req,res)=>{
 
   const id=req.params.id;
        try{
        const {name1,branch1,emailid1,phone1}=req.body;
     
       let teammember=await TeamMember.findOne({emailid1});
       if(teammember){
        success=false;
        res.json({success,msg:"please enter a valid email"});
       }
            
         teammember=new TeamMember({
            name1,branch1,emailid1,phone1,teamId:id
        })
        const savedteammember=await teammember.save();
     res.json({savedteammember})
    }catch(error){
        console.log(error.message);
        res.status(500).send("Internal Server Error Occured");
    }
})
    
router.get('/add_team_member/:id',(req,res)=>{
   const id=req.params.id;
    res.render('add_team_member',{id})
})


router.post('/add_problem_statement/:id',upload,async (req,res)=>{
   const id=req.params.id;
   console.log(req.file);
   try{
      const {idea,ideadesc}=req.body;
   
      
      const pssubmitone=new PSsubmission({
        idea,ideadesc,file1:req.file.filename,file2:req.file.filename,teamId:id
      });
      const savedpssubmitone=await pssubmitone.save();
      res.json({savedpssubmitone});
   }catch(error){
    console.log(error);
    res.json({msg:"Invalid response was sent"});
   }
   
})

//problem statement submit route
router.get('/add_problem_statement/:id',(req,res)=>{
    const id=req.params.id;
    res.render('add_problem_statement',{id});
})


//route to get the team members
router.get('/get_team_member/:id',(req,res)=>{
    const id=req.params.id;

    TeamMember.find({teamId:id},(err,teammember)=>{
        if(err){
            res.redirect('/');
        }
        else{
            if(teammember == null){
                res.json({msg:"plase provide correct credentials"});
            }
            else{
                const success= "true";
                res.json({teammember,success:"true"})
            }
        }
    })
   
})

//route to get the problem statements
router.get('/get_problem_statement/:id',(req,res)=>{
    const id=req.params.id;

    PSsubmission.find({teamId:id},(err,problemstatements)=>{
        if(err){
            res.redirect('/');
        }
        else{
            if(problemstatements == null){
                res.json({msg:"plase provide correct credentials"});
            }
            else{
                const success= "true";
                res.json({problemstatements,success:"true"})
            }
        }
    })
   
})
module.exports=router;