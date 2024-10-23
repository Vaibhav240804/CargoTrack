import mongoose from "mongoose";

// Schema for a cargo item
const cargoItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  length: {
    type: Number,
    required: true, // Length of the item
  },
  breadth: {
    type: Number,
    required: true, // Breadth of the item
  },
  height: {
    type: Number,
    required: true, // Height of the item
  },
});

// Method to calculate the volume of the cargo item
cargoItemSchema.methods.calculateVolume = function () {
  return this.length * this.breadth * this.height; // Volume in cubic units
};

// Schema for a container
const containerSchema = new mongoose.Schema({
  length: {
    type: Number,
    required: true,
  },
  breadth: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  availableFrom: {
    type: Date,
    required: true,
  },
  availableUntil: {
    type: Date,
    required: true,
  },
  from:{
    type: String,
    required: true,
  },
  to:{
    type: String,
    required: true
  },
  cargoItems: [],
});

// Method to calculate the volume of the container
containerSchema.methods.calculateVolume = function () {
  return this.length * this.breadth * this.height; // Volume in cubic units
};

// Method to check available space in the container
containerSchema.methods.checkAvailableSpace = function (item) {
  const currentUsedSpace = this.cargoItems.reduce(
    (acc, cargoItem) => acc + cargoItem.calculateVolume(),
    0
  );
  const totalVolume = this.calculateVolume();
  const availableSpace = totalVolume - currentUsedSpace;

  return availableSpace >= item.calculateVolume(); // Return true if there's enough space for the item
};

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  phone: {
    type: Number,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
  },
  containers: [containerSchema],
});

const Admin = mongoose.model("Admin", adminSchema);
const CargoItem = mongoose.model("CargoItem", cargoItemSchema);
const Container = mongoose.model("Container", containerSchema);

export { Admin, CargoItem, Container };
