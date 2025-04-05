const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const Order = require('../models/Order');
const auth = require('../middleware/auth');

// Submit feedback
router.post('/', async (req, res) => {
  try {
    const { orderId, restaurantId, restaurantName, name, rating, foodQuality, deliveryExperience, comments } = req.body;

    const feedback = new Feedback({
      orderId,
      restaurantId,
      restaurantName,
      name,
      rating,
      foodQuality,
      deliveryExperience,
      comments
    });

    await feedback.save();
    res.status(201).json(feedback);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Get feedback for an order
router.get('/:orderId', auth, async (req, res) => {
  try {
    const feedback = await Feedback.findOne({ 
      orderId: req.params.orderId,
      userId: req.user._id
    });

    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
    try {
      const feedback = await Feedback.find().sort({ createdAt: -1 });
      res.json(feedback);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

// In your feedback routes file
router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
      const feedbacks = await Feedback.find({ restaurantId: req.params.restaurantId })
          .sort({ createdAt: -1 });
      res.json(feedbacks);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

module.exports = router;