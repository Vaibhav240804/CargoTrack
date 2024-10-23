import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  
  },
  email: {
    type: String,
  
    unique:true,
  },
  phone: {
    type: Number,
    required: false,
  },
  password: {
    type: String,
  },
  otp: {
    type: String,
  },
});

const User = mongoose.model("cres_user", userSchema);

export default User;