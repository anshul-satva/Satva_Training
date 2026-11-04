using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;

namespace LogCleanupService
{
    class Program
    {
        private const int DefaultRetentionDays = 7;

        static void Main(string[] args)
        {
            Console.WriteLine("=======================================================");
            Console.WriteLine("           LOG CLEANUP SERVICE - Starting...           ");
            Console.WriteLine("=======================================================");
            Console.WriteLine();

            int retentionDays = GetRetentionDaysFromConfig();

            Console.WriteLine($"  Retention Policy : Last {retentionDays} day(s) will be KEPT.");
            Console.WriteLine($"  Files older than : {DateTime.Now.AddDays(-retentionDays):yyyy-MM-dd HH:mm:ss} will be DELETED.");
            Console.WriteLine();

            List<string> logPaths = GetConfiguredLogPaths();

            if (logPaths.Count > 0)
            {
                Console.WriteLine("-------------------------------------------------------");
                Console.WriteLine("  Processing Configured Log Paths...");
                Console.WriteLine("-------------------------------------------------------");

                foreach (string path in logPaths)
                {
                    CleanDirectory(path, retentionDays, isTemp: false);
                }
            }
            else
            {
                Console.WriteLine("  [INFO] No comma-separated LogPaths found in App.config. Skipping log folders.");
            }

            Console.WriteLine();
            Console.WriteLine("-------------------------------------------------------");
            Console.WriteLine("  Processing TEMP Directories (ALL files deleted)...");
            Console.WriteLine("-------------------------------------------------------");

            CleanTempDirectories();

            Console.WriteLine();
            Console.WriteLine("=======================================================");
            Console.WriteLine("         LOG CLEANUP SERVICE - Completed!              ");
            Console.WriteLine("=======================================================");
        }

        static int GetRetentionDaysFromConfig()
        {
            try
            {
                string configuredDays = ConfigurationManager.AppSettings["RetentionDays"];

                if (int.TryParse(configuredDays, out int days) && days >= 0)
                {
                    if (days == 0)
                    {
                        Console.WriteLine("  [INFO] RetentionDays is 0. ALL files will be deleted from configured log paths.");
                    }

                    return days;
                }

                Console.WriteLine($"  [WARN] Invalid or missing RetentionDays in App.config. Using default: {DefaultRetentionDays} days.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"  [WARN] Could not read RetentionDays from App.config: {ex.Message}");
                Console.WriteLine($"  [WARN] Using default: {DefaultRetentionDays} days.");
            }

            return DefaultRetentionDays;
        }

        static List<string> GetConfiguredLogPaths()
        {
            var paths = new List<string>();

            try
            {
                string configuredPaths = ConfigurationManager.AppSettings["LogPaths"];

                if (!string.IsNullOrWhiteSpace(configuredPaths))
                {
                    paths = configuredPaths
                        .Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries)
                        .Select(path => path.Trim())
                        .Where(path => !string.IsNullOrWhiteSpace(path))
                        .Distinct(StringComparer.OrdinalIgnoreCase)
                        .ToList();
                }

                Console.WriteLine($"  [INFO] Found {paths.Count} configured log path(s) in App.config.");
                foreach (string path in paths)
                {
                    Console.WriteLine($"         -> {path}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"  [WARN] Could not read LogPaths from App.config: {ex.Message}");
            }

            return paths;
        }

        static IEnumerable<string> SafeGetFiles(string root)
        {
            string[] files = new string[0];
            try { files = Directory.GetFiles(root); } catch { }
            foreach (string file in files) yield return file;

            string[] subDirs = new string[0];
            try { subDirs = Directory.GetDirectories(root); } catch { }
            foreach (string dir in subDirs)
            {
                foreach (string file in SafeGetFiles(dir))
                {
                    yield return file;
                }
            }
        }

        static void CleanDirectory(string directoryPath, int retentionDays, bool isTemp)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(directoryPath))
                {
                    Console.WriteLine("  [SKIP] Empty path provided. Skipping.");
                    return;
                }

                directoryPath = Environment.ExpandEnvironmentVariables(directoryPath);

                if (!Directory.Exists(directoryPath))
                {
                    Console.WriteLine($"  [SKIP] Directory not found: {directoryPath}");
                    return;
                }

                Console.WriteLine($"\n  Path: {directoryPath}");

                DateTime cutoff = isTemp
                    ? DateTime.MaxValue
                    : DateTime.Now.AddDays(-retentionDays);

                int deleted = 0;
                int skipped = 0;
                int errors = 0;

                foreach (string file in SafeGetFiles(directoryPath))
                {
                    try
                    {
                        FileInfo fileInfo = new FileInfo(file);
                        bool shouldDelete = isTemp || fileInfo.LastWriteTime < cutoff;

                        if (!shouldDelete)
                        {
                            skipped++;
                            continue;
                        }

                        try
                        {
                            if (fileInfo.IsReadOnly)
                            {
                                fileInfo.IsReadOnly = false;
                            }

                            fileInfo.Delete();
                            deleted++;
                        }
                        catch (IOException)
                        {
                            errors++;
                        }
                        catch (UnauthorizedAccessException)
                        {
                            errors++;
                        }
                        catch (Exception ex)
                        {
                            errors++;
                            Console.WriteLine($"    [SKIP] {Path.GetFileName(file)}: {ex.Message}");
                        }
                    }
                    catch
                    {
                        errors++;
                    }
                }

                DeleteEmptySubDirectories(directoryPath);

                Console.WriteLine($"    Deleted : {deleted} file(s)");
                if (!isTemp) Console.WriteLine($"    Kept    : {skipped} file(s) (within {retentionDays} day(s))");
                if (errors > 0) Console.WriteLine($"    Skipped : {errors} file(s) (locked / access denied)");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"  [ERROR] Unexpected error for path '{directoryPath}': {ex.Message}");
            }
        }

        static void DeleteEmptySubDirectories(string root)
        {
            var allDirs = new List<string>();
            SafeCollectDirectories(root, allDirs);

            foreach (string dir in allDirs.OrderByDescending(directory => directory.Length))
            {
                try
                {
                    if (Directory.Exists(dir) && !Directory.EnumerateFileSystemEntries(dir).Any())
                    {
                        Directory.Delete(dir, false);
                    }
                }
                catch
                {
                }
            }
        }

        static void SafeCollectDirectories(string root, List<string> result)
        {
            string[] subDirs = new string[0];
            try { subDirs = Directory.GetDirectories(root); } catch { return; }

            foreach (string dir in subDirs)
            {
                result.Add(dir);
                SafeCollectDirectories(dir, result);
            }
        }

        static void CleanTempDirectories()
        {
            string userTemp = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
            userTemp = Path.Combine(userTemp, "Temp");

            string systemTemp = Path.Combine(
                Environment.GetEnvironmentVariable("SystemRoot") ?? @"C:\Windows",
                "Temp");

            string tempPath = Path.GetTempPath();

            var tempDirs = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

            if (!string.IsNullOrWhiteSpace(userTemp)) tempDirs.Add(userTemp);
            if (!string.IsNullOrWhiteSpace(systemTemp)) tempDirs.Add(systemTemp);
            if (!string.IsNullOrWhiteSpace(tempPath)) tempDirs.Add(tempPath.TrimEnd('\\', '/'));

            foreach (string dir in tempDirs)
            {
                CleanDirectory(dir, retentionDays: 0, isTemp: true);
            }
        }
    }
}
