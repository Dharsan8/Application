const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const FoodItem = require("../models/Fooditem");

// Create a new order
router.post("/create", async (req, res) => {
  try {
    const { 
      customer, 
      restaurant, 
      items, 
      paymentMethod, 
      deliveryAddress,
      specialInstructions 
    } = req.body;

    // Validate restaurant ID exists (but don't validate as ObjectId)
    if (!restaurant || !restaurant.id) {
      return res.status(400).json({ error: "Restaurant ID is required!" });
    }

    // Calculate subtotal
    let subtotal = 0;
    const populatedItems = await Promise.all(items.map(async item => {
      const foodItem = await FoodItem.findById(item.foodId);
      if (!foodItem) {
        throw new Error(`Food item ${item.foodId} not found`);
      }
      
      const price = foodItem.discount > 0 ? foodItem.discountPrice : foodItem.price;
      subtotal += price * item.quantity;
      
      return {
        foodId: foodItem._id,
        name: foodItem.name,
        quantity: item.quantity,
        price: foodItem.price,
        discountPrice: foodItem.discount > 0 ? foodItem.discountPrice : undefined,
        image: foodItem.image
      };
    }));

    const order = new Order({
      customer,
      restaurant: {
        id: restaurant.id,  // Now accepts string ID
        name: restaurant.name
      },
      items: populatedItems,
      subtotal,
      paymentMethod,
      status: 'Pending',
      deliveryAddress,
      specialInstructions
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// Get orders by restaurant ID (now works with string IDs)
router.get("/restaurant/:restaurantId", async (req, res) => {
  try {
    const orders = await Order.find({ "restaurant.id": req.params.restaurantId })
      .sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Update order status
router.put("/:orderId/status", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true }
    );
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to update order status" });
  }
});

// Get orders by customer username
router.get("/customer/:username", async (req, res) => {
  try {
    const orders = await Order.find({ "customer.username": req.params.username })
      .sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

module.exports = router;