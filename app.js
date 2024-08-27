const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

// Import middleware
const errorHandler = require("./middleware/errorHandler");
const rateLimiter = require("./middleware/rateLimiter");
const { morganMiddleware } = require("./middleware/logger");

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Setup middleware
app.use(cookieParser()); // Parse cookies
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(helmet()); // Add security headers
app.use(express.json()); // Parse JSON requests
app.use(rateLimiter); // Rate limiting
app.use(morganMiddleware); // Logging HTTP requests

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Import route handlers
const adminRouter = require("./routes/adminRouter");
const authRouter = require("./routes/authRouter");
const commentRouter = require("./routes/commentRouter");
const subscriptionRouter = require("./routes/subscriptionRouter");
const foodRouter = require("./routes/foodRouter");
const exerciseRouter = require("./routes/exerciseRouter");
const nutritionPlanRouter = require('./routes/nutritionPlanRouter');
const workoutPlanRouter = require('./routes/workoutPlanRouter');
const mealRouter = require('./routes/mealRouter');



// Register routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", adminRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/exercises", exerciseRouter);
app.use("/api/v1/foods", foodRouter);
app.use('/api/v1/nutrition-plans', nutritionPlanRouter);
app.use('/api/v1/workout-plans', workoutPlanRouter);
app.use('/api/v1/meals', mealRouter);

// Centralized error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
