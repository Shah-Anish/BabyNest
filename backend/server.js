import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/AuthRoutes.js";
import userRoutes from "./routes/UserRoutes.js";
import childRoutes from "./routes/ChildRoutes.js";
import vaccinationRoutes from "./routes/VaccinationRoutes.js";
import reminderRoutes from "./routes/ReminderRoutes.js";
import medicalVisitRoutes from "./routes/MedicalVisitRoutes.js";
import prescriptionRoutes from "./routes/PrescriptionRoutes.js";
import medicalDocumentRoutes from "./routes/MedicalDocumentRoutes.js";
import growthRecordRoutes from "./routes/GrowthRecordRoutes.js";
import growthAnalyticsRoutes from "./routes/GrowthAnalyticsRoutes.js";
import nutritionRecommendationRoutes from "./routes/NutritionRecommendationRoutes.js";
import dailyCareTipRoutes from "./routes/DailyCareTipRoutes.js";
import emergencyContactRoutes from "./routes/EmergencyContactRoutes.js";
import doctorContactRoutes from "./routes/DoctorContactRoutes.js";
import settingsRoutes from "./routes/SettingsRoutes.js";
import auditLogRoutes from "./routes/AuditLogRoutes.js";
import healthCheckRoutes from "./routes/HealthCheckRoutes.js";
import parentRoutes from "./routes/ParentRoutes.js";
import adminRoutes from "./routes/AdminRoutes.js";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js";

dotenv.config();

const app = express();

connectDB();

app.use(cors(process.env.FRONTEND_URL || "*"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to BabyNest API");
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Authentication & User Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Parent Dashboard Routes
app.use("/api/parent", parentRoutes);

// Admin Routes
app.use("/api/admin", adminRoutes);

// Child Management Routes
app.use("/api/children", childRoutes);
app.use("/api/vaccinations", vaccinationRoutes);
app.use("/api/reminders", reminderRoutes);

// Medical Routes
app.use("/api/medical-visits", medicalVisitRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/medical-documents", medicalDocumentRoutes);

// Growth Tracking Routes
app.use("/api/growth-records", growthRecordRoutes);
app.use("/api/growth-analytics", growthAnalyticsRoutes);

// Content & Tips Routes (Admin)
app.use("/api/nutrition-recommendations", nutritionRecommendationRoutes);
app.use("/api/daily-care-tips", dailyCareTipRoutes);

// Contacts Routes
app.use("/api/emergency-contacts", emergencyContactRoutes);
app.use("/api/doctor-contacts", doctorContactRoutes);

// Health Check Routes
app.use("/api/health-checks", healthCheckRoutes);

// Admin Routes
app.use("/api/settings", settingsRoutes);
app.use("/api/audit-logs", auditLogRoutes);

app.listen(process.env.PORT , () => {
  console.log(`Server running on port ${process.env.PORT }`);
});