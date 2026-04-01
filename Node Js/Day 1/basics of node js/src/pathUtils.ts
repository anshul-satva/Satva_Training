import path from "node:path";

/**
 * Joins path segments using the platform-specific separator.
 * How: `path.join` normalizes `..` and `.`, avoids manual slash mistakes on Windows vs POSIX.
 */
export function joinPath(...segments: string[]): string {
  return path.join(...segments);
}

/**
 * Resolves a sequence of paths into an absolute path (like `cd` in the shell).
 * How: Walks from right to left until an absolute segment is found; useful for resolving `../` against a base.
 */
export function resolveAbsolute(...paths: string[]): string {
  return path.resolve(...paths);
}

/**
 * Returns the directory name of a file path (everything before the last separator).
 * How: Pure string logic per OS rules; does not touch the filesystem.
 */
export function getDirname(filePath: string): string {
  return path.dirname(filePath);
}

/**
 * Returns the final segment of a path (file or folder name), optionally stripping an extension.
 * How: `path.basename` with optional `ext` removes a known suffix such as `.ts`.
 */
export function getBasename(filePath: string, ext?: string): string {
  return ext !== undefined ? path.basename(filePath, ext) : path.basename(filePath);
}

/**
 * Returns the extension including the dot (e.g. `.json`), or empty string if none.
 * How: `path.extname` only looks at the last portion of the path string.
 */
export function getExtension(filePath: string): string {
  return path.extname(filePath);
}

/**
 * Converts between Windows-style (`\`) and POSIX-style (`/`) paths where applicable.
 * How: `path.toNamespacedPath` on Windows adds `\\?\` for long paths; `path.normalize` cleans redundant separators.
 */
export function normalizePath(p: string): string {
  return path.normalize(p);
}

/**
 * Builds a path relative from `from` to `to` (minimal `../` chain).
 * How: Compares resolved absolute paths and emits relative segments; fails if on different drives on Windows.
 */
export function relativeBetween(from: string, to: string): string {
  return path.relative(from, to);
}

/**
 * Returns whether a path is absolute on the current platform.
 * How: On Windows, checks for drive letter or UNC; on POSIX, leading `/`.
 */
export function isAbsolutePath(p: string): boolean {
  return path.isAbsolute(p);
}

/**
 * Parses a path into root, dir, base, ext, and name (Node's structured breakdown).
 * How: Use when you need several parts at once without repeated `basename`/`dirname` calls.
 */
export function parsePathSegments(filePath: string): path.ParsedPath {
  return path.parse(filePath);
}
