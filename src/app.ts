import "reflect-metadata";
import express from "express";
import './config/env';
import { AppDataSource } from "./config/database";
import consultRoutes from "./routes/consult.route";
import recordingRoutes from "./routes/recording.route";

const app = express();

app.use(express.json());
app.use("/api/consults", consultRoutes);
app.use("/api/recordings", recordingRoutes);

AppDataSource.initialize()
  .then(() => {
    app.listen(3000, () => console.log("Server running"));
  })
  .catch((error) => console.log(error));
