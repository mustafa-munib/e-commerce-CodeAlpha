const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { createProduct, getProducts, updateProduct, deleteProduct } = require('../controllers/productController');
const multer = require('multer');
const path = require('path');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Serve the create product page
router.get('/create', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/create.html'));
});

// Route to create a product (POST)
router.post('/add', upload.single('image'), createProduct);

// Serve the edit product page
router.get('/edit/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send('Product not found');
    }
    res.sendFile(path.join(__dirname, '../views/edit.html'));
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Route to update a product (POST)
router.post('/edit/:id', upload.single('image'), updateProduct);

// Route to get all products (GET)
router.get('/list', getProducts);

// Route to delete a product (POST)
router.post('/delete/:id', deleteProduct);

// Route to get a product by ID (to populate the edit form)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
// Route to get all products or search by name/description
router.get('/list', async (req, res) => {
  const searchQuery = req.query.q;
  try {
    let products;
    if (searchQuery) {
      // Perform search using MongoDB's regex for partial matching
      products = await Product.find({
        $or: [
          { name: { $regex: searchQuery, $options: 'i' } },
          { description: { $regex: searchQuery, $options: 'i' } }
        ]
      });
    } else {
      products = await Product.find(); // Return all products if no search query
    }
    res.json(products);
  } catch (error) {
    res.status(500).send('Server error');
  }
});


// Serve the product details page
router.get('/details', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/product.html'));
});

// Get product details by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error); // Log the error
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;
