# Environment Variables Utility

This utility, `envVars.ts`, centralizes and types environment variable management. It exports `env_vars`, an object mapping `process.env` variables with type safety. If a required variable is not present, it throws an error, ensuring that all necessary variables are defined. Import and use it to access variables cleanly:

```typescript
import { env_vars } from './envVars';
const apiKey = env_vars.API_KEY;
```

Ensure all required variables are set in your `.env` file.
