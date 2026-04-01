import os from "node:os";

/**
 * Returns the machine's preferred end-of-line sequence for text files.
 * How: `os.EOL` is `\r\n` on Windows and `\n` on POSIX systems.
 */
export function getEndOfLine(): string {
  return os.EOL;
}

/**
 * Returns the CPU architecture Node was compiled for (e.g. `x64`, `arm64`).
 * How: `os.arch()` mirrors `process.arch` in typical installs; useful for choosing native binaries.
 */
export function getCpuArchitecture(): string {
  return os.arch();
}

/**
 * Returns the operating system kernel name (e.g. `win32`, `linux`, `darwin`).
 * How: `os.platform()` is derived from libuv; not always the same as marketing names.
 */
export function getPlatform(): NodeJS.Platform {
  return os.platform();
}

/**
 * Returns the OS version string reported by the kernel.
 * How: On Windows this is a version line; use for logging or compatibility checks only.
 */
export function getOsVersion(): string {
  return os.version();
}

/**
 * Returns the hostname of the machine.
 * How: Resolved via the OS; may differ from DNS names users expect.
 */
export function getHostname(): string {
  return os.hostname();
}

/**
 * Returns total system memory in bytes.
 * How: `os.totalmem()` reads OS-reported RAM; divide by 1024**3 for GiB display.
 */
export function getTotalMemoryBytes(): number {
  return os.totalmem();
}

/**
 * Returns free system memory in bytes (approximate; changes constantly).
 * How: `os.freemem()` is a snapshot; not a guarantee for large allocations.
 */
export function getFreeMemoryBytes(): number {
  return os.freemem();
}

/**
 * Returns load averages (1, 5, 15 min) on Unix; on Windows often `[0, 0, 0]`.
 * How: `os.loadavg()` wraps `getloadavg` where available.
 */
export function getLoadAverages(): number[] {
  return os.loadavg();
}

/**
 * Returns network interface addresses (IPv4/IPv6) keyed by interface name.
 * How: `os.networkInterfaces()` skips internal `loopback` unless you filter; useful for binding servers.
 */
export function getNetworkInterfaces(): NodeJS.Dict<os.NetworkInterfaceInfo[]> {
  return os.networkInterfaces();
}

/**
 * Returns the path to the current user's home directory.
 * How: Uses `HOME` / `USERPROFILE` etc. via libuv; cross-platform home resolution.
 */
export function getUserHome(): string {
  return os.homedir();
}

/**
 * Returns the default directory for temp files.
 * How: `os.tmpdir()` respects `TMPDIR`, `TEMP`, `TMP` per platform conventions.
 */
export function getTempDirectory(): string {
  return os.tmpdir();
}

/**
 * Returns logical CPU count (threads available to the scheduler).
 * How: `os.cpus()` length; use for sizing worker pools (not physical cores only).
 */
export function getCpuCount(): number {
  return os.cpus().length;
}
