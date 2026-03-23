using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Text.Json;
using System.Text.Json.Serialization;
using EmployeeApp.Models;

namespace EmployeeApp.Helpers
{
    public static class FileHelper
    {
        private static readonly JsonSerializerOptions JsonOptions = new JsonSerializerOptions
        {
            WriteIndented = true,
            Converters = { new JsonStringEnumConverter() }
        };

        public static string GetFilePath()
        {
            try
            {
                string? basePath = ConfigurationManager.AppSettings["EmployeeDataPath"];

                if (string.IsNullOrWhiteSpace(basePath))
                    throw new Exception("'EmployeeDataPath' key is missing or empty in app.config.");

                if (!Directory.Exists(basePath))
                    Directory.CreateDirectory(basePath);

                string fileName = $"EmployeeData_{DateTime.Today:ddMMyyyy}.json";
                return Path.Combine(basePath, fileName);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error resolving file path from app.config: {ex.Message}");
            }
        }

        public static List<Employee> LoadEmployees()
        {
            try
            {
                string filePath = GetFilePath();

                if (!File.Exists(filePath))
                    return new List<Employee>();

                string json = File.ReadAllText(filePath);

                if (string.IsNullOrWhiteSpace(json))
                    return new List<Employee>();

                return JsonSerializer.Deserialize<List<Employee>>(json, JsonOptions)
                       ?? new List<Employee>();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error loading employee data: {ex.Message}");
            }
        }

        public static void SaveEmployees(List<Employee> employees)
        {
            try
            {
                string filePath = GetFilePath();
                string json = JsonSerializer.Serialize(employees, JsonOptions);
                File.WriteAllText(filePath, json);

                Console.ForegroundColor = ConsoleColor.DarkGray;
                Console.WriteLine($"  [Saved to: {filePath}]");
                Console.ResetColor();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error saving employee data: {ex.Message}");
            }
        }
    }
}