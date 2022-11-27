import mongoose, { Model, Schema } from "mongoose";
import bcrypt from "bcryptjs"

const schema = new mongoose.Schema(
  {
    name: {
      type: mongoose.SchemaTypes.String,
      required: true,
    },
    mobileNo: {
      type: mongoose.SchemaTypes.Number,
      required: true,
    },
    friends: [],
    lastSeen: {
      type: mongoose.SchemaTypes.Mixed,
      default: Date.now,
    },
    photo: {
      type: String,
    },
    email:{
      type: String,
      required:[true, "Provide a email"]
    },
    password: {
      type: String,
      required: [true, "Provide a password"],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Provide confirm your password"],
      validate: {
        //This only works on CREATE AND SAVEE!!!
        validator: function (el: string) {
          return el === this.password;
        },
        message: "passwords are not the same",
      },
    },
    authToken: {
      type: String,
      required: false,
      select:false
    },
    passwordChangedAt: { type: Date },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  { 
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

schema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

schema.pre('save', async function (next) {
  //only run this function if password was modified
  if (!this.isModified('password')) return next();

  //Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  //Delete the password confirm field
  this.passwordConfirm = undefined;
  next();
});

schema.methods.correctPassword = async function (candidatePassword: string,userPassword: string) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const model: any = mongoose.model;
const user : Model<Schema> = new model("User", schema, "user");

export default user;
