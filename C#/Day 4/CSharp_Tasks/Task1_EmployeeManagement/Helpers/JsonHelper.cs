using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;

namespace Task1_EmployeeManagement.Helpers
{
    public static class JsonHelper
    {
        private static readonly JsonSerializerOptions _options = new JsonSerializerOptions
        {
            WriteIndented = true,
            PropertyNameCaseInsensitive = true
        };

        /// <summary>
        /// Generic method: serializes <typeparamref name="T"/> to a JSON file.
        /// </summary>
        public static void SerializeToJson<T>(T data, string filePath)
        {
            try
            {
                string json = JsonSerializer.Serialize(data, _options);
                string? dir = Path.GetDirectoryName(filePath);
                if (!string.IsNullOrEmpty(dir) && !Directory.Exists(dir))
                    Directory.CreateDirectory(dir);

                File.WriteAllText(filePath, json);
            }
            catch (IOException ex)
            {
                throw new IOException($"Failed to write file '{filePath}': {ex.Message}", ex);
            }
            catch (UnauthorizedAccessException ex)
            {
                throw new UnauthorizedAccessException($"Access denied to file '{filePath}': {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Generic method: deserializes a JSON file into <typeparamref name="T"/>.
        /// Returns the type's default if the file does not exist.
        /// </summary>
        public static T DeserializeFromJson<T>(string filePath) where T : new()
        {
            try
            {
                if (!File.Exists(filePath))
                    return new T();

                string json = File.ReadAllText(filePath);
                return JsonSerializer.Deserialize<T>(json, _options) ?? new T();
            }
            catch (JsonException ex)
            {
                throw new JsonException($"Failed to parse JSON from '{filePath}': {ex.Message}", ex);
            }
            catch (IOException ex)
            {
                throw new IOException($"Failed to read file '{filePath}': {ex.Message}", ex);
            }
        }
    }
}
