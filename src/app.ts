import express from "express";
import Appeal from "../models/appeal.model";
import appealRouter from "../routes/appeal.routes";

const app = express();
app.use(express.json());
app.use("/appeals", appealRouter);

Appeal.sync({ force: true }).then(() => {
  console.log("Database synced");
});

export default app;
