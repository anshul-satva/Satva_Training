/**
 * Application entry: starts the sample HTTP API and runs a tiny console demo of fs/url/path.
 * How: `startServer` registers routes; the demo block illustrates blocking vs non-blocking fs side by side.
 */
import { startServer } from "./httpServer";
import * as fsOps from "./fsOperations";
import * as urlUtils from "./urlUtils";
import * as pathUtils from "./pathUtils";

async function runStartupDemo(): Promise<void> {
  const demoDir = fsOps.dataFilePath();
  fsOps.ensureDirBlocking(demoDir);

  const sampleUrl = urlUtils.parseUrlString("https://example.com/api?v=1&tag=node");
  urlUtils.setQueryParam(sampleUrl, "tag", "typescript");
  console.log("[demo] URL with updated query:", sampleUrl.toString());

  const rel = pathUtils.relativeBetween(process.cwd(), fsOps.dataFilePath("demo-output.txt"));
  console.log("[demo] Relative path to data file:", rel);

  const blockingPath = fsOps.dataFilePath("blocking-demo.txt");
  fsOps.writeTextFileBlocking(blockingPath, "blocking write\n");
  console.log("[demo] Blocking read:", fsOps.readTextFileBlocking(blockingPath).trim());

  const asyncPath = fsOps.dataFilePath("async-demo.txt");
  await fsOps.writeTextFileNonBlocking(asyncPath, "non-blocking write\n");
  console.log("[demo] Non-blocking read:", (await fsOps.readTextFileNonBlocking(asyncPath)).trim());

  const callbackPath = fsOps.dataFilePath("callback-demo.txt");
  await new Promise<void>((resolve, reject) => {
    fsOps.ensureDirCallback(demoDir, (mkdirErr) => {
      if (mkdirErr) {
        reject(mkdirErr);
        return;
      }
      fsOps.writeTextFileCallback(callbackPath, "callback-style write\n", (writeErr) => {
        if (writeErr) {
          reject(writeErr);
          return;
        }
        fsOps.readTextFileCallback(callbackPath, (readErr, text) => {
          if (readErr) {
            reject(readErr);
            return;
          }
          console.log("[demo] Callback read (error-first at each step):", text?.trim());
          resolve();
        });
      });
    });
  });
}

startServer();
runStartupDemo().catch((err) => {
  console.error("Startup demo failed:", err);
});
