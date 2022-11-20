import mongoose from 'mongoose';
const { SchemaTypes } = mongoose

const schema = new mongoose.Schema({
    content: { 
        type: SchemaTypes.String, 
        required: true 
    },
    status: { 
        type: SchemaTypes.String, 
        enum: ["SENT", "DELIVERED", "SEEN", "FAILED"], 
        default: "SENT" 
    },
    sender: { 
        type: SchemaTypes.ObjectId, 
        required: true 
    },
    recipients: [SchemaTypes.ObjectId],
    type: { 
        type: SchemaTypes.String, 
        enum: ["SYSTEM", "USER", "BOT"] 
    },
    source: { 
        type: SchemaTypes.ObjectId, 
        required: false, 
        default: "" 
    },
    conversationId: SchemaTypes.ObjectId
}, { 
    timestamps: true 
})

const model : any = mongoose.model
const message = new model("Message", schema, "message");

export default message