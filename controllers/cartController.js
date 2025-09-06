const CartModel = require('../models/cartModel');

// Fetch the user's cart
exports.getCart = async (req, res) => {
  const { userId } = req.params; // Assuming userId is sent as a query parameter
  try {
    // const cart = await CartModel.findOne({ userId }).populate({path: 'items.productId', foreignField: 'id', select: 'id title price thumbnail',});
    const cart = await CartModel.findOne({ userId });
    if (!cart) {
      return res.status(200).json({ items: [], totalQuantity: 0, totalPrice: 0 });
    }
    res.status(200).json(cart);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Failed to fetch the cart." });
  }
};

// Add an item to the cart
exports.addItemToCart = async (req, res) => {
  const { userId, productId, title, price, quantity, carbonFootprintScore, thumbnail } = req.body;

  try {
    let cart = await CartModel.findOne({ userId });

    if (!cart) {
      cart = new CartModel({ userId, items: [] });
    }

    const existingItem = cart?.items.find((item) => item.productId === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.total = existingItem.price * existingItem.quantity;
    } else {
      cart?.items.push({
        productId,
        title,
        price,
        quantity,
        carbonFootprintScore,
        total: price * quantity,
        thumbnail
      });
    }

    await cart.save();

    res.status(201).json({ message: "Item added to cart successfully.", cart });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Failed to add item to the cart." });
  }
};

// Update the quantity of an item in the cart
exports.updateCartItem = async (req, res) => {
  const { userId } = req.params;
  const { productId, quantity } = req.body;

  try {
    const cart = await CartModel.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    const item = cart?.items.find((item) => item.productId === productId);

    if (!item) {
      return res.status(404).json({ message: "Item not found in cart." });
    }

    item.quantity = quantity;
    item.total = item.price * quantity;

    if (item.quantity <= 0) {
      cart.items = cart?.items.filter((item) => item.productId.toString() !== productId);
    }

    await cart.save();
    res.status(200).json({ message: "Cart item updated successfully.", cart });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Failed to update cart item." });
  }
};

// Remove an item from the cart
exports.removeCartItem = async (req, res) => {
  const { userId } = req.params;
  const { productId } = req.body;

  try {
    const cart = await CartModel.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    cart.items = cart?.items.filter((item) => item.productId !== productId);

    await cart.save();
    res.status(200).json({ message: "Item removed from cart successfully.", cart });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Failed to remove item from the cart." });
  }
};

// Clear the entire cart
exports.clearCart = async (req, res) => {
  const { userId } = req.body;

  try {
    const cart = await CartModel.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart find cart for this user." });
    }

    cart.items = [];
    cart.totalQuantity = 0;
    cart.totalPrice = 0;

    await cart.save();
    res.status(200).json({ message: "Cart cleared successfully.", cart });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Failed to clear the cart." });
  }
};
