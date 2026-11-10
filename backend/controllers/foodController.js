import Food from '../models/Food.js';

// @desc    Fetch all foods with optional filters & search
// @route   GET /api/foods
// @access  Public
export const getFoods = async (req, res) => {
  try {
    const { category, search, sort, featured, bestSeller } = req.query;
    let query = {};

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Search by name or description
    if (search && search.trim() !== '') {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    // Featured filter
    if (featured === 'true') {
      query.featured = true;
    }

    // Best seller filter
    if (bestSeller === 'true') {
      query.isBestSeller = true;
    }

    let foodQuery = Food.find(query);

    // Sorting
    if (sort === 'price-low') {
      foodQuery = foodQuery.sort({ price: 1 });
    } else if (sort === 'price-high') {
      foodQuery = foodQuery.sort({ price: -1 });
    } else if (sort === 'rating') {
      foodQuery = foodQuery.sort({ rating: -1 });
    } else {
      foodQuery = foodQuery.sort({ createdAt: -1 });
    }

    const foods = await foodQuery;
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single food by ID
// @route   GET /api/foods/:id
// @access  Public
export const getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (food) {
      res.json(food);
    } else {
      res.status(404).json({ message: 'Food item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a food item
// @route   POST /api/foods
// @access  Private/Admin
export const createFood = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      image,
      rating,
      available,
      isVeg,
      preparationTime,
      featured,
      isBestSeller
    } = req.body;

    if (!name || !description || !category || price === undefined || !image) {
      return res.status(400).json({
        message: 'Please provide name, description, category, price, and image'
      });
    }

    const food = new Food({
      name,
      description,
      category,
      price: Number(price),
      image,
      rating: rating ? Number(rating) : 4.5,
      available: available !== undefined ? available : true,
      isVeg: isVeg !== undefined ? isVeg : true,
      preparationTime: preparationTime || '25-35 mins',
      featured: Boolean(featured),
      isBestSeller: Boolean(isBestSeller)
    });

    const createdFood = await food.save();
    res.status(201).json(createdFood);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a food item
// @route   PUT /api/foods/:id
// @access  Private/Admin
export const updateFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    const {
      name,
      description,
      category,
      price,
      image,
      rating,
      available,
      isVeg,
      preparationTime,
      featured,
      isBestSeller
    } = req.body;

    if (name !== undefined) food.name = name;
    if (description !== undefined) food.description = description;
    if (category !== undefined) food.category = category;
    if (price !== undefined) food.price = Number(price);
    if (image !== undefined) food.image = image;
    if (rating !== undefined) food.rating = Number(rating);
    if (available !== undefined) food.available = available;
    if (isVeg !== undefined) food.isVeg = isVeg;
    if (preparationTime !== undefined) food.preparationTime = preparationTime;
    if (featured !== undefined) food.featured = featured;
    if (isBestSeller !== undefined) food.isBestSeller = isBestSeller;

    const updatedFood = await food.save();
    res.json(updatedFood);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a food item
// @route   DELETE /api/foods/:id
// @access  Private/Admin
export const deleteFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    await food.deleteOne();
    res.json({ message: 'Food item removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

