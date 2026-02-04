import dotenv from 'dotenv';
import { DeleteTestData } from './src/db/db';
import { beforeAll } from 'vitest';
import { env_vars } from './src/env/envVars';


// setups .env variable access
dotenv.config();

if (!env_vars.TESTING) {
    throw new Error('Expected testing mode to be true, but env.TESTING='+env_vars.TESTING);
}

beforeAll(async () => {
    await DeleteTestData();
});
