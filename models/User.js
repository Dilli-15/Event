var mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
var userSchema = mongoose.Schema({
    name :{type:String},
    password:{type:String},
    mail:{type:String,required:true,unique: true},
    phonenumber:{type:String},
    registerId:{type:String},
    school:{type:String}
});
userSchema.plugin(uniqueValidator);
module.exports = mongoose.model("User", userSchema);