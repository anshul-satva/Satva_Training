import {
  URL,
  pathToFileURL,
  fileURLToPath,
  parse as legacyParse,
  format as legacyFormat,
  type UrlObject,
} from "node:url";

/**
 * Parses a full URL string into a `URL` object (scheme, host, pathname, searchParams, etc.).
 * How: The WHATWG `URL` constructor throws on invalid input; use for HTTP(S) and `file:` URLs.
 */
export function parseUrlString(href: string): URL {
  return new URL(href);
}

/**
 * Builds a URL from a base and a relative reference (RFC 3986 resolution).
 * How: `new URL(relative, base)` resolves like a browser; base must be absolute if relative is not.
 */
export function resolveAgainstBase(base: string, relative: string): URL {
  return new URL(relative, base);
}

/**
 * Reads and decodes query parameters from a URL's `search` component.
 * How: `url.searchParams` is a `URLSearchParams` instance; `get` returns first value or null.
 */
export function getQueryParam(url: URL, name: string): string | null {
  return url.searchParams.get(name);
}

/**
 * Sets or replaces a query parameter on a URL instance (mutates the object).
 * How: Updates `search` string; call `toString()` when serializing back to a string.
 */
export function setQueryParam(url: URL, name: string, value: string): void {
  url.searchParams.set(name, value);
}

/**
 * Converts a filesystem path to a `file://` URL (required for `fetch` of local files in some setups).
 * How: `pathToFileURL` adds correct slashes and encoding on Windows vs POSIX.
 */
export function filePathToUrl(absolutePath: string): URL {
  return pathToFileURL(absolutePath);
}

/**
 * Converts a `file://` URL back to a filesystem path string.
 * How: `fileURLToPath` decodes percent-encoding; throws if the URL is not a file URL.
 */
export function urlToFilePath(fileUrl: URL | string): string {
  const u = typeof fileUrl === "string" ? new URL(fileUrl) : fileUrl;
  return fileURLToPath(u);
}

/**
 * Legacy-style URL parsing into an object (deprecated for new code but still used in older APIs).
 * How: `url.parse` is lenient; pass `true` as second arg to also parse `query` into an object.
 */
export function parseUrlLegacy(urlString: string): UrlObject {
  return legacyParse(urlString, true) as UrlObject;
}

/**
 * Formats a `UrlObject` back into a URL string (pair of `parse` in legacy style).
 * How: Omits undefined parts; order follows Node's formatter rules.
 */
export function formatUrlObject(obj: UrlObject): string {
  return legacyFormat(obj);
}
