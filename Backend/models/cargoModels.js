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

cargoItemSchema.methods.calculateVolume = function () {
  return this.length * this.breadth * this.height; 
};
 
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

containerSchema.methods.calculateVolume = function () {
  return this.length * this.breadth * this.height; 
};

containerSchema.methods.checkAvailableSpace = async function (parcel) {
  const currentCargoItems = await CargoItem.find({ _id: { $in: this.cargoItems } });

  let currentUsedSpace = currentCargoItems.reduce(
    (acc, item) => acc + parseFloat(item.calculateVolume()),
    0
  );

  let totalVolume = this.calculateVolume();
  let parcelVolume = parseFloat(parcel.length) * parseFloat(parcel.breadth) * parseFloat(parcel.height);
  
  totalVolume = parseFloat(totalVolume);
  currentUsedSpace = parseFloat(currentUsedSpace);
  parcelVolume = parseFloat(parcelVolume);

  console.log(totalVolume, currentUsedSpace, parcelVolume);
  if(totalVolume === currentUsedSpace)
      return false;
  if(totalVolume < currentUsedSpace + parcelVolume)
      return false;
  return true;
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
