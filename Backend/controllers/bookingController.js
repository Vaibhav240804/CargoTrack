import { Container, CargoItem } from "../models/cargoModels.js";
import { User, Booking } from "../models/userSchema.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();


export const createBooking = async (req, res) => {
  let { email, from, to, height, width, breadth, description } = req.body;
  height = parseFloat(height);
  width = parseFloat(width);
  breadth = parseFloat(breadth);

  try {
    if (from === to) {
      return res
        .status(400)
        .json({ message: "Source and destination cannot be the same." });
    }

    // Find the first available container on the route
    const containers = await Container.find({ from, to });
    if (!containers.length) {
      return res
        .status(400)
        .json({ message: "No containers available for the specified route." });
    }

    const parcel = { height, length: width, breadth };
    const maxParcelDimension = Math.max(parcel.height, parcel.length, parcel.breadth);

    // Try to find a container with enough space
    let availableContainer = null;
    for (const container of containers) {
      const maxContainerDimension = Math.max(container.height, container.length, container.breadth);

      if (maxParcelDimension > maxContainerDimension) {
        continue; // Skip this container if parcel is too large
      }

      const isAvailable = await container.checkAvailableSpace(parcel);
      if (isAvailable) {
        availableContainer = container;
        break; // Container found with enough space
      }
    }

    // If no container is available
    if (!availableContainer) {
      return res.status(400).json({
        message: "Not enough space to accommodate the parcel in any available container.",
        proceedToPayment: false,
      });
    }

    // Calculate cost based on the selected container
    const cost = parcel.height * parcel.length * parcel.breadth * availableContainer.cost;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!user.bookings) {
      user.bookings = [];
    }

    // Create a new booking for the selected container
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
      destinedContainer: availableContainer._id,
    });

    await newBooking.save(); // Add await for saving booking

    user.bookings.push(newBooking._id);
    await user.save(); // Add await for saving user

    res.status(200).json({
      message: `Booking successful. Parcel will be shipped using container from ${availableContainer.from} to ${availableContainer.to}.`,
      proceedToPayment: true,
      bookingID: newBooking._id,
      cost: cost,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error processing booking.", error });
  }
};


export const getBookings = async (req, res) => {
  const { userID } = req.body;

  console.log(req.body);
  try {
    const user = await User.findById(userID).populate("bookings");
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
  const { bookingId , email } = req.body;

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

    if (bookingDoc.isPaid) {
      return res.status(400).json({ message: "Booking already paid for." });
    }

    bookingDoc.isPaid = true;
    bookingDoc.status = "Confirmed";
    await bookingDoc.save();

    await cargoItem.save();
    container.cargoItems.push(cargoItem);
    await container.save();


    try {
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MAIL,
          pass: process.env.MAILPASS,
        },
      });
      console.log("users email: ", email);
      let mailOptions = {
        from: `RailCart <${process.env.MAIL}>`,
        to: email,
        subject: "Booking payment successful",
        html: `<h1>Booking payment successful</h1>
        <p>Your booking from ${bookingDoc.from} to ${bookingDoc.to} has been confirmed.</p>
        <p>Cost: ₹${bookingDoc.cost}</p>
        <br>
        <p>Container details:</p>
        <p>Container ID: ${container._id}</p>
        <p>Container from: ${container.from}</p>
        <p>Container to: ${container.to}</p>
        <p>Container available from: ${container.availableFrom}</p>
        <p>Container cost: ₹${container.cost}</p>
        <p>Container dimensions: ${container.height}ft x ${container.length}ft x ${container.breadth}ft</p>
        <br>
        <p>Cargo item details:</p>
        <p>Cargo item ID: ${cargoItem._id}</p>
        <p>Cargo item name: ${cargoItem.name}</p>
        <p>Cargo item from: ${cargoItem.from}</p>
        <p>Cargo item to: ${cargoItem.to}</p>
        <p>Cargo item dimensions: ${cargoItem.height}ft x ${cargoItem.length}ft x ${cargoItem.breadth}ft</p>
        `,
      };
      await transporter.sendMail(mailOptions);
      console.log("Email sent");
    } catch (error) {
      console.log(error);
    }

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
