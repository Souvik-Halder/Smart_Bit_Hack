const express = require("express");
const router = express.Router();
const multer = require("multer");
const Teams = require("../models/Teams");
var jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");

const TeamMember = require("../models/TeamMember");

const PSsubmission = require("../models/PSsubmission");
const JWT_SECRET = "Souvikisagoodboy";

//upload image
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./uploads"); //we need to create the directory
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    },
});

var upload = multer({
    storage: storage,
}).single("file1");

//routes
router.get("/", (req, res) => {
    user_id = [0];
    res.render("index", { user_id });
});
//problem statement submission
router.get("/teamsadd/:id", auth, (req, res) => {
    const user_id = req.params.id;
    res.render("TeamLeader", { user_id });
});

router.post("/teamsadd/:id", auth, async(req, res) => {
    const id = req.params.id;

    const {
        teamname,
        teamleadername,
        phone,
        email,
        whatsappnumber,
        institution,
    } = req.body;
    try {
        let team = await Teams.findOne({ email: req.body.email });
        if (team) {
            return res
                .status(400)
                .json({ success: "True", errors: "Please enter a valid email" });
        }
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
        res.redirect(`/get_team_member/${team.teamid}`);
    } catch (error) {
        console.log("error.messagehghjghj");
        console.log(error);
        res.json({ error });
    }
});

//TeamMember information submission

router.post("/add_team_member/:id", async(req, res) => {
    const id = req.params.id;
    try {
        const { name1, branch1, emailid1, phone1 } = req.body;

        let teammember = await TeamMember.findOne({ emailid1 });
        if (teammember) {
            success = false;
            res.json({ success, msg: "please enter a valid email" });
        }

        teammember = new TeamMember({
            name1,
            branch1,
            emailid1,
            phone1,
            teamId: id,
        });
        const savedteammember = await teammember.save();
        res.redirect(`/get_team_member_details/${id}`);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error Occured");
    }
});

router.get("/add_team_member/:id", (req, res) => {
    const id = req.params.id;
    res.render("add_team_member", { id });
});

router.post("/add_problem_statement/:id", upload, async(req, res) => {
    const id = req.params.id;
    console.log(req.file);
    try {
        const { idea, ideadesc } = req.body;

        const pssubmitone = new PSsubmission({
            idea,
            ideadesc,
            file1: req.file.filename,
            file2: req.file.filename,
            teamId: id,
        });
        const savedpssubmitone = await pssubmitone.save();
        res.redirect(`/get_problem_statement/${id}`);
    } catch (error) {
        console.log(error);
        res.json({ msg: "Invalid response was sent" });
    }
});

//problem statement submit route
router.get("/add_problem_statement/:id", (req, res) => {
    const id = req.params.id;
    res.render("add_problem_statement", { id });
});

//route to get the team members
router.get("/get_team_intro/:id", (req, res) => {
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
            res.render('get_team_intro', { teamintro })
        }
    });

});

//route to get teammember details

router.get('/get_team_member_details/:id', (req, res) => {
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

                res.render('get_team_member_details', { teammemberdetails, id })
            } else {

                res.render('get_team_member_details', { teammemberdetails, id })
            }

        }

    });

})


//route to get the problem statements
router.get("/get_problem_statement/:id", (req, res) => {
    const id = req.params.id;

    PSsubmission.find({ teamId: id }, (err, problemstatements) => {
        if (err) {
            res.redirect("/");
        } else {
            if (problemstatements == null) {
                res.render('get_problem_statement', { problemstatements, id })
            } else {
                const success = "true";
                res.render('get_problem_statement', { problemstatements, id })
            }
        }
    });
});

router.get("/aboutus", (req, res) => {
    res.render("aboutus");
});


//Dashboard code is here
router.get('/dashboard',auth,(req,res)=>{
  res.render('dashboard')
})

module.exports = router;
