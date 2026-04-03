import http, { IncomingMessage, ServerResponse } from "http";
import { parse as parseUrl } from "url";
import fs from "fs";
import path from "path";
import os from "os";
import { ParsedUrlQuery } from "querystring";

import {
  ServerConfig,
  RequestInfo,
  SystemSnapshot,
  LogEntry,
  LogLevel,
} from "./types";

// Generic Json reader
function readJson<T>(filePath: string): T {
  const raw: string = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

// Load Config
const configPath: string = path.join(__dirname, "..", "config.json");
const baseConfig: ServerConfig = readJson<ServerConfig>(configPath);
const overrides: Partial<ServerConfig> = {};
const config: ServerConfig = { ...baseConfig, ...overrides };
const logFilePath: string = path.join(__dirname, "..", config.logFile);

// Logger
// Appends log entries to the specified log file
function log(entry: LogEntry): void {
  const line: string = JSON.stringify(entry) + "\n";
  fs.appendFileSync(logFilePath, line, "utf-8");
  console.log(`[${entry.timestamp}] [${entry.level}] - ${entry.message}`);
}

//system snapshot
function buildSystemSnapshot(): SystemSnapshot {
  const rawEnv: NodeJS.ProcessEnv = process.env;
  const env: Record<string, string> = Object.keys(rawEnv).reduce<
    Record<string, string>
  >((accumulator, key) => {
    const value: string | undefined = rawEnv[key];
    if (value !== undefined) {
      accumulator[key] = value;
    }
    return accumulator;
  }, {});
  const snapshot: SystemSnapshot = {
    platform: os.platform(),
    arch: os.arch(),
    totalMemory: os.totalmem(),
    freeMemory: os.freemem(),
    nodeVersion: process.version,
    env,
  };
  return snapshot;
}

function normalizeQuery(
  query: ParsedUrlQuery,
): Record<string, string | string[]> {
  const normalizedQuery: Record<string, string | string[]> = {};

  for (const key of Object.keys(query)) {
    const value: string | string[] | undefined = query[key];

    if (typeof value === "string") {
      normalizedQuery[key] = value;
    } else if (Array.isArray(value)) {
      normalizedQuery[key] = value;
    }
  }

  return normalizedQuery;
}

// parse incoming request
// url.parse breaks a URL into its parts

function buildRequestInfo(req: IncomingMessage): RequestInfo {
  const rawUrl: string = req.url ?? "/";
  const parsed = parseUrl(rawUrl, true);
  const pathname: string = parsed.pathname ?? "/";
  const query: Record<string, string | string[]> = normalizeQuery(parsed.query);
  const method: string = req.method ?? "GET";

  const requestInfo: RequestInfo = {
    method,
    pathname,
    query,
  };
  return requestInfo;
}

// Http server handler
const server = http.createServer(
  (req: IncomingMessage, res: ServerResponse): void => {
    const requestInfo: RequestInfo = buildRequestInfo(req);
    const entry: LogEntry = {
      level: LogLevel.INFO,
      message: `${requestInfo.method} ${requestInfo.pathname}`,
      timestamp: new Date().toISOString(),
    };
    log(entry);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", request: requestInfo }));
  },
);

// Start the server
server.listen(config.port, config.host, (): void => {
  const snapshot: SystemSnapshot = buildSystemSnapshot();
  console.log("System snapshot:", snapshot);

  const snapshotEntry: LogEntry = {
    level: LogLevel.INFO,
    message: `System snapshot | platform: ${snapshot.platform} | arch: ${snapshot.arch} | totalMemory: ${snapshot.totalMemory} | freeMemory: ${snapshot.freeMemory} | nodeVersion: ${snapshot.nodeVersion}`,
    timestamp: new Date().toISOString(),
  };
  log(snapshotEntry);

  const startEntry: LogEntry = {
    level: LogLevel.INFO,
    message: `Server started on http://${config.host}:${config.port}`,
    timestamp: new Date().toISOString(),
  };
  log(startEntry);

  console.log(`\nServer is running at http://${config.host}:${config.port}/\n`);
});
