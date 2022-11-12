const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: { type: mongoose.SchemaTypes.String , required: true},
    mobileNo: { type: mongoose.SchemaTypes.Number, required: true  },
    password: '',
    friends:{type:mongoose.SchemaTypes.Array},
    lastSeen: { type : Date, default: Date.now },
},{ timestamps: true , })

const user = new mongoose.model("User",schema,"user");

module.exports = user;