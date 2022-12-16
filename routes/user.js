//This is for user login and user registration
//This model is for user registration and login

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const guest = require('../middlewares/guest')
const User = require('../models/User');
//Login page
router.get('/login', (req, res) => res.render('login'));

//Register Page
router.get('/register', guest, (req, res) => {
    res.render('register');
})

//Register Handle
router.post('/register', guest, (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];
    //Check required fields
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please d fill in all fields' });
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
                    errors.push({ msg: 'Email is already register' })
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
                                req.flash('success_msg', 'You are now registered and can log in')
                                console.log('sucess')
                                res.redirect('/login');
                            })
                            .catch(err => console.log(err));
                    }))
                }
            })
    }
})

router.post('/login', guest, (req, res, next) => {

    passport.authenticate('local', (err, user, info) => {
        if (err) {
            req.flash('error', info.message)
            next(err)
        }
        if (!user) {
            req.flash('error', info.message)
            res.redirect('/login')
        }
        req.logIn(user, (err) => {
            if (err) {
                req.flash('error', info.message)
                next(err)
            }

            console.log(user.id)
            const user_id = user.id
            console.log(user_id)
            req.flash({ type: "danger", msg: "Now you can submit your application" })
            res.render('dashboard', { user_id })
        })
    })(req, res, next);
})


router.get('/tailwind', guest, (req, res) => {
    res.render('tailwind');
})

module.exports = router;