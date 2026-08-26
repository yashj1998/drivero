import { Booking } from '../models/Booking.js';
import { Customer } from '../models/Customer.js';
import { Car } from '../models/Car.js';

// Helper to generate readable reference numbers
function generateBookingNumber() {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `DRV-${randomNum}`;
}

// @desc    Create a new rental booking (Book Now flow)
// @route   POST /api/bookings
// @access  Public
export async function createBooking(req, res) {
  try {
    const {
      carId,
      carSlug,
      name,
      email,
      phone,
      licenseNumber,
      pickupLocation,
      deliveryAddress,
      pickupDate,
      returnDate,
      days,
      promoCode,
      notes,
    } = req.body;

    // Validation
    if (!name || !email || !phone || (!carId && !carSlug) || !pickupLocation || !pickupDate || !returnDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required details: Name, Email, Phone, Vehicle, Location, and Rental Dates.',
      });
    }

    // Find the car in DB (or by slug)
    let car;
    if (carId && carId.match(/^[0-9a-fA-F]{24}$/)) {
      car = await Car.findById(carId);
    }
    if (!car && carSlug) {
      car = await Car.findOne({ slug: carSlug.toLowerCase() });
    }
    if (!car && carId) {
      car = await Car.findOne({ slug: carId.toLowerCase() });
    }

    if (!car) {
      return res.status(404).json({ success: false, message: 'Selected vehicle was not found in the fleet database.' });
    }

    const rentalDays = Math.max(1, Number(days) || 1);
    const subtotal = car.price * rentalDays;
    const insurance = 25 * rentalDays;

    let discount = 0;
    const normalizedPromo = (promoCode || '').trim().toUpperCase();
    if (normalizedPromo === 'DRIVEO20') {
      discount = Math.round((subtotal + insurance) * 0.20);
    }

    const total = Math.max(0, subtotal + insurance - discount);

    // Find or create customer
    const cleanEmail = email.toLowerCase().trim();
    let customer = await Customer.findOne({ email: cleanEmail });

    if (customer) {
      customer.name = name.trim();
      customer.phone = phone.trim();
      if (licenseNumber) customer.licenseNumber = licenseNumber.trim();
      if (deliveryAddress) customer.address = deliveryAddress.trim();
      if (pickupLocation) customer.city = pickupLocation.trim();
      customer.totalBookings += 1;
      customer.totalSpent += total;
      customer.lastBookingDate = new Date();
      await customer.save();
    } else {
      customer = new Customer({
        name: name.trim(),
        email: cleanEmail,
        phone: phone.trim(),
        licenseNumber: licenseNumber ? licenseNumber.trim() : '',
        address: deliveryAddress ? deliveryAddress.trim() : '',
        city: pickupLocation ? pickupLocation.trim() : '',
        totalBookings: 1,
        totalSpent: total,
        lastBookingDate: new Date(),
      });
      await customer.save();
    }

    // Generate unique booking number
    let bookingNumber = generateBookingNumber();
    while (await Booking.findOne({ bookingNumber })) {
      bookingNumber = generateBookingNumber();
    }

    const booking = new Booking({
      bookingNumber,
      customer: customer._id,
      customerSnapshot: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        licenseNumber: customer.licenseNumber,
        address: customer.address || deliveryAddress || '',
        city: customer.city || pickupLocation,
      },
      car: car._id,
      carSnapshot: {
        name: car.name,
        slug: car.slug,
        brand: car.brand,
        tag: car.tag,
        pricePerDay: car.price,
        img: car.img,
      },
      pickupLocation,
      deliveryAddress: deliveryAddress || pickupLocation,
      pickupDate: new Date(pickupDate),
      returnDate: new Date(returnDate),
      days: rentalDays,
      priceBreakdown: {
        subtotal,
        insurance,
        discount,
        promoCode: normalizedPromo,
        total,
      },
      status: 'confirmed',
      statusTimeline: [
        {
          status: 'confirmed',
          timestamp: new Date(),
          note: 'Booking successfully placed by customer and verified.',
        },
      ],
      paymentStatus: 'paid',
      notes: notes || '',
    });

    await booking.save();

    // Increment car total rentals
    car.totalRentals = (car.totalRentals || 0) + 1;
    await car.save();

    res.status(201).json({
      success: true,
      message: 'Rental booking confirmed successfully!',
      data: booking,
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error creating booking' });
  }
}

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private (Admin)
export async function getAllBookings(req, res) {
  try {
    const { status, search, limit = 50, page = 1 } = req.query;

    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { bookingNumber: { $regex: search, $options: 'i' } },
        { 'customerSnapshot.name': { $regex: search, $options: 'i' } },
        { 'customerSnapshot.email': { $regex: search, $options: 'i' } },
        { 'customerSnapshot.phone': { $regex: search, $options: 'i' } },
        { 'carSnapshot.name': { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('customer', 'name email phone licenseNumber address')
      .populate('car', 'name slug brand img price tag isAvailable');

    res.json({
      success: true,
      count: bookings.length,
      total,
      data: bookings,
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ success: false, message: 'Server error fetching bookings' });
  }
}

// @desc    Get single booking by ID or Booking Number
// @route   GET /api/bookings/:id
// @access  Private (Admin) / Public with reference
export async function getBookingById(req, res) {
  try {
    const { id } = req.params;

    let booking;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      booking = await Booking.findById(id).populate('customer').populate('car');
    }

    if (!booking) {
      booking = await Booking.findOne({ bookingNumber: id.toUpperCase() })
        .populate('customer')
        .populate('car');
    }

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Error fetching booking detail:', error);
    res.status(500).json({ success: false, message: 'Server error fetching booking details' });
  }
}

// @desc    Update booking status (e.g. Mark Car Sent / In Transit, Delivered, Completed, Cancelled)
// @route   PATCH /api/bookings/:id/status
// @access  Private (Admin)
export async function updateBookingStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const validStatuses = ['pending', 'confirmed', 'in_transit', 'delivered', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.status = status;
    booking.statusTimeline.push({
      status,
      timestamp: new Date(),
      note: note || `Status updated to ${status.replace('_', ' ')} by concierge admin`,
    });

    await booking.save();

    // If status is in_transit or delivered, car is currently rented
    // If completed or cancelled, car is available again
    if (booking.car) {
      if (status === 'in_transit' || status === 'delivered') {
        await Car.findByIdAndUpdate(booking.car, { isAvailable: false, activeBookingId: booking._id });
      } else if (status === 'completed' || status === 'cancelled') {
        await Car.findByIdAndUpdate(booking.car, { isAvailable: true, activeBookingId: null });
      }
    }

    res.json({
      success: true,
      message: `Booking #${booking.bookingNumber} status updated to ${status.replace('_', ' ').toUpperCase()}`,
      data: booking,
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ success: false, message: 'Server error updating status' });
  }
}

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private (Admin)
export async function deleteBooking(req, res) {
  try {
    const { id } = req.params;

    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({
      success: true,
      message: 'Booking deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ success: false, message: 'Server error deleting booking' });
  }
}
