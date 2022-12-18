const mongoose=require('mongoose');
const Schema=mongoose.Schema;


const PSSubmissionsSchema=new Schema({
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
        },
    psid:{
        type:String,
        require:true
    },
    idea:{
        type:String,
        require:true
    },
    ideadesc:{
        type:String,
        require:true
    },
   
});

module.exports=mongoose.model('pssubmit',PSSubmissionsSchema)