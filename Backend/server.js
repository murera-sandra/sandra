import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { dbConnection } from "./db.js";
import authRoutes from "./routes/auth.js";
import supplierRoutes from "./routes/suppliers.js";
import materialRoutes from "./routes/materials.js";
import stockRoutes from "./routes/stock.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Core middleware
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/stock", stockRoutes);

// 404 + error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server after DB is ready
dbConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
