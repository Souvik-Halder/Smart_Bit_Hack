const express = require("express");
const router = express.Router();
const multer = require("multer");
const Teams = require("../models/Teams");
const admin=require('../middlewares/admin')
const fs=require('fs')
const auth = require("../middlewares/auth");
const checkteamleaderlimit=require('../middlewares/checkteamleaderlimit');
const fetchteamlead=require('../middlewares/fetchteamlead');
const fetchteammmember=require('../middlewares/fetchteammember');
const TeamMember = require("../models/TeamMember");
const checkpslimit =require('../middlewares/checkpslimit')
const checkteammemberlimit=require('../middlewares/checkteammemberlimit')
const nodemailer=require('nodemailer');
const PSsubmission = require("../models/PSsubmission");
const JWT_SECRET = "Souvikisagoodboy";

//upload image Setup by using multer
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./uploads"); //we need to create the directory
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    },
});
//middleware setup by multer
var upload = multer({
    
    storage: storage,
}).single("pdffile");


//Node Mailer Setup
const transporter=nodemailer.createTransport({
    service: "outlook",
    auth:{
        user:'souvikasuslaptop@outlook.com',
        pass:"souvik@laptop"
    }
});


//routes
router.get("/", (req, res) => {
    user_id = [0];
    let message=req.flash('message')[0]
    let type=req.flash('type')[0]
    res.render("index_1", { user_id,message,type });
});
//problem statement submission
router.get("/teamsadd/:id", auth, checkteamleaderlimit,(req, res) => {
    const user_id = req.params.id;
    let message=req.flash('message')[0]
    let type=req.flash('type')[0]
    res.render("TeamLeader", { user_id ,message,type });
});

router.post("/teamsadd/:id", auth,checkteamleaderlimit, async(req, res) => {
    const id = req.params.id;

    const {
        teamname,
        teamleadername,
        phone,
        email,
        whatsappnumber,
        institution,
    } = req.body;

    if(!teamname || !teamleadername || !phone || !email || !whatsappnumber || !institution){
        req.flash('message','Please Fill All the Fields');
        req.flash('type','danger');
        res.redirect(`/teamsadd/${id}`)
    }
    else{
    try {
        let team = await Teams.findOne({ email: req.body.email });
        if (team) {
            req.flash('message','This Email ID already submitted the team details');
            req.flash('type','danger');
            res.redirect(`/teamsadd/${id}`)
        }
        else{
        team = await Teams.create({
            teamid: id,
            teamname,
            teamleadername,
            phone,
            email,
            institution,
            whatsapp: whatsappnumber,
        });
        await team.save();
        const data = {
            team: {
                id: team.teamid,
            },
        };
        req.flash('message','Team Leader Details Saved Successfully');
        req.flash('type','success');
        res.redirect(`/get_team_intro/${team.teamid}`);
    }
    } catch (error) {
        req.flash('message','Please provide the correct credent');
        req.flash('type','danger');
        res.redirect(`/get_team_intro/${id}`);
    }
}
});

//TeamMember information submission

router.post("/add_team_member/:id", auth,fetchteamlead,checkteammemberlimit,async(req, res) => {
    const id = req.params.id;
    try {
        const { name1, branch1, emailid1, phone1 } = req.body;
        if(!name1 || !branch1 || !phone1 || !emailid1 ){
            req.flash('message','Please fill up the all fields')
            req.flash('type','danger')
            res.redirect(`/get_team_member_details/${id}`)
        }
        else{
        let teammember = await TeamMember.findOne({ emailid1 });
        if (teammember) {
            success = false;
            req.flash('message','This Emails is already used . Please provide different email');
            req.flash('type','danger');
            res.redirect(`/get_team_member_details/${id}`)
        }
   else{
        teammember = new TeamMember({
            name1,
            branch1,
            emailid1,
            phone1,
            teamId: id,
        });
        const savedteammember = await teammember.save();
        req.flash('message','Team Member Saved Successfully');
        req.flash('type','danger')
        res.redirect(`/get_team_member_details/${id}`);
    }
}
    } catch (error) {
       
       req.flash('message',error.message);
       req.flash('type','danger');
       res.redirect(`/get_team_member_details/${id}`);
    }

});

router.get("/add_team_member/:id",fetchteamlead,checkteammemberlimit, auth,(req, res) => {
    const id = req.params.id;
    res.render("add_team_member", { id });
});

//Problem Statement submit post route

router.post("/add_problem_statement/:id",auth,fetchteamlead,fetchteammmember,checkpslimit,upload,async(req, res) => {
    const id = req.params.id;
   
    try {
      
        const { idea, ideadesc ,psid } = req.body;
    let file =await PSsubmission.findOne({file:req.file.filename});
    if(file){
        req.flash('message','Please Change the file name and submit the file with different file name');
        req.flash('type','danger')
        res.redirect(`/add_problem_statement/${id}`)
    }
     else  if(!idea || !ideadesc || !psid || !(req.file.filename)){
    req.flash('message','Please fill the all fields');
    req.flash('type','danger')
    res.redirect(`/add_problem_statement/${id}`)
  }
  else{
        const pssubmitone = new PSsubmission({
            idea,
            ideadesc,
            psid,
            teamId: id,
            file:req.file.filename,
        });
        const savedpssubmitone = await pssubmitone.save();
        req.flash('message','Your Problem Statement Submitted Successfully')
        req.flash('type','success')
        res.redirect(`/get_problem_statement/${id}`);
    }
    } catch (error) {
        console.log(error)
        req.flash('message','Please Provide Correct Credentials')
        req.flash('type','danger')
        res.redirect(`/get_problem_statement/${id}`);
    }
});

//problem statement submit route
router.get("/add_problem_statement/:id", fetchteamlead,fetchteammmember,checkpslimit,auth,(req, res) => {
    const id = req.params.id;
    let message=req.flash('message')[0]
                    let type=req.flash('type')[0]

    res.render("add_problem_statement", { id ,message,type });
});

//route to get the team members
router.get("/get_team_intro/:id",auth,(req, res) => {
    const id = req.params.id;

    Teams.find({ teamid: id }, (err, teamdetail) => {

        if (err) {
            res.json(err);
        } else {
            function json2array(json) {
                var result = [];
                var keys = Object.keys(json);
                keys.forEach(function(key) {
                    result.push(json[key]);
                });
                return result;
            }
            const teamintro = json2array(teamdetail);
            const message=req.flash('message')[0]
            
            const type=req.flash('type')[0]
            res.render('get_team_intro', { teamintro , id,message,type })
        }
    });

});

//route to get teammember details

router.get('/get_team_member_details/:id', fetchteamlead,auth,(req, res) => {
    const id = req.params.id;

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
                res.render('get_team_member_details', { teammemberdetails, id , message,type })
            } else { 
                      
                res.render('get_team_member_details', { teammemberdetails, id })
            }

        }

    });

})


//route to get the problem statements
router.get("/get_problem_statement/:id", auth,fetchteamlead,fetchteammmember,(req, res) => {
    const id = req.params.id;

    PSsubmission.find({ teamId: id }, (err, problemstatements) => {
        if (err) {
            res.redirect("/");
        } else {
            if (problemstatements == null) {
                res.render('get_problem_statement', { problemstatements, id })
            } else {
                const success = "true";
                let message=req.flash('message')[0]
                    let type=req.flash('type')[0]

                res.render('get_problem_statement', { problemstatements, id ,message,type })
            }
        }
    });
});

//About Us Route
router.get("/aboutus", (req, res) => {
    res.render("aboutus");
});


//Dashboard code is here
router.get('/dashboard', auth,(req, res) => {
    const message=req.flash('message')[0]
  
    const type=req.flash('type')[0]
    res.render('dashboard_1',{user_id:req.user.id,message,type})
})

//Delete team member
router.get('/delete_team_member/:id1/:id2',auth,(req,res)=>{
    let id1=req.params.id1;
    let id2=req.params.id2

    TeamMember.findByIdAndRemove(id2,(err,result)=>{
   
  if(err){
 
      res.json({
      message:err.message
      })
    
  }
  else{
    

      res.redirect(`/get_team_member_details/${id1}`);
     
  }
    })
  })


//update team member post route

router.post('/update_team_member/:id1/:id2',auth,(req,res)=>{
    let id1=req.params.id1;
    let id2=req.params.id2;
  

    TeamMember.findByIdAndUpdate(id2,{
        name1:req.body.name1,
        teamId:id1,
        emailid1:req.body.emailid1,
        phone1:req.body.phone1,
        branch1:req.body.branch1
    },(err,result)=>{
        if(err){
            res.json({err:err})
        }
        else{
            req.session.message={
                type:'success',
                message:'Updated user successfully'
            };
    
            res.redirect(`/get_team_member_details/${id1}`);
        }
    })
})

//update team member get route
router.get('/edit_team_member/:id1/:id2',auth,(req,res)=>{
    let id1=req.params.id1;
    let id2=req.params.id2;
    TeamMember.findById(id2,(err,user)=>{
        if(err){
            res.redirect('/');
        }
        else{
            if(user == null){
                res.redirect('/');
            }
            else{
                res.render('edit_team_member',{
                    title:"Edit User",
                    user:user,
                    teamId:id1,
                })
            }
        }
    })
})
//update team leader details post route
router.post('/update_team_lead/:id1/:id2',auth,(req,res)=>{
    let id1=req.params.id1;
    let id2=req.params.id2;
  

    Teams.findByIdAndUpdate(id2,{
        teamname:req.body.teamname,
        teamid:id1,
        teamleadername:req.body.teamleadername,
        email:req.body.email,
        phone:req.body.phone,
        whatsapp:req.body.whatsappnumber,
        institution:req.body.institution
    },(err,result)=>{
        if(err){
            res.json({err:err})
        }
        else{
            req.session.message={
                type:'success',
                message:'Updated user successfully'
            };
    
            res.redirect(`/get_team_intro/${id1}`);
        }
    })
})

//update team leader details get route
router.get('/edit_team_lead/:id1/:id2',auth,(req,res)=>{
    let id1=req.params.id1;
    let id2=req.params.id2;
    Teams.findById(id2,(err,user)=>{
        if(err){
            res.redirect('/');
        }
        else{
            if(user == null){
                res.redirect('/');
            }
            else{
             
                res.render('edit_team_leader',{
                    title:"Edit User",
                    user:user,
                    teamid:id1,
                })
            }
        }
    })
})

//update Problem Statement Deltails  get route

router.post('/update_submitted_ps/:id1/:id2',auth,upload,(req,res)=>{
    let id1=req.params.id1;
    let id2=req.params.id2;
   
    let new_file="";
    if(req.file){
        
        new_file=req.file.filename;
      
        try{
            fs.unlinkSync('./uploads/'+req.body.old_file);
           
        }catch(err){
           
            console.log(err);
        }
    }else{
        new_file=req.body.old_file;
    }
    console.log(new_file)
  
    PSsubmission.findByIdAndUpdate(id2,{
        
        teamId:id1,
        psid:req.body.psid,
        idea:req.body.idea,
        ideadesc:req.body.ideadesc,
        file:new_file
    },(err,result)=>{
        if(err){
            res.json({err:err})
        }
        else{
            req.session.message={
                type:'success',
                message:'Updated  successfully'
            };
    
            res.redirect(`/get_problem_statement/${id1}`);
        }
    })
})

//update Problem Statement Deltails  get route
router.get('/edit_submitted_ps/:id1/:id2',auth,upload,(req,res)=>{
    let id1=req.params.id1;
    let id2=req.params.id2;
    PSsubmission.findById(id2,(err,user)=>{
        if(err){
            res.redirect('/');
        }
        else{
            if(user == null){
                res.redirect('/');
            }
            else{
             
                res.render('edit_problem_statement',{
                    title:"Edit User",
                    user:user,
                    teamId:id1,
                })
            }
        }
    })
})



router.post('/select_option',admin,(req,res)=>{
    const email=req.body.email
   transporter.sendMail({
       from:"souvikasuslaptop@outlook.com",
       to:email,
       subject:"Selection Of Hackathon",
       text:"Congratulations! Your team has been selected in this hackathon 🥳🥳"
   },(err,info)=>{
       if(err){
           console.log(err)
       }
       console.log("Send successfully"+info.response) 
       res.redirect('/')
   })
   
   })

//Download pdf
router.get('/download/:id',admin,async(req,res)=>{
    const id=req.params.id;
    let submittedps=await PSsubmission.find({teamId:id});
    if(submittedps){
        
        res.download('./uploads/'+submittedps[0].file)
    }
    
})

router.get('/download_sample_pdf',auth,async(req,res)=>{
    res.download('./uploads/Sample.pptx');
})


module.exports = router;