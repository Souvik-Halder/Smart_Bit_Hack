const express=require('express');
const app=express();
const PORT=process.env.PORT||8000;
const session=require('express-session');

//middlewares
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use(session({
    secret: 'my secret key',
    saveUninitialized:true,
    resave:false

}))
app.use((req,res,next)=>{
    res.locals.message=req.session.message,
    delete req.session.message;
    next();
})

//set template engine
app.set('view engine','ejs');



//routes
app.use('/',require('./routes/user'))


app.listen(PORT,(err)=>{
    console.log(`server is running at the port ${PORT}`)
})
