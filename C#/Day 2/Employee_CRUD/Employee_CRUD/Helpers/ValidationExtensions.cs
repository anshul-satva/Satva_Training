using System;
using System.Text.RegularExpressions;

public static class ValidationExtensions
{
    public enum Designation { Developer, QA, BA, HR }
    public enum Gender { Male, Female, Other }
    public static bool IsNotEmpty(this string value)
        => !string.IsNullOrWhiteSpace(value);

    public static bool IsValidEmail(this string email)
    {
        if (!email.IsNotEmpty()) return false;
        return Regex.IsMatch(email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$", RegexOptions.IgnoreCase);
    }

    public static bool IsValidPhone(this string phone)
    {
        if (!phone.IsNotEmpty()) return false;
        return phone.Length <= 10 && Regex.IsMatch(phone, @"^[0-9+\-() ]+$");
    }

    public static bool IsValidSalary(this decimal salary)
        => salary >= 10000 && salary <= 50000;

    public static bool IsValidDesignation(this string value)
        => Enum.TryParse<Designation>(value, ignoreCase: true, out _);

    public static bool IsValidGender(this string value)
        => Enum.TryParse<Gender>(value, ignoreCase: true, out _);
}