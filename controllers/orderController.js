const Order = require('../models/orderModel');

exports.createOrder = async (req, res) => {
  const { products, totalPrice } = req.body;
  const order = new Order({ user: req.user.userId, products, totalPrice });
  await order.save();
  res.status(201).json({ message: 'Order placed', order });
};

exports.getUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.userId });
  res.json(orders);
};
