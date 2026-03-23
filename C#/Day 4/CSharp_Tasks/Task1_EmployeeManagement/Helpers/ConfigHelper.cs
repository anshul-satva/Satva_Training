using System;
using System.Configuration;

namespace Task1_EmployeeManagement.Helpers
{
    public static class ConfigHelper
    {
        public static string EncryptionKey =>
            GetRequired("EncryptionKey");

        public static string EmployeeFilePath =>
            GetRequired("EmployeeFilePath");

        private static string GetRequired(string key)
        {
            string? value = ConfigurationManager.AppSettings[key];
            if (string.IsNullOrWhiteSpace(value))
                throw new ConfigurationErrorsException(
                    $"Configuration key '{key}' is missing or empty in app.config.");
            return value;
        }
    }
}
