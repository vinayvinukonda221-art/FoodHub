import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a food name'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please add a food description'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      enum: ['Biryani', 'Pizza', 'Burgers', 'Indian Meals', 'Desserts', 'Beverages']
    },
    price: {
      type: Number,
      required: [true, 'Please enter a price'],
      min: [0, 'Price must be positive']
    },
    image: {
      type: String,
      required: [true, 'Please provide an image URL']
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 1,
      max: 5
    },
    ratingCount: {
      type: Number,
      default: 120
    },
    available: {
      type: Boolean,
      default: true
    },
    isVeg: {
      type: Boolean,
      default: true
    },
    preparationTime: {
      type: String,
      default: '25-35 mins'
    },
    featured: {
      type: Boolean,
      default: false
    },
    isBestSeller: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Search text index on name & description
foodSchema.index({ name: 'text', description: 'text' });

const Food = mongoose.model('Food', foodSchema);
export default Food;

