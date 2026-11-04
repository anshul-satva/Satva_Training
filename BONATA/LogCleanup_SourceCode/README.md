# LogCleanupService - Setup & Usage Guide

A .NET 4.5 console application that cleans old log files from configured paths and also cleans Temp directories every time it runs.

The app is designed for Windows Task Scheduler. It does not ask for user input and automatically exits after cleanup is complete.

## Configure

Open `LogCleanupService\App.config`.

Set how many days of log files should remain:

```xml
<add key="RetentionDays" value="7" />
```

Set log folders using only one comma-separated config value:

```xml
<add key="LogPaths" value="C:\Logs\App1, C:\Logs\App2, D:\ServerLogs" />
```

Environment variables are supported:

```xml
<add key="LogPaths" value="%APPDATA%\MyApp\Logs, %ProgramData%\MyService\Logs" />
```

## Behavior

- Files older than `RetentionDays` are deleted from the configured `LogPaths`.
- Files inside the retention period are kept.
- `%TEMP%`, the current user's local Temp folder, and `C:\Windows\Temp` are always cleaned.
- Locked files, access-denied files, missing folders, and invalid paths are skipped without stopping the application.
- The application automatically closes when cleanup finishes.

## Build & Run

Open `LogCleanupService.sln` in Visual Studio, build Release, then run:

```powershell
LogCleanupService\bin\Release\LogCleanupService.exe
```

## Task Scheduler

1. Open Task Scheduler.
2. Create Basic Task.
3. Choose your schedule.
4. Action: Start a Program.
5. Select `LogCleanupService.exe`.
6. Enable "Run whether user is logged on or not".
7. Enable "Run with highest privileges" if cleanup requires admin access.

No arguments, prompt input, or manual typing is required.
