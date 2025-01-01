require("dotenv").config();
const express = require("express");
const cors = require("cors");  // Import CORS
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const movieRoutes = require("./routes/movieRoutes");
const errorHandler = require("./middlewares/errorHandler");

// Initialize app and database
const app = express();
connectDB();


// Enable CORS for all routes
app.use(cors({
  origin: "http://localhost:5173",  // Allow requests from the frontend
  methods: "GET,POST,PUT,DELETE",  // Allowed HTTP methods
  credentials: true,  // Allow cookies, if needed
}));

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});