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
//Configuration
dotenv.config();
const PORT = process.env.PORT || 8800;

const app = express();
// middleware
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use(cookieParser());

app.use("/api/users/", userRoutes);
//for campaign routes
app.use("/api/campaigns/", campaignRoutes);
//for organization routes
app.use("/api/npos/", organizationRoutes);

app.get("/", (req, res) => {
  res.send("We are on home page");
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
  })
  .catch((error) => {
    console.log(error);
  });
