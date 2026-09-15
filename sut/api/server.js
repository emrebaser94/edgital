/**
 * json-server started as a module instead of via its CLI, so the API can add
 * the rules json-server lacks out of the box: input validation, JSON error
 * responses, a JSON-only write contract, read-only reference data and a CORS
 * allowlist. Everything else (routes, filtering, paging, persistence to
 * db.json) is plain json-server 0.17.4.
 */
const path = require('path');
const jsonServer = require('json-server');

const DB_FILE = process.env.DB_FILE || path.join(__dirname, 'db.json');
const PORT = Number(process.env.PORT || 3000);
// Bind to all interfaces: inside a container "localhost" is unreachable from the host.
const HOST = process.env.HOST || '0.0.0.0';
const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const WRITE_METHODS = ['POST', 'PUT', 'PATCH'];

const server = jsonServer.create();
const router = jsonServer.router(DB_FILE);

const sendError = (res, status, message) => res.status(status).json({ error: message });

// CORS: only the web app may call the API from a browser. json-server's default
// (cors({ origin: true, credentials: true })) reflects every origin.
server.use((req, res, next) => {
  const origin = req.get('Origin');
  if (origin) {
    res.header('Vary', 'Origin');
  }
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
      res.header('Access-Control-Allow-Headers', req.get('Access-Control-Request-Headers') || 'Content-Type');
    }
  }
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

server.use(jsonServer.defaults({ noCors: true }));

// /roads is reference data: a client must not replace or modify it.
// (DELETE is left to json-server, which answers 404 for this object resource.)
server.use('/roads', (req, res, next) =>
  WRITE_METHODS.includes(req.method) ? sendError(res, 405, 'roads are read-only') : next());

// Write requests must send JSON; otherwise json-server silently drops the body.
server.use((req, res, next) =>
  WRITE_METHODS.includes(req.method) && !req.is('application/json')
    ? sendError(res, 415, 'Content-Type must be application/json')
    : next());

server.use(jsonServer.bodyParser);

// A new todo needs a title and the road it belongs to, and must not reuse an id.
server.post('/todos', (req, res, next) => {
  const { id, title, road_fid: roadFid } = req.body;
  if (typeof title !== 'string' || title.trim() === '' || !Number.isInteger(roadFid)) {
    return sendError(res, 400, 'title (non-empty string) and road_fid (integer) are required');
  }
  const hasId = id !== undefined && id !== null && id !== '';
  if (hasId && router.db.get('todos').some((todo) => String(todo.id) === String(id)).value()) {
    return sendError(res, 409, `a todo with id ${id} already exists`);
  }
  next();
});

server.use(router);

// Errors (e.g. a malformed JSON body) as JSON instead of Express' HTML page.
// eslint-disable-next-line no-unused-vars
server.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  sendError(res, status, err.type === 'entity.parse.failed' ? 'malformed JSON body' : err.message);
});

server.listen(PORT, HOST, () => {
  console.log(`API listening on http://${HOST}:${PORT} (db: ${DB_FILE}, CORS: ${ALLOWED_ORIGINS.join(', ')})`);
});
