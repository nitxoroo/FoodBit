import express from "express";
import dotenv from "dotenv";
dotenv.config()
import connectDb from "./Config/db.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Length", "Date", "Cross-Origin-Resource-Policy", "Cross-Origin-Embedder-Policy"]
}));

// global middlewares
app.use(express.json());
app.use(cookieParser());


//routes
app.use("/api/auth", authRouter);

//routes
app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    connectDb();
    console.log(`Server is running on port ${port}`);
});