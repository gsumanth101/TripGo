const jwt = require('jsonwebtoken');
const secret = 'mysecretkey'; // Use an environment variable for the secret key

module.exports = function (req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).redirect('/auth/login');
  }
  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).redirect('/auth/login');
  }
};
