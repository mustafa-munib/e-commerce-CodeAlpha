const mongoose = require('mongoose');

// Define the Product schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true, // Removes any leading/trailing spaces
  },
  price: {
    type: Number,
    required: true,
    min: 0, // Ensures that the price cannot be negative
  },
  description: {
    type: String,
    trim: true, // Removes any leading/trailing spaces
  },
  image: {
    type: String, // Stores the image path after upload
    required: true, // Make image upload mandatory
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically sets the date when the product is created
  }
});

// Create the Product model from the schema
const Product = mongoose.model('Product', productSchema);

// Export the model to use it in other parts of the app
module.exports = Product;
