require('dotenv').config();
<<<<<<< HEAD
const express=require('express');
const app=express();
const mongoose=require('mongoose');
const session=require('express-session');
=======
>>>>>>> 67c5c4ff973eaf8e942e03f6955bc1cef28c0a31

const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;
const mongoose = require('mongoose');
const session = require('express-session');
DB_URI =
  'mongodb+srv://SouvikHalder:souvikhalder@cluster0.a3bkc.mongodb.net/collagehackathon?retryWrites=true&w=majority';

DB_URI="mongodb+srv://SouvikHalder:souvikhalder@cluster0.a3bkc.mongodb.net/collagehackathon?retryWrites=true&w=majority";
const PORT=8000;

app.use(express.static('uploads'))

//database connection
mongoose
  .connect(DB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('Mongodb connected');
  })
  .catch(err => {
    console.log(err);
<<<<<<< HEAD
})
=======
  });
>>>>>>> 67c5c4ff973eaf8e942e03f6955bc1cef28c0a31

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
app.use((req, res, next) => {
  (res.locals.message = req.session.message), delete req.session.message;
  next();
});


//set template engine
<<<<<<< HEAD
app.set('view engine','ejs');

=======
app.set('view engine', 'ejs');
>>>>>>> 67c5c4ff973eaf8e942e03f6955bc1cef28c0a31

//routes
app.use('/', require('./routes/user'));
app.use('/problem-statements', require('./routes/problemslRouter'));

<<<<<<< HEAD





app.listen(PORT,(err)=>{
    console.log(`server running at ${PORT}`)
})
=======
app.listen(PORT, err => {
  console.log(`server is running at the port ${PORT}`);
});
>>>>>>> 67c5c4ff973eaf8e942e03f6955bc1cef28c0a31
