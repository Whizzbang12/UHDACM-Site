import { queryCollection } from "./context";

/**
 * This file is used to test what the context will return.
 * 
 * Uses the terminal.
 * 
 * Run via: `npm run contextTest`
 */

const main = async () => {
  while (true) {
    const query = await new Promise<string>((resolve) => {
      process.stdout.write("Enter your query: ");
      process.stdin.once("data", (data) => resolve(data.toString().trim()));
    });
    const documents = await queryCollection(query);

    console.log(JSON.stringify(documents, null, 2)+ '\n\n');
  }
}

main();