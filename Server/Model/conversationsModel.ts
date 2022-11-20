import mongoose from 'mongoose';

const { SchemaTypes } = mongoose

const conversationsSchema = new mongoose.Schema({
    members: {
        type: SchemaTypes.Array, default: [{
            type: SchemaTypes.ObjectId,
            required: true
        }]
    },
    createdBy: {
        type: SchemaTypes.ObjectId,
        required: false
    },
    convoType: {
        type: SchemaTypes.String,
        enum: ["PERSONAL", "GROUP"],
        default: "PERSONAL",
        required: true
    },
}, { toJSON: { virtuals: true } ,toObject: { virtuals: true } ,timestamps: true})

conversationsSchema.virtual('recentConversations', {
    ref:'Message',
    localField:'_id',
    foreignField:'conversationId'
  });
  
const model : any = mongoose.model
const conversions = new model("Conversations", conversationsSchema, "conversations");

export default conversions;