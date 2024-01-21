const jwt = require("jsonwebtoken");
module.exports =(req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
  
    if (!token) {
      return res.status(401).json({ message: 'Access denied. Token is missing.' });
    }
  
    jwt.verify(token, "my-jwt-token-secret", (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Token is invalid.' });
      }

      req.user = decoded;
      next();
    });
};