const jwt = require("jsonwebtoken");
const User = require("../models/User");

// PROTECT: Only logged-in users
exports.protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      const err = new Error("Not authorized, no token");
      err.statusCode = 401;
      return next(err);
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (without password)
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      const err = new Error("User not found for this token");
      err.statusCode = 401;
      return next(err);
    }

    req.user = {
      id: user._id,
      role: user.role,
      name: user.name,
      email: user.email,
    };

    next();
  } catch (error) {
    error.statusCode = 401;
    next(error);
  }
};

// ADMIN ONLY
exports.adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    const err = new Error("Admin access only");
    err.statusCode = 403;
    return next(err);
  }
  next();
};
