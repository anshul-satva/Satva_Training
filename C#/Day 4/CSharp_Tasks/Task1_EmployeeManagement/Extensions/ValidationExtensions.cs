using System;
using System.Text.RegularExpressions;

namespace Task1_EmployeeManagement.Extensions
{
    public static class ValidationExtensions
    {
        /// <summary>
        /// Validates that the string is a properly formatted email address.
        /// </summary>
        public static bool IsValidEmail(this string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return false;

            // RFC 5322 simplified pattern
            string pattern = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";
            return Regex.IsMatch(email, pattern, RegexOptions.IgnoreCase);
        }

        /// <summary>
        /// Validates that the string is exactly 10 digits (no dashes, spaces, or country codes).
        /// </summary>
        public static bool IsValidPhoneNumber(this string phone)
        {
            if (string.IsNullOrWhiteSpace(phone))
                return false;

            return Regex.IsMatch(phone, @"^\d{10}$");
        }

        /// <summary>
        /// Validates salary is within the acceptable range [20000, 100000].
        /// </summary>
        public static bool IsValidSalary(this decimal salary)
        {
            return salary >= 20_000m && salary <= 1_00_000m;
        }

        /// <summary>
        /// Validates that a name field is non-empty and contains only letters/spaces/hyphens.
        /// </summary>
        public static bool IsValidName(this string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return false;

            return Regex.IsMatch(name, @"^[a-zA-Z\s\-']+$");
        }

        /// <summary>
        /// Validates that a password is at least 6 characters long.
        /// </summary>
        public static bool IsValidPassword(this string password)
        {
            return !string.IsNullOrWhiteSpace(password) && password.Length >= 6;
        }
    }
}
