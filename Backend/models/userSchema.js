import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  height: { type: Number, required: true },
  width: { type: Number, required: true },
  breadth: { type: Number, required: true },
  description: { type: String, required: false },
  status: { type: String, default: 'Pending' }, // e.g., "Pending", "Confirmed", "Rejected"
});

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true },
  phone: { type: Number },
  password: { type: String },
  otp: { type: String },
  bookings: [bookingSchema], // New field to store booking details
});

const User = mongoose.model("cres_user", userSchema);

export default User;