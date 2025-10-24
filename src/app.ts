import express from "express";
import Appeal from "@models/appeal.model.js";
import appealRouter from "@routes/appeal.routes.js";

const app = express();
app.use(express.json());
app.use("/appeals", appealRouter);

Appeal.sync({ force: true }).then(() => {
  console.log("Database synced");
});

export default app;
