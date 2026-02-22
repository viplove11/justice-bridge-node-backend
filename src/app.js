import express from "express";
import cors from "cors";   // <-- ADD THIS

import authRoutes from "./routes/auth.routes.js";
import lawRoutes from "./routes/law.routes.js";
import judgementRoutes from "./routes/judgement.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import chatRoutes from "./routes/chat.routes.js";
const app = express();

// --- Enable CORS ---
app.use(
  cors({
    origin: "*", // allow all origins (or replace with your domain)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// index route
app.get("/", (req, res) => {
  res.send("Backend running...");
});

// test route
app.get("/test-route", (req, res) => {
  return res.json({ msg: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/law", lawRoutes);
app.use("/api/judgement", judgementRoutes);
app.use("/api/dashboard", dashboardRoutes); 
app.use("/api/chat", chatRoutes);

export default app;