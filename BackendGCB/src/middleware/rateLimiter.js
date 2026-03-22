import rateLimit from "express-rate-limit";

export const overallLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 50,
  message: {
    status: 429,
    error:
      "Too many requests from the user, please try again after 5 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});


export const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 5, 
  message: {
    status: 429,
    error: "Too many authentication attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
