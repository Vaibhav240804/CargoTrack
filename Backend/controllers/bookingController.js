import { Booking } from "../models/userSchema.js";
import { Container } from "../models/cargoModels.js";
import { CargoItem } from "../models/cargoModels.js";
import User from "../models/userSchema.js";

export const createBooking = async (req, res) => {
  const { email, from, to, height, width, breadth, description } = req.body;

  try {
    if (from === to) {
      return res
        .status(400)
        .json({ message: "Source and destination cannot be the same." });
    }
    console.log("Booking request received for", from, "to", to);
    const containers = await Container.find({ from, to });
    if (!containers.length) {
      return res
        .status(400)
        .json({ message: "No container available for the specified route." });
    }

    // Get the container with the latest availablefrom date
    let container = null;
    let latest = new Date(0);
    for (const c of containers) {
      if (c.availableUntil > latest) {
        latest = c.availableUntil;
        container = c;
      }
    }

    const parcel = { height, width, breadth };
    if (!container.checkAvailableSpace(parcel)) {
      return res.status(400).json({
        message: "Not enough space to accommodate the parcel.",
        proceedToPayment: false,
      });
    }

    const cost = parcel.height * parcel.width * parcel.breadth * container.cost;
    console.log(req.body);
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const newBooking = new Booking({
      from,
      to,
      height,
      width,
      breadth,
      description,
      status: "Pending",
      requiredOn: new Date(),
      cost: cost,
      destinedContainer: container._id,
    });

    newBooking.save();

    user.bookings.push(newBooking);
    await user.save();

    res.status(200).json({
      message: `Found container, most recent available from ${container.availableFrom} at ${container.from} to ${container.to}.\n 
      redirecting to payment of ${cost}.`,
      proceedToPayment: true,
      bookingID: newBooking._id,
      cost: cost,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error processing booking.", error });
  }
};
export const makePayment = async (req, res) => {
  const { bookingId } = req.body;
  console.log("Payment request received for booking ID", bookingId);

  try {
    const user = await User.findOne({ "bookings._id": bookingId });
    if (!user) {
      return res.status(404).json({ message: "Booking not found." });
    }

    const bookingDoc = user.bookings.id(bookingId);
    if (!bookingDoc) {
      return res
        .status(404)
        .json({ message: "Booking not found in user data." });
    }

    bookingDoc.isPaid = true;
    bookingDoc.status = "Confirmed";
    await user.save();

    const cargoItem = new CargoItem({
      name: "Cargo for " + bookingDoc.from + " to " + bookingDoc.to,
      length: bookingDoc.height,
      breadth: bookingDoc.breadth,
      height: bookingDoc.height,
      from: bookingDoc.from,
      to: bookingDoc.to,
    });

    await cargoItem.save();

    const container = await Container.findById(bookingDoc.destinedContainer);
    if (!container) {
      return res
        .status(404)
        .json({ message: "No container found for the booking." });
    }

    if (!container.checkAvailableSpace(cargoItem)) {
      return res
        .status(400)
        .json({ message: "Not enough space in the container." });
    }

    container.cargoItems.push(cargoItem);
    await container.save();

    console.log("Payment successful. Cargo item added to container.");
    res.status(200).json({
      message: "Payment successful. Cargo item added to container.",
      cargoItemId: cargoItem._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error processing payment and cargo allocation.",
      error,
    });
  }
};
