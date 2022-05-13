var mongoose = require('mongoose');
var eventSchema = mongoose.Schema({
    eventname :{type:String},
    description:{type:String},
    link:{type:String},
    date:{type:Date},
    school:{type:String},
    mail:{type:String},
    phone:{type:String},
    guestlecture:{type:String},
    // Approval to added for dean id
    remarks:{type:String},
    created:{
        id:{type:mongoose.SchemaTypes.ObjectId, ref:"User"},
        name:{type:String}
    }

});
//userSchema.plugin(passportlocalmongoose);
module.exports = mongoose.model("Event", eventSchema);