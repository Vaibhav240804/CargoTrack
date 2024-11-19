import mongoose from "mongoose";
import cities from "../data/cities.json" assert { type: "json" };

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
  from: {
    type: String,
    required: true,
    enum: cities, // Ensures from city is valid
  },
  to: {
    type: String,
    required: true,
    enum: cities, // Ensures to city is valid
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
  from: {
    type: String,
    required: true,
    enum: cities, // Add enum using city list
  },
  to: {
    type: String,
    required: true,
    enum: cities, // Add enum using city list
  },
  cost: {
    type: Number,
    required: true,
  },
  cargoItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CargoItem", 
      default: [],
    },
  ],
});

// Method to calculate the volume of the container
containerSchema.methods.calculateVolume = function () {
  return this.length * this.breadth * this.height; // Volume in cubic units
};

containerSchema.methods.checkAvailableSpace = function (parcel) {
  const currentUsedSpace = this.cargoItems.reduce(
    (acc, cargoItem) =>
      acc + cargoItem.calculateVolume ? cargoItem.calculateVolume() : 0,
    0
  );
  const totalVolume = this.calculateVolume();
  const parcelVolume = parcel.height * parcel.length * parcel.breadth;
  const availableSpace = totalVolume - currentUsedSpace;

  return availableSpace >= parcelVolume; 
};

containerSchema.methods.percentageUsed = function () {
  const currentUsedSpace = this.cargoItems.reduce(
    (acc, cargoItem) =>
      acc + cargoItem.calculateVolume ? cargoItem.calculateVolume() : 0,
    0
  );
  const totalVolume = this.calculateVolume();
  return (currentUsedSpace / totalVolume) * 100;
};


containerSchema.methods.isSameRoute = function () {
  return this.from === this.to;
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
  containers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Container",
      default: [],
    },
  ],
});

const Admin = mongoose.model("Admin", adminSchema);
const CargoItem = mongoose.model("CargoItem", cargoItemSchema);
const Container = mongoose.model("Container", containerSchema);

export { Admin, CargoItem, Container };
