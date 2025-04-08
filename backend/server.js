import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import connectDB  from "./config/db.js";
import { redirectUrl, shortUrl, urlAnalytics } from "./controllers/urlController.js";
import { registerUser, loginUser, getMe, logoutUser } from "./controllers/authCOntroller.js";
import { verifyJwt } from "./middleware/authMiddleware.js";
// import { configDotenv } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
const port = process.env.PORT || 3001;
// app.use(configDotenv())
app.use(bodyParser.json());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();

app.post("/api/signup",  registerUser)
app.post('/api/signin', loginUser);

app.get('/api/check-user', verifyJwt, getMe);
app.get("/api/logout", verifyJwt, logoutUser);
app.get("/:shortCode", redirectUrl);

app.get("/api/analytics", verifyJwt, urlAnalytics);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
