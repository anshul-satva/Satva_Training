using System;

namespace Task2_BankingSystem.Helpers
{
    public static class AccountNumberGenerator
    {
        private static readonly Random _rng = new Random();

        public static string Generate()
        {
            string datePart   = DateTime.Now.ToString("yyyyMMdd");
            string randomPart = _rng.Next(100_000, 999_999).ToString();
            return $"ACCT-{datePart}-{randomPart}";
        }
    }
}
