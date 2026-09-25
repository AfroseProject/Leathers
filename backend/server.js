require('dotenv').config();
const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// 1. RAZORPAY CONFIGURATION
// ==========================================
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.post('/create-order', async (req, res) => {
  try {
    // We receive the customer details and cart items from React
    const { amount, customer, items } = req.body;
    
    // 1. Create the Razorpay Order
    const options = {
      amount: amount * 100, // paise
      currency: 'INR',
      receipt: `receipt_order_${Math.floor(Math.random() * 1000)}`,
    };
    const order = await razorpay.orders.create(options);

    // 2. Save the customer data and order details to MongoDB!
    const newOrder = new Order({
      customer: customer,
      items: items,
      totalAmount: amount,
      razorpayOrderId: order.id,
      status: 'Created - Pending Payment'
    });
    await newOrder.save();

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add this near the top if you haven't already:
const crypto = require('crypto');

// The Verification Endpoint
app.post('/verify-payment', async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature 
    } = req.body;

    // 1. Verify the signature to ensure it's a genuine Razorpay request
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET) // Make sure you have your secret in .env!
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // 2. Signature is valid! Update the order in MongoDB to 'Paid'
      // Assuming your Mongoose model is called 'Order' and it saves the razorpayOrderId
      await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id }, // Find by Razorpay's Order ID
        { 
          status: 'Paid',
          paymentId: razorpay_payment_id 
        }
      );

      return res.status(200).json({ success: true, message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid signature sent!" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error during verification" });
  }
});

// ==========================================
// 2. MONGODB & EMAIL (CONTACT FORM) CONFIG
// ==========================================

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => console.error("MongoDB connection error:", err));

// Define the MongoDB Schema & Model for the Contact Form
const inquirySchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  submittedAt: { type: Date, default: Date.now }
});
const Inquiry = mongoose.model('Inquiry', inquirySchema);

// Configure Email Transporter (Nodemailer)
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can change this if you are using Outlook/Yahoo
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS 
  }
});

// Endpoint to handle the Contact Form submission
app.post('/api/contact', async (req, res) => {
  console.log("--> Received a POST request to /api/contact");
  console.log("Request body received:", req.body);

  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email) {
      console.warn("Missing required fields (name or email)!");
      return res.status(400).json({ success: false, message: "Name and Email are required." });
    }

    // 1. Create and save the Inquiry document
    const newInquiry = new Inquiry({
      name,
      email,
      subject: subject || 'General Inquiry',
      message: message || ''
    });

    const savedDoc = await newInquiry.save();
    console.log("✅ Successfully saved to MongoDB! Doc ID:", savedDoc._id);

    // 2. Email sending (optional / isolated)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER,
          replyTo: email,
          subject: `New Inquiry: ${subject}`,
          html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong> ${message}</p>`,
        });
        console.log("📧 Email sent successfully!");
      } catch (mailErr) {
        console.warn("⚠️ Email failed to send (check credentials), but DB write was successful:", mailErr.message);
      }
    } else {
      console.log("ℹ️ Skipping email send (EMAIL_USER or EMAIL_PASS not set in .env)");
    }

    return res.status(200).json({ success: true, message: "Inquiry received and saved!" });
  } catch (error) {
    console.error("❌ Mongoose error saving inquiry:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

const jwt = require('jsonwebtoken');

// 1. Define the User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  otp: String,
  otpExpires: Date,
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

// JWT Secret (Put this in your .env later for production)
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_123';

// ==========================================
// OTP LOGIN SYSTEM
// ==========================================

// Route A: Generate and Send OTP
app.post('/api/auth/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiration time (e.g., 10 minutes from now)
    const otpExpires = new Date(Date.now() + 10 * 60000); 

    // Find user or create a new one if they don't exist
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email });
    }
    
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send the OTP via Nodemailer
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Your Login OTP for Premium Leather`,
      html: `
        <div style="font-family: sans-serif; text-align: center; padding: 20px;">
          <h2>Your One-Time Password</h2>
          <p>Use the code below to securely log into your account.</p>
          <h1 style="color: #d97706; letter-spacing: 5px;">${otp}</h1>
          <p>This code will expire in 10 minutes.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}`);
    
    res.status(200).json({ success: true, message: "OTP sent to your email!" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
});

// Route B: Verify OTP and Issue Login Token
app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "User not found" });

    // Check if OTP matches and is not expired
    if (user.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
    if (user.otpExpires < new Date()) {
      return res.status(400).json({ success: false, message: "OTP has expired" });
    }

    // Clear the OTP so it can't be reused
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Generate Secure JWT Token
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ success: true, token, message: "Login successful!" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Route C: Middleware to protect Dashboard Routes
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach user info to the request
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

// Route D: Fetch customer's orders for the Dashboard
app.get('/api/my-orders', requireAuth, async (req, res) => {
  try {
    // Find all orders where customer email matches the logged-in user
    // Note: Ensure your Order schema saves customer.email!
    const orders = await Order.find({ "customer.email": req.user.email }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
});

// ==========================================
// ORDER SCHEMA (To store checkout details)
// ==========================================
const orderSchema = new mongoose.Schema({
  customer: {
    name: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    pincode: String
  },
  items: Array,           // Stores the cart items they bought
  totalAmount: Number,    // Stores the total price
  razorpayOrderId: String,// Links this to the Razorpay payment
  status: { type: String, default: 'Payment Pending' },
  createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', orderSchema);

// ==========================================
// 3. START SERVER
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

module.exports = app;