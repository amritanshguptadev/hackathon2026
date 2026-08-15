const { string } = require('joi');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name:{
        type:String ,
        required: true,
    },
    email:{
        type:String ,
        required: true,
        unique:true
    },
    password:{
        type:String,
        require:true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isVerified:{
        type:String,
        default:"Verified"
    }
});

const UserModel = mongoose.model("users",UserSchema);
module.exports = UserModel;