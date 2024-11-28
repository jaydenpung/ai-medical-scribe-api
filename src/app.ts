import "reflect-metadata";
import express from "express";
import cors from "cors";
import "./config/env";
import { AppDataSource } from "./config/database";
import consultRoutes from "./routes/consult.route";
import recordingRoutes from "./routes/recording.route";
import { consumeFromQueue } from "./queues/recording-processor-queue";

consumeFromQueue();

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json());
app.use("/api/consults", consultRoutes);
app.use("/api/recordings", recordingRoutes);

AppDataSource.initialize()
  .then(() => {
    app.listen(process.env.PORT, () => console.log("Server running"));
  })
  .catch((error) => console.log(error));
