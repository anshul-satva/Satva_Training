using System;

public static class ConsoleHelper
{
    public static string Ask(string label)
    {
        Console.Write(label + ": ");
        return Console.ReadLine()?.Trim() ?? "";
    }

    public static string AskPassword(string label)
    {
        Console.Write(label + ": ");
        return Console.ReadLine();
    }

    public static string AskUntilValid(
        string label,
        Func<string, bool> validate,
        string errorMessage,
        string hint = null)
    {
        bool firstTime = true;

        while (true)
        {
            if (hint != null && firstTime)
                Console.WriteLine("(" + hint + ")");

            Console.Write(label + ": ");
            string input = Console.ReadLine()?.Trim() ?? "";
            firstTime = false;

            if (validate(input))
                return input;

            if (!string.IsNullOrWhiteSpace(errorMessage))
                Console.WriteLine("Error: " + errorMessage);
        }
    }

    public static decimal AskDecimalUntilValid(
        string label,
        Func<decimal, bool> validate,
        string errorMessage,
        string hint = null)
    {
        bool firstTime = true;

        while (true)
        {
            if (hint != null && firstTime)
                Console.WriteLine("(" + hint + ")");

            Console.Write(label + ": ");
            string input = Console.ReadLine()?.Trim() ?? "";
            firstTime = false;

            if (decimal.TryParse(input, out decimal value) && validate(value))
                return value;

            Console.WriteLine("Error: " + errorMessage);
        }
    }

    public static string AskUpdateField(
        string label,
        string current,
        Func<string, bool> validate,
        string errorMessage)
    {
        while (true)
        {
            Console.Write(label + ": ");
            string input = Console.ReadLine()?.Trim() ?? "";

            if (input.Length == 0)
                return current;

            if (validate(input))
                return input;

            Console.WriteLine("Error: " + errorMessage);
        }
    }

    public static string AskUpdateFieldCustom(
        string label,
        string current,
        Func<string, bool> validate)
    {
        while (true)
        {
            Console.Write(label + ": ");
            string input = Console.ReadLine()?.Trim() ?? "";

            if (input.Length == 0)
                return current;

            if (validate(input))
                return input;
        }
    }

    public static decimal AskUpdateDecimal(
        string label,
        decimal current,
        Func<decimal, bool> validate,
        string errorMessage)
    {
        while (true)
        {
            Console.Write(label + ": ");
            string input = Console.ReadLine()?.Trim() ?? "";

            if (input.Length == 0)
                return current;

            if (decimal.TryParse(input, out decimal value) && validate(value))
                return value;

            Console.WriteLine("Error: " + errorMessage);
        }
    }

    public static void PrintEmployee(Employee e)
    {
        Console.WriteLine();
        Console.WriteLine("ID: " + e.Id);
        Console.WriteLine("Name: " + e.FullName);
        Console.WriteLine("Gender: " + e.Gender);
        Console.WriteLine("Email: " + e.Email);
        Console.WriteLine("Phone: " + e.Phone);
        Console.WriteLine("Designation: " + e.Designation);
        Console.WriteLine("Salary: Rs. " + e.Salary);
        Console.WriteLine("Created At: " + e.CreatedAt);
    }
}