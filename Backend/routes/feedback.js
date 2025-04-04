const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const Order = require('../models/Order');
const auth = require('../middleware/auth');

// Submit feedback
router.post('/', async (req, res) => {
    try {
      const { orderId, name, rating, foodQuality, deliveryExperience, comments } = req.body;
  
      // Basic validation
      if (!orderId || !name || !rating || !foodQuality || !deliveryExperience) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      const feedback = new Feedback({
        orderId,
        name, // Using name instead of username/userId
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
  
module.exports = router;