import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import connectDB from "./config/db.js";
import {
  redirectUrl,
  shortUrl,
  urlAnalytics,
} from "./controllers/urlController.js";
import {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
} from "./controllers/authController.js";
import { verifyJwt } from "./middleware/authMiddleware.js";
import path from 'path';
import { fileURLToPath } from 'url';
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
const port = process.env.PORT || 3001;
// app.use(configDotenv())
// app.use(bodyParser.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

connectDB();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // This will be .../USHORT/backend
app.post("/api/signup", registerUser);
app.post("/api/signin", loginUser);

app.get("/api/check-user", verifyJwt, getMe);
app.get("/api/logout", verifyJwt, logoutUser);
app.get("/:shortCode", redirectUrl);
app.post("/api/shorten", verifyJwt, shortUrl);
app.get("/api/analytics", verifyJwt, urlAnalytics);


// --- Static Files Serving ---
// Go up one level ('..') to the project root, then into client/dist
const staticPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(staticPath));
console.log(`Serving static files from: ${staticPath}`); // For debugging

// --- SPA Fallback ---
// For any GET request that doesn't match an API route or a static file,
// send the index.html file. This allows client-side routing to take over.
app.get(/(.*)/, (req, res) => {
  const indexPath = path.join(__dirname, '..', 'client', 'dist', 'index.html');
  res.sendFile(indexPath);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
