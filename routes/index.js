
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const checkAuth = require('../middleware/auth');
 
// ================== SCHEMAS ==================
 
// --- Customer Schema ---
const customerSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
});
const Customer = mongoose.model('Customer', customerSchema);
 
// --- Admin Schema ---
const adminSchema = new mongoose.Schema({
  username: String,
  password: String
});
const Admin = mongoose.model('Admin', adminSchema);
 
// --- Product Schema ---
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  category: {
    type: String,
    enum: ['Groceries', 'Electronics', 'Beverages', 'Stationaries'],
    required: true
  },
  productId: Number
});
const Product = mongoose.model('Product', productSchema);
 
// ================== CUSTOMER SIGNUP ==================
router.get('/registerCustomer', async (req, res) => {
  const { username, email, password } = req.query;
  if (!username || !email || !password) {
    return res.send({ success: false, message: 'Missing fields' });
  }
 
  const existing = await Customer.findOne({ username });
  if (existing) {
    return res.send({ success: false, message: 'Customer already exists' });
  }
 
  const hashedPw = bcrypt.hashSync(password, 12);
  const newCustomer = new Customer({ username, email, password: hashedPw });
 
  try {
    await newCustomer.save();
    res.send({ success: true, message: 'Customer registered successfully' });
  } catch (err) {
    console.log('Signup error:', err);
    res.send({ success: false, message: 'Database error' });
  }
});
 
// ================== CUSTOMER SIGNUP (POST) ==================
 
router.post('/registerCustomer', async (req, res) => {
  const { username, email, password } = req.body;
 
  if (!username || !email || !password) {
    return res.json({ success: false, message: 'Missing fields' });
  }
 
  const existing = await Customer.findOne({ username });
  if (existing) {
    return res.json({ success: false, message: 'Customer already exists' });
  }
 
  const hashedPw = bcrypt.hashSync(password, 12);
  const newCustomer = new Customer({ username, email, password: hashedPw });
 
  try {
    await newCustomer.save();
    res.json({ success: true, message: 'Customer registered successfully' });
  } catch (err) {
    console.log('Signup error:', err);
    res.json({ success: false, message: 'Database error' });
  }
});
 
 
// ================== CUSTOMER LOGIN ==================
router.get('/loginCustomer', async (req, res) => {
  const { username, password } = req.query;
 
  const customer = await Customer.findOne({ username });
  if (!customer) {
    return res.send({ success: false, message: 'Customer not found' });
  }
 
  const match = await bcrypt.compare(password, customer.password);
  if (!match) {
    return res.send({ success: false, message: 'Incorrect password' });
  }
 
  req.session.isLoggedIn = true;
  req.session.userRole = 'customer';
  req.session.username = username;
 
  res.send({ success: true, message: `Welcome back, ${username}` });
});
 
 
// ================== CUSTOMER LOGIN (Post) ==================
 
router.post('/loginCustomer', async (req, res) => {
  const { username, password } = req.body;
 
  const customer = await Customer.findOne({ username });
  if (!customer) {
    return res.json({ success: false, message: 'Customer not found' });
  }
 
  const match = await bcrypt.compare(password, customer.password);
  if (!match) {
    return res.json({ success: false, message: 'Incorrect password' });
  }
 
  req.session.isLoggedIn = true;
  req.session.userRole = 'customer';
  req.session.username = username;
 
  res.json({ success: true, message: `Welcome back, ${username}` });
});
 
 
// ================== CREATE ADMIN ==================
router.get('/createAdmin', async (req, res) => {
  const { username, password } = req.query;
 
  if (!username || !password) {
    return res.send({ success: false, message: 'Missing username or password' });
  }
 
  const existing = await Admin.findOne({ username });
  if (existing) {
    return res.send({ success: false, message: 'Admin already exists' });
  }
 
  const hashedPw = bcrypt.hashSync(password, 12);
  const newAdmin = new Admin({ username, password: hashedPw });
 
  try {
    await newAdmin.save();
    res.send({ success: true, message: 'Admin created successfully' });
  } catch (err) {
    console.log('Error creating admin:', err);
    res.send({ success: false, message: 'Database error', error: err });
  }
});
 
// ================== CREATE ADMIN (Post) ==================
 
router.post('/createAdmin', async (req, res) => {
  const { username, password } = req.body;
 
  if (!username || !password) {
    return res.json({ success: false, message: 'Missing username or password' });
  }
 
  const existing = await Admin.findOne({ username });
  if (existing) {
    return res.json({ success: false, message: 'Admin already exists' });
  }
 
  const hashedPw = bcrypt.hashSync(password, 12);
  const newAdmin = new Admin({ username, password: hashedPw });
 
  try {
    await newAdmin.save();
    res.json({ success: true, message: 'Admin created successfully' });
  } catch (err) {
    console.log('Error creating admin:', err);
    res.json({ success: false, message: 'Database error', error: err });
  }
});
 
 
// ================== ADMIN LOGIN ==================
router.get('/loginAdmin', async (req, res) => {
  const { username, password } = req.query;
 
  const admin = await Admin.findOne({ username });
  if (!admin) {
    return res.send({ success: false, message: 'Admin not found' });
  }
 
  const match = await bcrypt.compare(password, admin.password);
  if (!match) {
    return res.send({ success: false, message: 'Incorrect password' });
  }
 
  req.session.isLoggedIn = true;
  req.session.userRole = 'admin';
  req.session.username = username;
 
  res.send({ success: true, message: `Admin logged in as ${username}` });
});
 
// ================== ADMIN LOGIN (Post) ==================
 
router.post('/loginAdmin', async (req, res) => {
  const { username, password } = req.body;
 
  const admin = await Admin.findOne({ username });
  if (!admin) {
    return res.json({ success: false, message: 'Admin not found' });
  }
 
  const match = await bcrypt.compare(password, admin.password);
  if (!match) {
    return res.json({ success: false, message: 'Incorrect password' });
  }
 
  req.session.isLoggedIn = true;
  req.session.userRole = 'admin';
  req.session.username = username;
 
  res.json({ success: true, message: `Admin logged in as ${username}` });
});
 
 
 
// ================== LOGOUT (ANY USER) ==================
router.get('/logout', (req, res) => {
  req.session.isLoggedIn = false;
  req.session.userRole = null;
  req.session.username = null;
  res.send({ success: true, message: 'Logged out successfully' });
});
 
// ================== LOGOUT:Post (ANY USER) ==================
 
router.post('/logout', (req, res) => {
  req.session.isLoggedIn = false;
  req.session.userRole = null;
  req.session.username = null;
  res.json({ success: true, message: 'Logged out successfully' });
});
 
 
// ================== SHOW All USERS ==================
router.get('/showAllUsers', async (req, res) => {
  const customers = await Customer.find();
  const admins = await Admin.find();
  res.send({
    customers: customers.map(c => c.username),
    admins: admins.map(a => a.username)
  });
});
 
 
// ================== SHOW All USERS (Post)==================
 
router.post('/showAllUsers', async (req, res) => {
  const customers = await Customer.find();
  const admins = await Admin.find();
 
  res.json({
    customers: customers.map(c => c.username),
    admins: admins.map(a => a.username)
  });
});
 
 
//let nextProductId = 1; // Optional: can also be auto-generated or based on count
 
 
 
 
 
// ================== ADD PRODUCT (Admin Only) ==================
router.get('/addProduct', checkAuth, async (req, res) => {
  // Ensure the user is an admin
  if (req.session.userRole !== 'admin') {
    console.log('[❌] Unauthorized attempt to add product - not an admin');
    return res.send({ success: false, message: 'Only admins can add products' });
  }
 
  const { name, price, description, category } = req.query;
 
  // Validate inputs
  if (!name || !price || !category) {
    console.log('[❌] Missing required fields for adding product');
    return res.send({ success: false, message: 'Missing required fields (name, price, category)' });
  }
 
  // Check category validity
  const validCategories = ['Groceries', 'Electronics', 'Beverages', 'Stationaries'];
  if (!validCategories.includes(category)) {
    console.log(`[❌] Invalid category: ${category}`);
    return res.send({ success: false, message: 'Invalid category name' });
  }
 
  // Check category limit
  const count = await Product.countDocuments({ category });
  if (count >= 5) {
    console.log(`[⚠️] Product limit reached for category "${category}" (5 max)`);
    return res.send({ success: false, message: `Category ${category} already has 5 products` });
  }
 
  const latest = await Product.findOne().sort({ productId: -1 });
    const nextProductId = latest ? latest.productId + 1 : 1;
 
  // Create and save product
  const newProduct = new Product({
    name,
    price: parseFloat(price),
    description: description || '',
    category,
    productId: nextProductId
  });
 
  try {
    await newProduct.save();
    console.log(`[✅] Product added: "${name}" in category "${category}"`);
    res.send({ success: true, message: 'Product added successfully' });
  } catch (err) {
    console.log('[❌] Error saving product:', err);
    res.send({ success: false, message: 'Database error', error: err });
  }
});
 
 
// ================== ADD PRODUCT: POST (Admin Only) ==================
 
router.post('/addProduct', checkAuth, async (req, res) => {
    if (req.session.userRole !== 'admin') {
      return res.json({ success: false, message: 'Only admins can add products' });
    }
 
    const { name, price, description, category } = req.body;
 
    const validCategories = ['Groceries', 'Electronics', 'Beverages', 'Stationaries'];
    if (!name || !price || !category) {
      return res.json({ success: false, message: 'Missing required fields' });
    }
    if (!validCategories.includes(category)) {
      return res.json({ success: false, message: 'Invalid category' });
    }
 
    const count = await Product.countDocuments({ category });
    if (count >= 5) {
      return res.json({ success: false, message: `Category ${category} already has 5 products` });
    }
 
    const latest = await Product.findOne().sort({ productId: -1 });
    const nextProductId = latest ? latest.productId + 1 : 1;
 
    const product = new Product({
      name,
      price: parseFloat(price),
      description: description || '',
      category,
      productId: nextProductId
    });
 
    try {
      await product.save();
      console.log(`[✅] Product added (POST): "${name}" in category "${category}"`);
      res.json({ success: true, message: 'Product added successfully', product });
    } catch (err) {
      console.log('Error adding product:', err);
      res.json({ success: false, message: 'Database error', error: err });
    }
  });
 
 // ================== To Fetch the Categories ==================
router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json({ success: true, categories });
  } catch (err) {
    res.json({ success: false, message: 'Database error', error: err });
  }
});
// ================== GET ALL PRODUCTS ==================
router.get('/getAllProducts', async (req, res) => {
    try {
      const products = await Product.find();
 
      console.log(`Fetched ${products.length} products`);
      res.send({ success: true, products });
    } catch (err) {
      console.log('[❌] Error fetching all products:', err);
      res.send({ success: false, message: 'Database error', error: err });
    }
  });
 
  // ================== GET ALL PRODUCTS (POST) ==================
 
router.post('/getAllProducts', async (req, res) => {
    try {
        const products = await Product.find();
        res.json({ success: true, products });
    } catch (err) {
        console.log('Error fetching all products:', err);
        res.json({ success: false, message: 'Database error', error: err });
    }
 });
 
 
// ================== GET PRODUCTS BY CATEGORY ==================
router.get('/getProductsByCategory', async (req, res) => {
    const { category } = req.query;
 
    const validCategories = ['Groceries', 'Electronics', 'Beverages', 'Stationaries'];
    if (!category || !validCategories.includes(category)) {
      console.log(`[❌] Invalid or missing category: ${category}`);
      return res.send({ success: false, message: 'Invalid or missing category name' });
    }
 
    try {
      const products = await Product.find({ category });
      res.send({ success: true, products });
    } catch (err) {
      console.log('Error fetching products by category:', err);
      res.send({ success: false, message: 'Database error', error: err });
    }
  });
 
  // ================== GET PRODUCTS BY CATEGORY (POST) ==================
  router.post('/getProductsByCategory', async (req, res) => {
    const { category } = req.body;
 
    const validCategories = ['Groceries', 'Electronics', 'Beverages', 'Stationaries'];
    if (!category || !validCategories.includes(category)) {
      return res.json({ success: false, message: 'Invalid or missing category' });
    }
 
    try {
      const products = await Product.find({ category });
      res.json({ success: true, products });
    } catch (err) {
      console.log('Error fetching products by category:', err);
      res.json({ success: false, message: 'Database error', error: err });
    }
  });
 
 // ================== GET SPECIFIC PRODUCT BY PRODUCT_ID ==================
router.get('/getSpecificProduct', async (req, res) => {
  const { product_id } = req.query;
 
  if (!product_id) {
    return res.send({ success: false, message: 'Product ID is required' });
  }
 
  try {
    const product = await Product.findById(product_id);
   
    if (!product) {
      return res.send({ success: false, message: 'Product not found' });
    }
 
    res.send({ success: true, product });
  } catch (err) {
    console.log('Error fetching specific product by product_id:', err);
    res.send({ success: false, message: 'Database error', error: err });
  }
});
 
// ================== GET SPECIFIC PRODUCT BY PRODUCT_ID (POST) ==================
router.post('/getSpecificProduct', async (req, res) => {
  const { product_id } = req.body;
 
  if (!product_id) {
    return res.json({ success: false, message: 'Product ID is required' });
  }
 
  try {
    const product = await Product.findById(product_id);
 
    if (!product) {
      return res.json({ success: false, message: 'Product not found' });
    }
 
    res.json({ success: true, product });
  } catch (err) {
    console.log('Error fetching specific product by product_id:', err);
    res.json({ success: false, message: 'Database error', error: err });
  }
});
 
  // ================== DELETE PRODUCT (Admin Only) ==================
router.get('/deleteProduct', checkAuth, async (req, res) => {
    if (req.session.userRole !== 'admin') {
      console.log('[❌] Unauthorized delete attempt');
      return res.send({ success: false, message: 'Only admins can delete products' });
    }
 
    const { productId } = req.query;
    if (!productId) {
      return res.send({ success: false, message: 'Missing productId' });
    }
 
    try {
      const deleted = await Product.findOneAndDelete({ productId: parseInt(productId) });
      if (!deleted) {
        console.log(`[⚠️] No product found with ID ${productId}`);
        return res.send({ success: false, message: 'Product not found' });
      }
 
      console.log(` Deleted product: ${deleted.name} (ID: ${deleted.productId})`);
      res.send({ success: true, message: 'Product deleted successfully' });
    } catch (err) {
      console.log('[❌] Error deleting product:', err);
      res.send({ success: false, message: 'Database error', error: err });
    }
  });
 
  // ================== DELETE PRODUCT: POST (Admin Only) ==================
router.post('/deleteProduct', checkAuth, async (req, res) => {
    if (req.session.userRole !== 'admin') {
      return res.json({ success: false, message: 'Only admins can delete products' });
    }
 
    const { productId } = req.body;
 
    if (!productId) {
      return res.json({ success: false, message: 'Missing productId' });
    }
 
    try {
      const deletedProduct = await Product.findOneAndDelete({ productId: parseInt(productId) });
 
      if (!deletedProduct) {
        return res.json({ success: false, message: 'Product not found' });
      }
 
      res.json({ success: true, message: 'Product deleted successfully', deletedProduct });
    } catch (err) {
      console.log('Error deleting product:', err);
      res.json({ success: false, message: 'Database error', error: err });
    }
  });
   
 
  // ================== UPDATE PRODUCT (Admin Only) ==================
router.get('/updateProduct', checkAuth, async (req, res) => {
    if (req.session.userRole !== 'admin') {
      console.log('[❌] Unauthorized update attempt');
      return res.send({ success: false, message: 'Only admins can update products' });
    }
 
    const { productId, name, price, description, category } = req.query;
 
    if (!productId) {
      return res.send({ success: false, message: 'Missing productId' });
    }
 
    try {
      const product = await Product.findOne({ productId: parseInt(productId) });
      if (!product) {
        console.log(`[⚠️] No product found with ID ${productId}`);
        return res.send({ success: false, message: 'Product not found' });
      }
 
      // Optional updates
      if (name) product.name = name;
      if (price) product.price = parseFloat(price);
      if (description) product.description = description;
      if (category) {
        const validCategories = ['Groceries', 'Electronics', 'Beverages', 'Stationaries'];
        if (!validCategories.includes(category)) {
          return res.send({ success: false, message: 'Invalid category' });
        }
 
        // Check limit for the new category (excluding current product)
        const count = await Product.countDocuments({ category });
        if (count >= 10 && product.category !== category) {
          return res.send({ success: false, message: `Category ${category} already has 10 products` });
        }
 
        product.category = category;
      }
 
      await product.save();
      console.log(` Updated product ID ${productId}`);
      res.send({ success: true, message: 'Product updated successfully' });
    } catch (err) {
      console.log('[❌] Error updating product:', err);
      res.send({ success: false, message: 'Database error', error: err });
    }
  });
 
// ================== UPDATE PRODUCT (Admin Only) ==================
 
router.post('/updateProduct', checkAuth, async (req, res) => {
    if (req.session.userRole !== 'admin') {
      return res.json({ success: false, message: 'Only admins can update products' });
    }
 
    const { productId, name, price, description, category } = req.body;
 
    if (!productId) {
      return res.json({ success: false, message: 'Missing productId' });
    }
 
    try {
      const product = await Product.findOne({ productId: parseInt(productId) });
      if (!product) {
        return res.json({ success: false, message: 'Product not found' });
      }
 
      if (name) product.name = name;
      if (price) product.price = parseFloat(price);
      if (description) product.description = description;
 
      if (category) {
        const validCategories = ['Groceries', 'Electronics', 'Beverages', 'Stationaries'];
        if (!validCategories.includes(category)) {
          return res.json({ success: false, message: 'Invalid category' });
        }
 
        const count = await Product.countDocuments({ category });
        if (count >= 10 && product.category !== category) {
          return res.json({ success: false, message: `Category ${category} already has 10 products` });
        }
 
        product.category = category;
      }
 
      await product.save();
      res.json({ success: true, message: 'Product updated successfully', product });
    } catch (err) {
      console.log('Error updating product:', err);
      res.json({ success: false, message: 'Database error', error: err });
    }
  });
 
 
module.exports.routes = router;
 