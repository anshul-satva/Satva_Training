using System;
using System.Text.RegularExpressions;
using System.Xml.Linq;

namespace EmployeeApp.Helpers
{
    public static class ValidationHelper
    {
        public static bool IsValidEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email)) return false;
            return Regex.IsMatch(email,
                @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", RegexOptions.IgnoreCase);
        }

        public static bool IsValidPhone(string phone)
        {
            if (string.IsNullOrWhiteSpace(phone)) return false;
            return Regex.IsMatch(phone, @"^\d{10}$");
        }

        public static bool IsValidLetter(string letter)
        {
            if (string.IsNullOrWhiteSpace(letter)) return false;
            return Regex.IsMatch(letter, @"^[A-Za-z\s'-]{2,}$");
        }

        public static bool IsValidPostcode(string postcode)
        {
            if (string.IsNullOrWhiteSpace(postcode)) return false;
            return Regex.IsMatch(postcode, @"^\d{6}$");
        }

        public static bool IsValidGender(string gender)
        {
            return gender == "M" || gender == "F";
        }

        public static bool IsAdult(DateTime dob)
        {
            int age = DateTime.Today.Year - dob.Year;
            if (dob.Date > DateTime.Today.AddYears(-age)) age--;
            return age >= 18;
        }

        public static bool IsNotFutureDate(DateTime date)
        {
            return date.Date <= DateTime.Today;
        }

        public static bool IsPositiveDecimal(decimal value)
        {
            return value > 0;
        }
    }
}