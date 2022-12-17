
const passport=require('passport');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 7000;
const mongoose = require('mongoose');
const session = require('express-session');
const flash=require('connect-flash');

DB_URI="mongodb+srv://SouvikHalder:souvikhalder@cluster0.a3bkc.mongodb.net/collagehackathon?retryWrites=true&w=majority";


app.use(express.static('public'));


//database connection
mongoose
  .connect(DB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('Mongodb connected');
  })
  .catch(err => {
    console.log(err);

});

//middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    secret: 'my secret key',
  
    saveUninitialized: true,
    resave: false,
  })
);
app.use(flash());
app.use((req, res, next) => {
  (res.locals.message = req.session.message), delete req.session.message;
  next();
});


//set template engine

app.set('view engine', 'ejs');

//passport configuration
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);


//routes
app.use('/', require('./routes/team'));
app.use('/problem-statements', require('./routes/problemslRouter'));
app.use('/',require('./routes/user'));






app.listen(PORT,(err)=>{
    console.log(`server running at ${PORT}`)
})
