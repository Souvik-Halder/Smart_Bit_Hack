const mongoose=require('mongoose');
const teamsSchema=mongoose.Schema({
    teamid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
        },
    teamname:{
        type:String,
        require:true
    },
    teamleadername:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
    },
    phone:{
        type:String,
        require:true
    },
    whatsapp:{
      type:String,
      require:true  
    },
    institution:{
        type:String,
        require:true
    },
    created:{
        type:Date,
        require:true,
        default:Date.now,
    }
});
module.exports=mongoose.model('team',teamsSchema);