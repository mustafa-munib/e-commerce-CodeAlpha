const Product = require('../models/Product');

// Create product
exports.createProduct = async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const product = new Product({
      name,
      price,
      description,
      image: `/images/${req.file.filename}`
    });
    await product.save();
    res.redirect('/');
  } catch (error) {
    res.status(500).send('Server error');
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).send('Server error');
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description } = req.body;

    const updatedProduct = {
      name,
      price,
      description,
    };

    if (req.file) {
      updatedProduct.image = `/images/${req.file.filename}`;
    }

    await Product.findByIdAndUpdate(id, updatedProduct);
    res.redirect('/');
  } catch (error) {
    res.status(500).send('Server error');
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect('/');
  } catch (error) {
    res.status(500).send('Server error');
  }
};
