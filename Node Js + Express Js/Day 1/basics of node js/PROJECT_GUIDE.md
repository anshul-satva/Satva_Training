# Node.js Basics (TypeScript)

This project is a beginner-friendly Node.js app in TypeScript that demonstrates:

- HTTP server and basic API structure
- File System (`fs`) operations:
  - Blocking (sync)
  - Non-blocking (Promise/async)
  - Callback style (error-first callbacks)
- URL module usage
- Nodemailer integration
- OS module usage
- Path module usage

## 1) Project Structure

- `src/index.ts`  
  App entry point. Starts server and runs startup demos.

- `src/httpServer.ts`  
  Native Node `http` server with route handling.

- `src/fsOperations.ts`  
  File system helpers in 3 styles: sync, async/await, callback.

- `src/urlUtils.ts`  
  URL parsing/building and file URL conversion helpers.

- `src/mailer.ts`  
  Nodemailer transporter + send functions.

- `src/osInfo.ts`  
  OS-level information helpers.

- `src/pathUtils.ts`  
  Path utility helpers.

## 2) Install and Run

```bash
npm install
npm run dev
```

or production build:

```bash
npm run build
npm start
```

Default API URL: `http://localhost:3000`

You can change port:

### PowerShell
```powershell
$env:PORT=4000
npm run dev
```

### Bash
```bash
PORT=4000 npm run dev
```

## 3) API Endpoints and How to Hit Them

### A) Health

- Method: `GET`
- URL: `/` or `/health`
- Purpose: service health and uptime

#### PowerShell
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/health" -Method Get
```

#### curl
```bash
curl http://localhost:3000/health
```

---

### B) OS Info

- Method: `GET`
- URL: `/api/os`
- Purpose: returns platform, arch, memory, hostname, etc.

#### PowerShell
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/os" -Method Get
```

#### curl
```bash
curl http://localhost:3000/api/os
```

---

### C) Path Demo

- Method: `GET`
- URL: `/api/path?join=foo&join=bar`
- Purpose: demonstrates `path.join` and path checks

#### PowerShell
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/path?join=foo&join=bar" -Method Get
```

#### curl
```bash
curl "http://localhost:3000/api/path?join=foo&join=bar"
```

---

### D) File System Demo (non-blocking)

- Method: `GET`
- URL: `/api/fs-demo`
- Purpose: creates `data/demo-output.txt`, writes and reads asynchronously

#### PowerShell
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/fs-demo" -Method Get
```

#### curl
```bash
curl http://localhost:3000/api/fs-demo
```

---

### E) Mail API

- Method: `POST`
- URL: `/api/mail`
- Body: JSON `{ "to", "subject", "text", "html?" }`
- Purpose: sends email via Nodemailer (or logs if SMTP not configured)

#### PowerShell
```powershell
$body = @{
  to = "test@example.com"
  subject = "Hello from API"
  text = "This is a plain text test email"
  html = "<b>This is HTML email body</b>"
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "http://localhost:3000/api/mail" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

#### curl
```bash
curl -X POST http://localhost:3000/api/mail \
  -H "Content-Type: application/json" \
  -d '{"to":"test@example.com","subject":"Hello from API","text":"Plain text","html":"<b>HTML body</b>"}'
```

## 4) SMTP Setup for Nodemailer

If SMTP is not configured, app uses log-only mode for mail route.

Create `.env` (or set environment variables) from `.env.example`:

```env
SMTP_URL=smtps://user:pass@smtp.example.com:465
# OR host-based config:
# SMTP_HOST=smtp.example.com
# SMTP_PORT=587
# SMTP_SECURE=false
# SMTP_USER=your-user
# SMTP_PASS=your-password
MAIL_FROM="Demo <you@example.com>"
PORT=3000
```

PowerShell quick set:

```powershell
$env:SMTP_HOST="smtp.example.com"
$env:SMTP_PORT="587"
$env:SMTP_USER="user"
$env:SMTP_PASS="pass"
$env:MAIL_FROM="Demo <you@example.com>"
```

## 5) File System Operations Included (`src/fsOperations.ts`)

### Blocking (Sync)
- `readTextFileBlocking`
- `writeTextFileBlocking`
- `appendTextFileBlocking`
- `pathExistsBlocking`
- `ensureDirBlocking`
- `listDirBlocking`
- `removeFileBlocking`
- `copyFileBlocking`
- `statFileBlocking`

### Non-blocking (Promise / async)
- `readTextFileNonBlocking`
- `writeTextFileNonBlocking`
- `appendTextFileNonBlocking`
- `pathExistsNonBlocking`
- `ensureDirNonBlocking`
- `listDirNonBlocking`
- `removeFileNonBlocking`
- `copyFileNonBlocking`
- `statFileNonBlocking`

### Callback style (Error-first)
- `readTextFileCallback`
- `writeTextFileCallback`
- `appendTextFileCallback`
- `pathExistsCallback`
- `ensureDirCallback`
- `listDirCallback`
- `removeFileCallback`
- `copyFileCallback`
- `statFileCallback`

Callback signature patterns used:

- `FsVoidCallback = (err) => void`
- `FsDataCallback<T> = (err, data?) => void`

## 6) URL / OS / Path Examples

### URL (`src/urlUtils.ts`)
- Parse URL: `parseUrlString`
- Resolve relative against base: `resolveAgainstBase`
- Read/set query param: `getQueryParam`, `setQueryParam`
- Convert file path <-> file URL: `filePathToUrl`, `urlToFilePath`
- Legacy parse/format: `parseUrlLegacy`, `formatUrlObject`

### OS (`src/osInfo.ts`)
- Platform/arch/version/hostname
- Memory info
- CPU count
- Home/tmp directory
- Network interfaces

### Path (`src/pathUtils.ts`)
- `join`, `resolve`, `dirname`, `basename`, `extname`
- `normalize`, `relative`, `isAbsolute`, `parse`

## 7) Basic API Design Used Here

This app demonstrates a simple API pattern:

1. Parse request URL
2. Route by method + pathname
3. Validate input (for POST body)
4. Execute service/helper function
5. Return JSON response with status code
6. Catch errors and return `500`

Helper used: `sendJson(res, statusCode, body)`.

## 8) Quick Testing Flow

1. Start app: `npm run dev`
2. Test `/health`
3. Test `/api/os`
4. Test `/api/path`
5. Test `/api/fs-demo` and verify files under `data/`
6. Test `/api/mail`:
   - without SMTP: should log/skip
   - with SMTP: should send and return `messageId`

---

If you want, I can also add a `POSTMAN_COLLECTION.json` file so you can import all APIs in Postman with one click.
