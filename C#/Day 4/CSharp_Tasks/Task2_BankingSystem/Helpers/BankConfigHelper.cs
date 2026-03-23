using System;
using System.Configuration;

namespace Task2_BankingSystem.Helpers
{
    public static class BankConfigHelper
    {
        public static decimal InterestRatePercent =>
            ParseDecimal("MonthlyInterestRatePercent");

        public static string AccountFilePath =>
            GetRequired("AccountFilePath");

        public static decimal MinOpeningBalance =>
            ParseDecimal("MinOpeningBalance");

        private static string GetRequired(string key)
        {
            string? value = ConfigurationManager.AppSettings[key];
            if (string.IsNullOrWhiteSpace(value))
                throw new ConfigurationErrorsException(
                    $"Configuration key '{key}' is missing or empty in app.config.");
            return value;
        }

        private static decimal ParseDecimal(string key)
        {
            string raw = GetRequired(key);
            if (!decimal.TryParse(raw, out decimal result))
                throw new ConfigurationErrorsException(
                    $"Configuration key '{key}' has an invalid decimal value: '{raw}'.");
            return result;
        }
    }
}