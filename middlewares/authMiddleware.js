const jwt = require('jsonwebtoken');

exports.auth = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { expiresIn: '1h' });
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Invalid token' });
  }
};
