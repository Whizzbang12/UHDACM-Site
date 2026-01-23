import express, { Request, Response } from 'express';
import cors from 'cors';
import { queryCollection } from './context/context';
import { handleQuestion } from './langchain/langchain';

const app = express();
const PORT = 4000;
const FRONTEND_ADDRESS = 'http://localhost:3000';

type ChatRequestBody = {
  query: string;
};

app.use(express.json());
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

app.post('/chat', async (req: Request<{}, {}, ChatRequestBody>, res: Response) => {
  const { query } = req.body;
  const documents = await queryCollection(query)

  const prompt = "Respond to user's query using the following information\n\n" + documents.join(" ") + "\n this is the query: " + query
  const response =  await handleQuestion(prompt)

  return res.status(200).json({ response: response });
});


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
