import express, { Request, Response } from "express";
import cors from "cors";
import { processQuery } from "./query/query";
import { LogMessage } from "./log/log";
import { QueryMessage } from "@shared/types/query/queryTypes";
import { checkQueryMessage } from "@shared/types/query/queryCheck";
import { env_vars } from "./tools/env/envVars";

const app = express();
const PORT = env_vars.PORT;
const FRONTEND_ADDRESS = env_vars.FRONTEND_ADDRESS;

type ChatRequestBody = {
  query: string;
  context: QueryMessage[];
};

app.use(express.json());

// health check endpoint
app.get("/health_check", (_, res) => {
  res.send({ online: true });
});

const allowedOrigins = [FRONTEND_ADDRESS];
app.use(cors({ origin: allowedOrigins }));

// app.use((req: Request, res: Response, next) => {
//   const origin = req.headers.origin;
//   if (origin && !allowedOrigins.includes(origin)) {
//     return res.status(403).json({
//       error: "invalid frontend address",
//     });
//   }
//   next();
// });

app.post(
  "/chat",
  async (req: Request<{}, {}, ChatRequestBody>, res: Response) => {
    try {
      const { query, context } = req.body;

      // console.log('cias', context);
      const validContext: QueryMessage[] = [];
      for (const msg of context) {
        try {
          checkQueryMessage(msg);
          validContext.push(msg);
        } catch (e) {
          LogMessage((e as Error).message, {
            file: "index.ts",
            path: "/chat",
            msg: msg,
          });
        }
      }

      // console.log('context', validContext);

      const response = await processQuery(query, validContext);

      return res.status(200).json({ response: response });
    } catch (e) {
      LogMessage((e as Error).message, {
        file: "index.ts",
        endpoint: "/chat",
      });
      return res.status(400).json({ error: "server error" });
    }
  },
);

app.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});

/* Try test on browser console?
fetch("http://localhost:4000/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ messages: ["hello"] })
})
  .then(res => res.json())
  .then(console.log)
  .catch(console.error);
*/
