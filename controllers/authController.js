const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.register = async (req, res) => {
  const { name, email, password, phone, address, agreeToTerms, avatar } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, phone, address, avatar, agreeToTerms, password: hashedPassword, email_verified: false });
  try {
    const userRes = await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch(e){
    console.log(e.message);
    if(e.message.includes("duplicate key error"))
      res.status(409).json({ message: "Email already exists."})
    else
      res.status(500).json({ message: "Failed to register user."})
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
  const response = {
    id: user._id,
    name: user.name,
    email: user.email,
    email_verified: user.email_verified,
    phone: user.phone,
    address: user.address,
    avatar: user.avatar,
    accessToken: token
  }
  console.log(response)
  res.status(200).json(response);
};
