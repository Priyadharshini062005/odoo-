// models/Cart.js
const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema({
  productId: {
    type: Number,
    ref: "Product",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity must be at least 1"],
  },
  total: {
    type: Number,
    required: true,
    default: function () {
      return this.price * this.quantity;
    },
  },
  carbonFootprintScore: {
    type: Number,
    required: false
  },
  thumbnail: {
    type: String,
    required: false
  },
});

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      ref: "User",
      required: true,
    },
    items: [CartItemSchema],
    totalQuantity: {
      type: Number,
      required: true,
      default: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Pre-save middleware to calculate totalQuantity and totalPrice
CartSchema.pre("save", function (next) {
  this.totalQuantity = this.items.reduce((sum, item) => sum + item.quantity, 0);
  this.totalPrice = this.items.reduce((sum, item) => sum + item.total, 0);
  next();
});

const Cart = mongoose.model("Cart", CartSchema);

module.exports = Cart;
