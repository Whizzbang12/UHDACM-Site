import express from "express";
import { env_vars } from "./env/envVars";
import './vectorDB/ingester'

const app = express();

app.use(express.json());

app.post("/update", (_, res) => {
  res.status(200).send("Update received");
});

app.listen(env_vars.PORT, () => {
  console.log(`Server is running on port ${env_vars.PORT}`);
});