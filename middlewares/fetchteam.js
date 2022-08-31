//Basically this fetchuser is used for fetching the user
var jwt=require("jsonwebtoken");

const JWT_SECRET="Souvikisagoodboy";
const fetchteam=(req,res,next)=>{
//Get the user from the jwt token  and add id to req object
const token =req.header('auth-token');
if(!token){
    res.status(401).send({error:"PLease authenticate using  a valid1 token"})
}
try{
    const data =jwt.verify(token,JWT_SECRET);
    req.user=data.user;
    next();
}catch(error){
    res.status(401).send({error:"PLease authenticate using  a valid token"})
}

}
module.exports=fetchteam;