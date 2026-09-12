/**
 * Fail fast with a helpful message if the System Under Test is not running.
 * Runs automatically before `npm test` (see the "pretest" script).
 */
const http = require('node:http');

const baseURL = process.env.BASE_URL ?? 'http://localhost:5173';
const apiURL = process.env.API_URL ?? 'http://localhost:3000';

function ping(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      res.resume();
      resolve(res.statusCode && res.statusCode < 500);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(3000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

(async () => {
  const [api, web] = await Promise.all([ping(`${apiURL}/todos`), ping(baseURL)]);

  if (api && web) {
    console.log(`✓ SUT reachable (web: ${baseURL}, api: ${apiURL})`);
    return;
  }

  console.error('\n✗ System Under Test is not reachable.');
  if (!web) console.error(`  - Web app not responding at ${baseURL}`);
  if (!api) console.error(`  - API not responding at ${apiURL}/todos`);
  console.error('\n  Start it first:\n    cd ../sut && docker compose up --build\n');
  process.exit(1);
})();
