import { Customer } from '../models/Customer.js';
import { Booking } from '../models/Booking.js';

// @desc    Get all customers with aggregate metrics
// @route   GET /api/customers
// @access  Private (Admin)
export async function getCustomers(req, res) {
  try {
    const { search, limit = 50, page = 1 } = req.query;

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { licenseNumber: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Customer.countDocuments(query);
    const customers = await Customer.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      count: customers.length,
      total,
      data: customers,
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ success: false, message: 'Server error fetching customers' });
  }
}

// @desc    Get single customer profile with rental history
// @route   GET /api/customers/:id
// @access  Private (Admin)
export async function getCustomerById(req, res) {
  try {
    const { id } = req.params;

    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    const bookings = await Booking.find({ customer: customer._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        customer,
        bookings,
      },
    });
  } catch (error) {
    console.error('Error fetching customer details:', error);
    res.status(500).json({ success: false, message: 'Server error fetching customer details' });
  }
}

// @desc    Update customer details / notes
// @route   PUT /api/customers/:id
// @access  Private (Admin)
export async function updateCustomer(req, res) {
  try {
    const { id } = req.params;

    const customer = await Customer.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    res.json({
      success: true,
      message: 'Customer profile updated successfully',
      data: customer,
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ success: false, message: 'Server error updating customer' });
  }
}
