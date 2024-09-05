import express from "express";
import cvRoutes from "./routes/cvRoutes";
import path from "path";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json());
app.use(express.json());

app.use("/api", cvRoutes);
app.use("/output", express.static(path.join(__dirname, "output")));

export default app;
