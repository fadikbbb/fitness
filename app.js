const cookieParser = require("cookie-parser");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const xss = require("xss-clean");
const cors = require("cors");
const hpp = require("hpp");
require("dotenv").config();

// Import middleware
const errorHandler = require("./middlewares/errorHandler");
const rateLimiter = require("./middlewares/rateLimiter");
const { connectDB } = require("./config/connection");
const coreOptions = require("./config/coreOptions");

// Connect to MongoDB
connectDB();

// Initialize express app
const app = express();

// Setup middleware
app.use(cookieParser());
app.use(cors(coreOptions));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(xss());
app.use(hpp());
app.use(rateLimiter);

// Import route handlers
const userRouter = require("./routes/userRouter");
const authRouter = require("./routes/authRouter");
const foodRouter = require("./routes/foodRouter");
const commentRouter = require("./routes/commentRouter");
const settingRouter = require("./routes/settingRouter");
const exerciseRouter = require("./routes/exerciseRouter");
const supplementRouter = require("./routes/supplementRouter");
const workoutPlanRouter = require("./routes/workoutPlanRouter");
const weeklyReportsRouter = require("./routes/weeklyReportRouter");
const nutritionPlanRouter = require("./routes/nutritionPlanRouter");
const supplementPlanRouter = require("./routes/supplementPlanRouter");

// Route handlers
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/foods", foodRouter);
app.use("/api/v1/settings", settingRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/exercises", exerciseRouter);
app.use("/api/v1/supplements", supplementRouter);
app.use("/api/v1/workout-plans", workoutPlanRouter);
app.use("/api/supplement-plans", supplementPlanRouter);
app.use("/api/v1/weekly-reports", weeklyReportsRouter);
app.use("/api/v1/nutrition-plans", nutritionPlanRouter);

app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
