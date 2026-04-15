import rateLimit from "express-rate-limit";

export const overallLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 500,
  message: {
    status: 429,
    error: "Too many requests from the user, please try again after 5 minutes.",
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

export const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3,
  message: {
    status: 429,
    // error: "Too many password reset attempts. Please try again later.",
    message:
      "Too many password reset attempts, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
