import mongoose  from "mongoose";

const schema = new mongoose.Schema(
  {
    name: { 
        type: mongoose.SchemaTypes.String, 
        required: true 
    },
    mobileNo: { 
        type: mongoose.SchemaTypes.Number, 
        required: true 
    },
    password: {
        type: mongoose.SchemaTypes.String, 
        default: ""
    },
    friends: [mongoose.SchemaTypes.ObjectId],
    lastSeen: { 
        type: Date, default: Date.now 
    },
  },
  { timestamps: true }
);

const model : any = mongoose.model
const user = new model("User", schema, "user");

export default user;
