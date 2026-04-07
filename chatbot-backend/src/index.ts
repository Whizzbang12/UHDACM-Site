import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { processQuery } from "./query/query";
import { LogMessage } from "./log/log";
import { QueryMessage } from "@shared/types/query/queryTypes";
import { checkQueryMessage } from "@shared/types/query/queryCheck";
import { env_vars } from "./tools/env/envVars";
import * as jwt from "jsonwebtoken";
import { sleep } from "@shared/tools";
import { rateLimitHourError, rateLimitMinuteError } from "@shared/types/rate_limiting/rateLimitingData";

console.log('v0.5', `mode=${process.env.NODE_ENV}`);
const app = express();
const PORT = env_vars.PORT;
const FRONTEND_ADDRESS = env_vars.FRONTEND_ADDRESS;

type ChatRequestBody = {
  cookieAuthCheck?: boolean;
  query: string;
  context: QueryMessage[];
};

app.use(express.json());
app.use(cookieParser());

// health check endpoint
app.get("/health_check", (_, res) => {
  res.send({ online: true });
});

const allowedOrigins = [FRONTEND_ADDRESS];
app.use(cors({ origin: allowedOrigins, credentials: true }));

// app.use((req: Request, res: Response, next) => {
//   const origin = req.headers.origin;
//   if (origin && !allowedOrigins.includes(origin)) {
//     return res.status(403).json({
//       error: "invalid frontend address",
//     });
//   }
//   next();
// });

interface WindowEntry {
  timestamps: number[];
}

interface RateLimitStore {
  [key: string]: WindowEntry | undefined;
}

const rateLimitStores = {
  cookiePerMinute: {} as RateLimitStore,
  cookiePerHour: {} as RateLimitStore,
  ipPerMinute: {} as RateLimitStore,
  ipPerHour: {} as RateLimitStore,
  uaPerMinute: {} as RateLimitStore,
  uaPerHour: {} as RateLimitStore,
};

interface WindowCounts {
  minute: number;
  hour: number;
}

function slidingWindowCheck(
  minuteStore: RateLimitStore,
  hourStore: RateLimitStore,
  key: string,
): WindowCounts {
  const now = Date.now();
  const MINUTE = 60 * 1000;
  const HOUR = 60 * 60 * 1000;

  const minuteEntry = minuteStore[key] ?? { timestamps: [] };
  minuteEntry.timestamps = minuteEntry.timestamps.filter(
    (t) => now - t < MINUTE,
  );
  minuteEntry.timestamps.push(now);
  minuteStore[key] = minuteEntry;

  const hourEntry = hourStore[key] ?? { timestamps: [] };
  hourEntry.timestamps = hourEntry.timestamps.filter((t) => now - t < HOUR);
  hourEntry.timestamps.push(now);
  hourStore[key] = hourEntry;

  return {
    minute: minuteEntry.timestamps.length,
    hour: hourEntry.timestamps.length,
  };
}

// Clean up old entries every 5 minutes
setInterval(
  () => {
    const now = Date.now();
    const hourMs = 60 * 60 * 1000;
    for (const store of Object.values(rateLimitStores)) {
      for (const key of Object.keys(store)) {
        const entry = store[key];
        if (entry) {
          entry.timestamps = entry.timestamps.filter((t) => now - t < hourMs);
          if (entry.timestamps.length === 0) {
            delete store[key];
          }
        }
      }
    }
  },
  5 * 60 * 1000,
);

// Rate limits:
// Cookie:     10/min,  30/hour
// IP:         30/min,  90/hour   (3x cookie)
// User-Agent: 60/min, 180/hour   (6x cookie)

async function rateLimitMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log('rating...', JSON.stringify(req.cookies, null, 2));
  const token = req.cookies?.auth_token as string | undefined;

  if (!token) {
    res.status(401).json({ error: "Missing auth token cookie" });
    return;
  }

  // Verify the JWT is valid
  try {
    jwt.verify(token, env_vars.AUTH_COOKIE_JWT_SECRET);
  } catch {
    res.status(401).json({ error: "Invalid or expired auth token" });
    return;
  }

  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const ua = req.headers["user-agent"] || "unknown";

  const COOKIE_MIN_MAX = 6;
  const COOKIE_HOUR_MAX = 12;

  let spamDelay = 0;

  const tokenCounts = slidingWindowCheck(
    rateLimitStores.cookiePerMinute,
    rateLimitStores.cookiePerHour,
    token,
  );
  if (tokenCounts.minute > COOKIE_MIN_MAX) {
    return res.status(429).json({ error: rateLimitMinuteError });
    // if (tokenCounts.minute > COOKIE_MIN_MAX) {
    // }
    // spamDelay = 2000;
  }
  if (tokenCounts.hour > COOKIE_HOUR_MAX) {
    return res
      .status(429)
      .json({ error: rateLimitHourError });
    // if (tokenCounts.hour > COOKIE_HOUR_MAX) {
    // }
    // spamDelay = 10000;
  }

  const ipCounts = slidingWindowCheck(
    rateLimitStores.ipPerMinute,
    rateLimitStores.ipPerHour,
    ip,
  );
  if (ipCounts.minute > COOKIE_MIN_MAX * 5) {
    return res.status(429).json({ error: rateLimitMinuteError });
  }
  if (ipCounts.hour > COOKIE_HOUR_MAX * 5) {
    res.status(429).json({ error: rateLimitHourError });
    return;
  }

  const uaCounts = slidingWindowCheck(
    rateLimitStores.uaPerMinute,
    rateLimitStores.uaPerHour,
    ua,
  );
  if (uaCounts.minute > COOKIE_MIN_MAX * 20) {
    res.status(429).json({ error: rateLimitMinuteError });
    return;
  }
  if (uaCounts.hour > COOKIE_HOUR_MAX * 20) {
    res.status(429).json({ error: rateLimitHourError });
    return;
  }

  res.setHeader("X-RateLimit-Limit-Minute", COOKIE_MIN_MAX);
  res.setHeader("X-RateLimit-Limit-Hour", COOKIE_HOUR_MAX);
  res.setHeader(
    "X-RateLimit-Remaining-Minute",
    COOKIE_MIN_MAX - tokenCounts.minute,
  );
  res.setHeader(
    "X-RateLimit-Remaining-Hour",
    COOKIE_HOUR_MAX - tokenCounts.hour,
  );

  // Scale delay 0→2s as token usage approaches the per-minute limit
  if (spamDelay) {
    await sleep(spamDelay);
  }

  next();
}

app.post(
  "/chat",
  rateLimitMiddleware,
  async (req: Request<{}, {}, ChatRequestBody>, res: Response) => {
    try {
      const { query, context, cookieAuthCheck } = req.body;

      // sent to check if auth cookie is valid
      // given it made it past the rateLimitMiddleware, it works
      if (cookieAuthCheck) {
        return res.send({ success: true });
      }

      // console.log('cias', context);
      const validContext: QueryMessage[] = [];
      if (Array.isArray(context)) {
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

app.post("/auth", async (req: Request, res: Response) => {
  const turnstileToken = req.headers["x-turnstile-token"] as string | undefined;

  console.log('??!!', env_vars.AUTH_COOKIE_JWT_SECRET);
  console.log('auth req', turnstileToken);
  if (!turnstileToken) {
    res.status(400).json({ error: "Missing x-turnstile-token header" });
    return;
  }

  // Verify with Cloudflare Turnstile
  try {
    const verifyRes = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: env_vars.AUTH_COOKIE_TURNSTILE_SECRET,
          response: turnstileToken,
        }),
      },
    );

    const result = (await verifyRes.json()) as { success: boolean };

    if (!result.success) {
      res.status(403).json({ error: "Turnstile verification failed" });
      return;
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to verify turnstile token" });
    return;
  }

  // Issue JWT valid for 1 hour
  const authToken = jwt.sign(
    { verified: true, iat: Math.floor(Date.now() / 1000) },
    env_vars.AUTH_COOKIE_JWT_SECRET,
    {
      expiresIn: "1h",
    },
  );

  const isProd = process.env.NODE_ENV === "production";
  res.cookie("auth_token", authToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "none",
    maxAge: 60 * 60 * 1000, // 1 hour,
    path: "/"
  });

  res.json({ success: true });
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
