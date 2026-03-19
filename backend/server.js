import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/AuthRoutes.js";
import userRoutes from "./routes/UserRoutes.js";
import cors from "cors";

dotenv.config();

const app = express();

connectDB();

app.use(cors(process.env.FRONTEND_URL || "*"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to BabyNest API");
});
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.listen(process.env.PORT , () => {
  console.log(`Server running on port ${process.env.PORT }`);
});