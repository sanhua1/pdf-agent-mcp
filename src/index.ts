import { createServer } from './server.js';

async function main() {
  const server = createServer();
  await server.start();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
