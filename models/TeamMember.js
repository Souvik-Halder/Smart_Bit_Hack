const mongoose = require('mongoose')
const Schema = mongoose.Schema

const teammemberSchema = new Schema({
    teamId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user',
                required: true
                },
   
    name1: { type: String, required: true},
    phone1: { type: String, required: true},
    emailid1: { type: String, require: true},
    branch1:{type:String,require:true},
}, { timestamps: true })

module.exports = mongoose.model('Teammember', teammemberSchema)