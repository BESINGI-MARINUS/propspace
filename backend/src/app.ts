import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import propertyRoutes from "./routes/property.routes";
import { notFoundHandler } from "./utils/notFoundHandler";
import { errorHandler } from "./utils/errorHandler";

const app = express();

// Global middleware
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/properties", propertyRoutes);

// 404 catch-all
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT ?? 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
