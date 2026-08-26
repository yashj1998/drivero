import { Car } from '../models/Car.js';

// @desc    Get all cars with filtering & sorting
// @route   GET /api/cars
// @access  Public
export async function getCars(req, res) {
  try {
    const { tag, sort, search, availableOnly } = req.query;

    const query = {};

    if (tag && tag !== 'All') {
      query.tag = tag;
    }

    if (availableOnly === 'true') {
      query.isAvailable = true;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { tag: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price-low') {
      sortOption = { price: 1 };
    } else if (sort === 'price-high') {
      sortOption = { price: -1 };
    } else if (sort === 'rating') {
      sortOption = { rating: -1 };
    }

    const cars = await Car.find(query).sort(sortOption);

    res.json({
      success: true,
      count: cars.length,
      data: cars,
    });
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({ success: false, message: 'Server error fetching cars' });
  }
}

// @desc    Get car by slug or ID
// @route   GET /api/cars/:identifier
// @access  Public
export async function getCar(req, res) {
  try {
    const { identifier } = req.params;

    let car;
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      car = await Car.findById(identifier);
    }

    if (!car) {
      car = await Car.findOne({ slug: identifier.toLowerCase() });
    }

    if (!car) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    res.json({
      success: true,
      data: car,
    });
  } catch (error) {
    console.error('Error fetching car details:', error);
    res.status(500).json({ success: false, message: 'Server error fetching vehicle' });
  }
}

// @desc    Create a new car
// @route   POST /api/cars
// @access  Private (Admin)
export async function createCar(req, res) {
  try {
    const { name, brand, tag, price, img, gallery, specs, description, features, seats, rating } = req.body;

    if (!name || !brand || !tag || !price || !img || !description) {
      return res.status(400).json({ success: false, message: 'Please provide all required vehicle details.' });
    }

    // Generate unique slug
    let baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    let slug = baseSlug;
    let count = 1;
    while (await Car.findOne({ slug })) {
      slug = `${baseSlug}-${count++}`;
    }

    const car = new Car({
      slug,
      name,
      brand,
      tag,
      price: Number(price),
      img,
      gallery: Array.isArray(gallery) && gallery.length > 0 ? gallery : [img],
      rating: rating ? Number(rating) : 5.0,
      seats: seats ? Number(seats) : 2,
      specs: specs || [
        { icon: 'Gauge', label: '0–60 mph', value: '3.5s' },
        { icon: 'Cog', label: 'Transmission', value: 'Automatic' },
        { icon: 'Fuel', label: 'Fuel', value: 'Premium' },
        { icon: 'Users', label: 'Seats', value: `${seats || 2}` },
      ],
      description,
      features: features || ['Premium Sound', 'Leather Interior', 'GPS Navigation'],
      isAvailable: true,
    });

    await car.save();

    res.status(201).json({
      success: true,
      message: 'Vehicle added to fleet successfully.',
      data: car,
    });
  } catch (error) {
    console.error('Error creating car:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error creating vehicle' });
  }
}

// @desc    Update car details
// @route   PUT /api/cars/:id
// @access  Private (Admin)
export async function updateCar(req, res) {
  try {
    const { id } = req.params;

    const car = await Car.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!car) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    res.json({
      success: true,
      message: 'Vehicle updated successfully.',
      data: car,
    });
  } catch (error) {
    console.error('Error updating car:', error);
    res.status(500).json({ success: false, message: 'Server error updating vehicle' });
  }
}

// @desc    Delete a car
// @route   DELETE /api/cars/:id
// @access  Private (Admin)
export async function deleteCar(req, res) {
  try {
    const { id } = req.params;

    const car = await Car.findByIdAndDelete(id);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    res.json({
      success: true,
      message: 'Vehicle deleted from fleet successfully.',
    });
  } catch (error) {
    console.error('Error deleting car:', error);
    res.status(500).json({ success: false, message: 'Server error deleting vehicle' });
  }
}
