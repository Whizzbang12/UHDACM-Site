import express from "express";
import { env_vars } from "./env/envVars";
import "./vectorDB/writer";
import cors from "cors";
import {
  isCMSCollectionSingular,
  isCMSSingleType,
  isCMSSingleTypePage,
} from "@shared/types/cms/CMSCheck";
import { createTicketForCollection } from "./vectorDB/tools";
import { GlobalVectorDBWriter } from "./vectorDB/writer";
import { EqualsTimed } from "@shared/tools";
import { LogMessage } from "./log/log";

const app = express();

LogMessage('online');

app.use(
  cors({
    origin: [env_vars.CMS_URL], // only cms allowed to talk to the vectorDB manager
  }),
);
app.use(express.json());

  app.post("/update", async (req, res) => {
    try {
    const CMSAuthToken = req.headers["authorization"];
    if (!(await EqualsTimed(CMSAuthToken, env_vars.CMS_AUTH_TOKEN, 1000))) {
      return res.status(403).send({ error: "Unauthorized" });
    }

    const body = req.body;

    console.log("Received CMS update request:", body);
    if (!body) {
      return res.status(400).send({ error: "Invalid request body" });
    }

    const { model } = body;
    console.log("Extracted model from request body:", model);

    if (!model) {
      return res.status(400).send({ error: "Missing model in request body" });
    }

    if (
      !isCMSCollectionSingular(model) &&
      !isCMSSingleType(model) &&
      !isCMSSingleTypePage(model)
    ) {
      return res
        .status(400)
        .send(JSON.stringify({ error: "Invalid model in request body" }));
    }

    await createTicketForCollection(model);
    setTimeout(() => {
      GlobalVectorDBWriter.write();
    }, 1500);
    res.status(200).send("Update received");

    } catch (e) {
      LogMessage((e as Error).message, {
        file: 'index.ts',
        path: '/update'
      });
    }
});

app.listen(env_vars.PORT, () => {
  console.log(`Server is running on port ${env_vars.PORT}`);
});
