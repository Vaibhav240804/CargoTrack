// controllers/bookingController.js
import User from '../models/userSchema.js';
import { Container } from '../models/cargoModels.js';

export const createBooking = async (req, res) => {
  const { userId, from, to, height, width, breadth, description } = req.body;

  try {
    // Find an available container for the specified route
    const container = await Container.findOne({ from, to });
    if (!container) {
      return res.status(404).json({ message: 'No container available for the specified route.' });
    }

    // Check if the container has enough space for the parcel
    const parcel = { height, width, breadth };
    if (!container.checkAvailableSpace(parcel)) {
      return res.status(400).json({ message: 'Not enough space to accommodate the parcel.' });
    }

    // Update user with new booking
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const booking = {
      from,
      to,
      height,
      width,
      breadth,
      description,
      status: 'Pending',
    };
    user.bookings.push(booking);
    await user.save();

    // Redirect to payment page
    res.status(200).json({ message: 'Space available! Redirecting to payment.', paymentUrl: '/payment' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing booking.', error });
  }
};
