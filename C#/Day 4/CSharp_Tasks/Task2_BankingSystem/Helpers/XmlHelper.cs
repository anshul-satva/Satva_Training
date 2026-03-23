using System;
using System.IO;
using System.Xml.Serialization;

namespace Task2_BankingSystem.Helpers
{
    public static class XmlHelper
    {
        public static void SerializeToXml<T>(T data, string filePath)
        {
            try
            {
                string? dir = Path.GetDirectoryName(filePath);
                if (!string.IsNullOrEmpty(dir) && !Directory.Exists(dir))
                    Directory.CreateDirectory(dir);

                var serializer = new XmlSerializer(typeof(T));
                using var writer = new StreamWriter(filePath);
                serializer.Serialize(writer, data);
            }
            catch (IOException ex)
            {
                throw new IOException($"Failed to write XML file '{filePath}': {ex.Message}", ex);
            }
            catch (UnauthorizedAccessException ex)
            {
                throw new UnauthorizedAccessException($"Access denied to '{filePath}': {ex.Message}", ex);
            }
        }

        public static T DeserializeFromXml<T>(string filePath) where T : new()
        {
            if (!File.Exists(filePath))
                return new T();

            try
            {
                var serializer = new XmlSerializer(typeof(T));
                using var reader = new StreamReader(filePath);
                return (T)(serializer.Deserialize(reader) ?? new T());
            }
            catch (FileNotFoundException)
            {
                throw new FileNotFoundException($"Account data file not found: '{filePath}'.");
            }
            catch (InvalidOperationException ex)
            {
                throw new InvalidOperationException($"Failed to parse XML from '{filePath}': {ex.Message}", ex);
            }
        }
    }
}
