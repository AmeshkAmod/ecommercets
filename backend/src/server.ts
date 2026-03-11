import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { buildRolePermissionCache } from "./services/rbacService.js";
import connectDB from "./config/db.js";
import { seedRoles } from "./config/authRoles.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

dotenv.config();

const app = express();

/* ---------- MIDDLEWARE ---------- */
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

/* ✅ SERVE UPLOADED IMAGES */
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.json({ message: "Backend working" });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* ---------- ROUTES ---------- */
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/users", userRoutes);

/* ---------- SERVER ---------- */
const PORT = process.env.PORT || 5000;

/* ---------- SEED ROLES ---------- */
async function startServer() {
  try {
    await connectDB();
    await seedRoles();
    await buildRolePermissionCache();

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
