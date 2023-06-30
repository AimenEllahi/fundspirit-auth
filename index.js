//required modules
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.js";
import campaignRoutes from "./routes/campaign.js";
import organizationRoutes from "./routes/organization.js";

import { sendEmail } from "./Utilities/NodeMailer.js";
import ejs from "ejs";

import { fileURLToPath } from "url";
import path from "path";
import { task } from "./Utilities/CroneJob.js";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

//Configuration
dotenv.config();
const PORT = process.env.PORT || 8800;

const app = express();
// middleware
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use(cookieParser());
app.set("view engine", "ejs");

app.set("views", __dirname + "/views");

app.use("/api/users/", userRoutes);
app.use("/api/campaigns/", campaignRoutes);
app.use("/api/npos/", organizationRoutes);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Internal Server Error";

  res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

//testing
app.get("/", (req, res) =>
  res.status(200).json({ message: "Everything Works Fine" })
);

// Database connection
mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log("Server Running on Port: ", PORT));
    // task();
  })
  .catch((error) => {
    console.log(error);
  });

export default app;
