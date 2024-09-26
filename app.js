const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const xss = require('xss-clean');
const cookieParser = require("cookie-parser");
const hpp = require('hpp');
require("dotenv").config();


// Import middleware
const errorHandler = require("./middlewares/errorHandler");
const rateLimiter = require("./middlewares/rateLimiter");
const { connectDB } = require('./config/connection');

// Connect to MongoDB
connectDB();

// Initialize express app
const app = express();

// Setup middleware
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(xss());
app.use(hpp());
app.use(rateLimiter);


// Import route handlers
const userRouter = require("./routes/userRouter");
const authRouter = require("./routes/authRouter");
const commentRouter = require("./routes/commentRouter");
const foodRouter = require("./routes/foodRouter");
const exerciseRouter = require("./routes/exerciseRouter");
const nutritionPlanRouter = require('./routes/nutritionPlanRouter');
const workoutPlanRouter = require('./routes/workoutPlanRouter');

// Register routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/exercises", exerciseRouter);
app.use("/api/v1/foods", foodRouter);
app.use('/api/v1/nutrition-plans', nutritionPlanRouter);
app.use('/api/v1/workout-plans', workoutPlanRouter);

// Centralized error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
