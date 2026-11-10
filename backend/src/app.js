import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import limiter from "./middlewares/rateLimeter.middleware.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json({ limit: "16kb" }));
app.use(urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(limiter);
app.set("trust proxy", 1);

//routes import
import themeRoutes from "./routes/theme.routes.js";

//routes decleration
app.use("/api/v1/themes", themeRoutes);

export default app;
