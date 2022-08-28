const express=require('express');
const router=express.Router();
const multer=require('multer');
const Teams = require('../models/Teams');

//upload image
var storage=multer.diskStorage({
    destination: function(req,file,cb) {
        cb(null,'./public/uploads')//we need to create the directory
    },
    filename:function(req,file,cb){
        cb(null,file.originalname)
    }
})

var upload = multer({
    storage:storage
}).single('image')


//routes
router.get('/',(req,res)=>{
    res.render('index');
})
//problem statement submission
router.get('/teamsadd',(req,res)=>{
    res.render('PSsubmit');
});



router.post('/teamsadd',(req,res)=>{
    console.log(req.body);
    const {teamname,teamleadername,phone,email,whatsappnumber}=req.body;
    const team=new Teams({
       teamname,
       teamleadername,
       phone,
       email,
      whatsapp: whatsappnumber,
    });
    team.save((err)=>{
        if(err){
            res.json({message:err.message,type:'danger'});
        }
        else{
            req.session.message={
                type:'success',
                message:'Team Leader added succussfully'
            };
            res.redirect('/addteammember')
        }
    })
})




module.exports=router;