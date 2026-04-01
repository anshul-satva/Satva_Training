"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const url_1 = require("url");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const types_1 = require("./types");
// Generic Json reader
function readJson(filePath) {
    const raw = fs_1.default.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
}
// Load Config
const configPath = path_1.default.join(__dirname, "..", "config.json");
const baseConfig = readJson(configPath);
const overrides = {};
const config = { ...baseConfig, ...overrides };
const logFilePath = path_1.default.join(__dirname, "..", config.logFile);
// Logger
// Appends log entries to the specified log file
function log(entry) {
    const line = JSON.stringify(entry) + "\n";
    fs_1.default.appendFileSync(logFilePath, line, "utf-8");
    console.log(`[${entry.timestamp}] [${entry.level}] - ${entry.message}`);
}
//system snapshot
function buildSystemSnapshot() {
    const rawEnv = process.env;
    const env = Object.keys(rawEnv).reduce((accumulator, key) => {
        const value = rawEnv[key];
        if (value !== undefined) {
            accumulator[key] = value;
        }
        return accumulator;
    }, {});
    const snapshot = {
        platform: os_1.default.platform(),
        arch: os_1.default.arch(),
        totalMemory: os_1.default.totalmem(),
        freeMemory: os_1.default.freemem(),
        nodeVersion: process.version,
        env,
    };
    return snapshot;
}
function normalizeQuery(query) {
    const normalizedQuery = {};
    for (const key of Object.keys(query)) {
        const value = query[key];
        if (typeof value === "string") {
            normalizedQuery[key] = value;
        }
        else if (Array.isArray(value)) {
            normalizedQuery[key] = value;
        }
    }
    return normalizedQuery;
}
// parse incoming request
// url.parse breaks a URL into its parts
function buildRequestInfo(req) {
    const rawUrl = req.url ?? "/";
    const parsed = (0, url_1.parse)(rawUrl, true);
    const pathname = parsed.pathname ?? "/";
    const query = normalizeQuery(parsed.query);
    const method = req.method ?? "GET";
    const requestInfo = {
        method,
        pathname,
        query,
    };
    return requestInfo;
}
// Http server handler
const server = http_1.default.createServer((req, res) => {
    const requestInfo = buildRequestInfo(req);
    const entry = {
        level: types_1.LogLevel.INFO,
        message: `${requestInfo.method} ${requestInfo.pathname}`,
        timestamp: new Date().toISOString(),
    };
    log(entry);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", request: requestInfo }));
});
// Start the server
server.listen(config.port, config.host, () => {
    const snapshot = buildSystemSnapshot();
    console.log("System snapshot:", snapshot);
    const snapshotEntry = {
        level: types_1.LogLevel.INFO,
        message: `System snapshot | platform: ${snapshot.platform} | arch: ${snapshot.arch} | totalMemory: ${snapshot.totalMemory} | freeMemory: ${snapshot.freeMemory} | nodeVersion: ${snapshot.nodeVersion}`,
        timestamp: new Date().toISOString(),
    };
    log(snapshotEntry);
    const startEntry = {
        level: types_1.LogLevel.INFO,
        message: `Server started on http://${config.host}:${config.port}`,
        timestamp: new Date().toISOString(),
    };
    log(startEntry);
    console.log(`\nServer is running at http://${config.host}:${config.port}/\n`);
});
