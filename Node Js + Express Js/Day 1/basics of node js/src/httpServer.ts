import http from "node:http";
import { URL } from "node:url";
import * as osInfo from "./osInfo";
import * as pathUtils from "./pathUtils";
import * as fsOps from "./fsOperations";
import { sendEmailOrLog } from "./mailer";

export type ApiRequestContext = {
  method: string;
  pathname: string;
  searchParams: URLSearchParams;
};

/**
 * Sends a JSON response with the correct `Content-Type` and optional status code.
 * How: Serializes with `JSON.stringify`, sets headers once, ends the response (typical REST pattern).
 */
function sendJson(
  res: http.ServerResponse,
  statusCode: number,
  body: unknown
): void {
  const payload = JSON.stringify(body);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(payload),
  });
  res.end(payload);
}

/**
 * Parses the request URL into pathname and query string using the WHATWG `URL` API.
 * How: `http.IncomingMessage.url` is path + query only; supply `http://localhost` as base for parsing.
 */
function parseRequestUrl(req: http.IncomingMessage): URL | null {
  const raw = req.url;
  if (!raw) return null;
  return new URL(raw, "http://localhost");
}

/**
 * Basic route handler type: receives Node's req/res and returns whether it handled the request.
 * How: Chain handlers in order; first that returns `true` stops the chain (simple router pattern).
 */
type RouteHandler = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  url: URL
) => Promise<boolean>;

/**
 * GET / and /health — liveness info for clients and load balancers.
 * How: No side effects; fast path for uptime checks.
 */
const handleHealth: RouteHandler = async (req, res, url) => {
  if (req.method !== "GET") return false;
  if (url.pathname !== "/" && url.pathname !== "/health") return false;
  sendJson(res, 200, {
    ok: true,
    service: "basics-of-node-js",
    uptime: process.uptime(),
  });
  return true;
};

/**
 * GET /api/os — demonstrates aggregating OS module data into an API response.
 * How: Reads snapshot values; do not expose sensitive internal details in public production APIs.
 */
const handleOs: RouteHandler = async (req, res, url) => {
  if (req.method !== "GET" || url.pathname !== "/api/os") return false;
  sendJson(res, 200, {
    platform: osInfo.getPlatform(),
    arch: osInfo.getCpuArchitecture(),
    hostname: osInfo.getHostname(),
    cpus: osInfo.getCpuCount(),
    totalMem: osInfo.getTotalMemoryBytes(),
    freeMem: osInfo.getFreeMemoryBytes(),
    homedir: osInfo.getUserHome(),
    tmpdir: osInfo.getTempDirectory(),
  });
  return true;
};

/**
 * GET /api/path?join=a&join=b — demonstrates `path` utilities from query segments.
 * How: Validates input lightly; real APIs should sanitize path segments to avoid traversal issues.
 */
const handlePathDemo: RouteHandler = async (req, res, url) => {
  if (req.method !== "GET" || url.pathname !== "/api/path") return false;
  const parts = url.searchParams.getAll("join");
  const joined = parts.length ? pathUtils.joinPath(...parts) : pathUtils.normalizePath(".");
  sendJson(res, 200, {
    joined,
    cwd: process.cwd(),
    isAbsolute: pathUtils.isAbsolutePath(joined),
  });
  return true;
};

/**
 * GET /api/fs-demo — runs a small non-blocking read/write cycle under `./data`.
 * How: Ensures directory exists, writes a file, reads it back; illustrates async fs in a request.
 */
const handleFsDemo: RouteHandler = async (req, res, url) => {
  if (req.method !== "GET" || url.pathname !== "/api/fs-demo") return false;
  const target = fsOps.dataFilePath("demo-output.txt");
  try {
    await fsOps.ensureDirNonBlocking(fsOps.dataFilePath());
    await fsOps.writeTextFileNonBlocking(
      target,
      `Written at ${new Date().toISOString()}\n`
    );
    const content = await fsOps.readTextFileNonBlocking(target);
    sendJson(res, 200, { path: target, length: content.length, preview: content.slice(0, 200) });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    sendJson(res, 500, { error: message });
  }
  return true;
};

/**
 * POST /api/mail — accepts JSON `{ to, subject, text, html? }` and forwards to Nodemailer (or logs).
 * How: Reads body chunks, `JSON.parse`, validates minimal fields; returns 400 on bad input.
 */
const handleMail: RouteHandler = async (req, res, url) => {
  if (req.method !== "POST" || url.pathname !== "/api/mail") return false;
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(chunk as Buffer);
  }
  let body: unknown;
  try {
    body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    sendJson(res, 400, { error: "Invalid JSON body" });
    return true;
  }
  if (
    typeof body !== "object" ||
    body === null ||
    typeof (body as { to?: unknown }).to !== "string" ||
    typeof (body as { subject?: unknown }).subject !== "string" ||
    typeof (body as { text?: unknown }).text !== "string"
  ) {
    sendJson(res, 400, { error: "Expected { to, subject, text }" });
    return true;
  }
  const b = body as { to: string; subject: string; text: string; html?: string };
  const from = process.env.MAIL_FROM ?? "noreply@localhost";
  const result = await sendEmailOrLog({
    from,
    to: b.to,
    subject: b.subject,
    text: b.text,
    html: typeof b.html === "string" ? b.html : undefined,
  });
  sendJson(res, 200, result);
  return true;
};

const routes: RouteHandler[] = [
  handleHealth,
  handleOs,
  handlePathDemo,
  handleFsDemo,
  handleMail,
];

/**
 * Dispatches an incoming HTTP request through the route table, then 404s if unmatched.
 * How: Async iteration over `routes`; each handler decides based on method + pathname.
 */
async function dispatch(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  url: URL
): Promise<void> {
  for (const route of routes) {
    if (await route(req, res, url)) return;
  }
  sendJson(res, 404, { error: "Not found", path: url.pathname });
}

/**
 * Creates the HTTP server using `http.createServer` and attaches the request listener.
 * How: Listener parses URL, calls `dispatch`; errors on the server emit `error` event (listen EADDRINUSE, etc.).
 */
export function createApiServer(): http.Server {
  return http.createServer(async (req, res) => {
    const url = parseRequestUrl(req);
    if (!url) {
      res.writeHead(400);
      res.end();
      return;
    }
    try {
      await dispatch(req, res, url);
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      sendJson(res, 500, { error: message });
    }
  });
}

/**
 * Starts listening on the given port (default 3000) and resolves when listening.
 * How: `server.listen` with callback; in production you'd read `PORT` from environment (shown here).
 */
export function startServer(port = Number(process.env.PORT) || 3000): http.Server {
  const server = createApiServer();
  server.listen(port, () => {
    console.log(`HTTP server listening on http://localhost:${port}`);
  });
  return server;
}
