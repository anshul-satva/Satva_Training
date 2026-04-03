import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";

/** Callback invoked with an error if the operation failed, otherwise `err` is `null`. */
export type FsVoidCallback = (err: NodeJS.ErrnoException | null) => void;

/** Callback for operations that return data on success (`err` is `null` and `data` is defined). */
export type FsDataCallback<T> = (err: NodeJS.ErrnoException | null, data?: T) => void;

/**
 * Reads an entire file into a string synchronously (blocks the event loop until I/O completes).
 * How: `readFileSync` with `utf8` encoding returns a string; use only for small files or CLI tools.
 */
export function readTextFileBlocking(filePath: string): string {
  return fs.readFileSync(filePath, "utf8");
}

/**
 * Reads an entire file as text without blocking other callbacks (uses libuv thread pool / async I/O).
 * How: Promise-based `fs.promises.readFile`; await in async code so the event loop stays responsive.
 */
export async function readTextFileNonBlocking(filePath: string): Promise<string> {
  const buf = await fsp.readFile(filePath, "utf8");
  return buf;
}

/**
 * Writes a string to a file synchronously, creating or truncating the file.
 * How: `writeFileSync` is atomic at the API level; parent directory must exist unless you create it first.
 */
export function writeTextFileBlocking(filePath: string, data: string): void {
  fs.writeFileSync(filePath, 'keval soni', "utf8");
}

/**
 * Writes text to a file asynchronously (non-blocking).
 * How: `fsp.writeFile` returns a Promise; combine with `mkdir` with `{ recursive: true }` for nested paths.
 */
export async function writeTextFileNonBlocking(filePath: string, data: string): Promise<void> {
  await fsp.writeFile(filePath, data, "utf8");
}

/**
 * Appends data to a file synchronously (creates the file if missing).
 * How: `appendFileSync` opens in append mode; good for logs when you accept blocking writes.
 */
export function appendTextFileBlocking(filePath: string, data: string): void {
  fs.appendFileSync(filePath, data, "utf8");
}

/**
 * Appends text asynchronously without blocking.
 * How: `fsp.appendFile`; prefer a logging library for high-throughput production logs.
 */
export async function appendTextFileNonBlocking(filePath: string, data: string): Promise<void> {
  await fsp.appendFile(filePath, data, "utf8");
}

/**
 * Checks if a path exists synchronously via `fs.existsSync` (does not distinguish file vs directory).
 * How: Returns boolean; for race-free checks before create, prefer try/catch around `open` or `mkdir`.
 */
export function pathExistsBlocking(filePath: string): boolean {
  return fs.existsSync(filePath);
}

/**
 * Tests path existence asynchronously (non-blocking).
 * How: `fsp.access` with `fs.constants.F_OK`; throws if missing—catch or use `access` pattern you prefer.
 */
export async function pathExistsNonBlocking(filePath: string): Promise<boolean> {
  try {
    await fsp.access(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

/**
 * Creates a directory synchronously; `{ recursive: true }` creates nested folders like `mkdir -p`.
 * How: Without `recursive`, fails if parent does not exist; with it, succeeds if already exists.
 */
export function ensureDirBlocking(dirPath: string): void {
  fs.mkdirSync(dirPath, { recursive: true });
}

/**
 * Creates a directory asynchronously with optional recursion.
 * How: Same semantics as sync version; await before writing files inside the directory.
 */
export async function ensureDirNonBlocking(dirPath: string): Promise<void> {
  await fsp.mkdir(dirPath, { recursive: true });
}

/**
 * Lists directory entries synchronously (names only by default).
 * How: `readdirSync` with `withFileTypes: true` gives `Dirent` objects (`.isFile()`, `.isDirectory()`).
 */
export function listDirBlocking(dirPath: string): string[] {
  return fs.readdirSync(dirPath);
}

/**
 * Lists a directory asynchronously (non-blocking).
 * How: `fsp.readdir`; use `withFileTypes: true` when you need type information without extra `stat` calls.
 */
export async function listDirNonBlocking(dirPath: string): Promise<string[]> {
  return fsp.readdir(dirPath);
}

/**
 * Deletes a file synchronously.
 * How: `unlinkSync` removes the name; file handles elsewhere may keep storage until closed.
 */
export function removeFileBlocking(filePath: string): void {
  fs.unlinkSync(filePath);
}

/**
 * Deletes a file asynchronously.
 * How: `fsp.unlink`; handle `ENOENT` if you need idempotent deletes.
 */
export async function removeFileNonBlocking(filePath: string): Promise<void> {
  await fsp.unlink(filePath);
}

/**
 * Copies a file synchronously (same filesystem; fast where supported).
 * How: `copyFileSync` with optional `COPYFILE_EXCL` to fail if destination exists (see fs.constants).
 */
export function copyFileBlocking(src: string, dest: string): void {
  fs.copyFileSync(src, dest);
}

/**
 * Copies a file asynchronously.
 * How: `fsp.copyFile`; destination directory must exist.
 */
export async function copyFileNonBlocking(src: string, dest: string): Promise<void> {
  await fsp.copyFile(src, dest);
}

/**
 * Returns metadata (size, mtime, isFile/isDirectory) synchronously.
 * How: `statSync` follows symlinks; use `lstatSync` if you need the link itself.
 */
export function statFileBlocking(filePath: string): fs.Stats {
  return fs.statSync(filePath);
}

/**
 * Returns file metadata asynchronously.
 * How: `fsp.stat`; pair with `path.join` for portable paths before calling.
 */
export async function statFileNonBlocking(filePath: string): Promise<fs.Stats> {
  return fsp.stat(filePath);
}

// --- Callback style (error-first): `(err, …?) => void` — Node’s original non-blocking fs API ---

/**
 * Reads a file as UTF-8 text via callback; `cb(err)` on failure, `cb(null, text)` on success.
 * How: Delegates to `fs.readFile` with encoding so the callback receives a string, not a Buffer.
 */
export function readTextFileCallback(filePath: string, cb: FsDataCallback<string>): void {
  fs.readFile(filePath, "utf8", cb);
}

/**
 * Writes text to a file via callback; `cb(err)` only (no result payload on success).
 * How: `fs.writeFile` schedules I/O and invokes the callback when done or on error.
 */
export function writeTextFileCallback(filePath: string, data: string, cb: FsVoidCallback): void {
  fs.writeFile(filePath, data, "utf8", cb);
}

/**
 * Appends text to a file via callback.
 * How: Same error-first pattern as `writeTextFileCallback`, using `fs.appendFile`.
 */
export function appendTextFileCallback(filePath: string, data: string, cb: FsVoidCallback): void {
  fs.appendFile(filePath, data, "utf8", cb);
}

/**
 * Checks existence via callback: `cb(null, true)` if accessible, `cb(null, false)` if missing,
 * or `cb(err)` for other errors (permissions, etc.).
 * How: `fs.access` with `F_OK`; treat `ENOENT` as “does not exist” instead of passing it as `err`.
 */
export function pathExistsCallback(filePath: string, cb: FsDataCallback<boolean>): void {
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (!err) {
      cb(null, true);
      return;
    }
    if (err.code === "ENOENT") {
      cb(null, false);
      return;
    }
    cb(err);
  });
}

/**
 * Creates a directory (recursive) via callback.
 * How: `fs.mkdir` with `{ recursive: true }`; callback receives an error if the operation fails.
 */
export function ensureDirCallback(dirPath: string, cb: FsVoidCallback): void {
  fs.mkdir(dirPath, { recursive: true }, cb);
}

/**
 * Lists directory entries via callback: `cb(null, names)` or `cb(err)`.
 * How: `fs.readdir` without `withFileTypes` returns string names in the callback’s second argument.
 */
export function listDirCallback(dirPath: string, cb: FsDataCallback<string[]>): void {
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      cb(err);
      return;
    }
    cb(null, files);
  });
}

/**
 * Deletes a file via callback.
 * How: `fs.unlink` follows the same error-first convention (e.g. `ENOENT` if the file is gone).
 */
export function removeFileCallback(filePath: string, cb: FsVoidCallback): void {
  fs.unlink(filePath, cb);
}

/**
 * Copies a file via callback.
 * How: `fs.copyFile` from Node’s callback API; destination’s parent directory must already exist.
 */
export function copyFileCallback(src: string, dest: string, cb: FsVoidCallback): void {
  fs.copyFile(src, dest, cb);
}

/**
 * Reads file metadata via callback: `cb(null, stats)` or `cb(err)`.
 * How: `fs.stat` is the callback equivalent of `statFileNonBlocking`.
 */
export function statFileCallback(filePath: string, cb: FsDataCallback<fs.Stats>): void {
  fs.stat(filePath, cb);
}

/**
 * Resolves a path under a known data directory (uses `path.join` for portability).
 * How: Centralizes where demo files live (`data/` next to cwd when running from project root).
 */
export function dataFilePath(...segments: string[]): string {
  return path.join(process.cwd(), "data", ...segments);
}
