import { Container, CargoItem } from "../models/cargoModels.js";
import { User, Booking } from "../models/userSchema.js";

export const createBooking = async (req, res) => {
  const { email, from, to, height, width, breadth, description } = req.body;

  try {
    if (from === to) {
      return res
        .status(400)
        .json({ message: "Source and destination cannot be the same." });
    }

    const container = await Container.findOne({ from, to });
    if (!container) {
      return res
        .status(400)
        .json({ message: "No container available for the specified route." });
    }

    const parcel = { height, length: width, breadth }; // Match schema terms
    if (!container.checkAvailableSpace(parcel)) {
      return res.status(400).json({
        message: "Not enough space to accommodate the parcel.",
        proceedToPayment: false,
      });
    }

    const cost =
      parcel.height * parcel.length * parcel.breadth * container.cost;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    
    if (!user.bookings) {
      user.bookings = [];
    }

    const newBooking = new Booking({
      from,
      to,
      height,
      width,
      breadth,
      description,
      cost,
      status: "Pending",
      requiredOn: new Date(),
      destinedContainer: container._id,
    });

    await newBooking.save();
    user.bookings.push(newBooking._id);
    await user.save();

    res.status(200).json({
      message: `Found container, available from ${container.availableFrom} at ${container.from} to ${container.to}.`,
      proceedToPayment: true,
      bookingID: newBooking._id,
      cost,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error processing booking.", error });
  }
};

export const getBookings = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email }).populate("bookings");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(user.bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching bookings.", error });
  }
};

export const makePayment = async (req, res) => {
  const { bookingId } = req.body;

  try {
    const bookingDoc = await Booking.findById(bookingId).populate(
      "destinedContainer"
    );
    if (!bookingDoc) {
      return res.status(404).json({ message: "Booking not found." });
    }

    const container = bookingDoc.destinedContainer;
    if (!container) {
      return res
        .status(404)
        .json({ message: "No container found for the booking." });
    }

    const cargoItem = new CargoItem({
      name: `Cargo for ${bookingDoc.from} to ${bookingDoc.to}`,
      length: bookingDoc.width,
      breadth: bookingDoc.breadth,
      height: bookingDoc.height,
      from: bookingDoc.from,
      to: bookingDoc.to,
    });

    const parcel = {
      height: cargoItem.height,
      breadth: cargoItem.breadth,
      length: cargoItem.length,
    };

    if (!container.checkAvailableSpace(parcel)) {
      return res
        .status(400)
        .json({ message: "Not enough space in the container." });
    }

    bookingDoc.isPaid = true;
    bookingDoc.status = "Confirmed";
    await bookingDoc.save();

    await cargoItem.save();
    container.cargoItems.push(cargoItem);
    await container.save();

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
