using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Dependent_Project.Models;

namespace Dependent_Project.Services
{
    public class CalculatorService : ICalculatorService
    {
     
        public CalculatorService() { }

        public void Run()
        {
            while (true)
            {
                try
                {
                    RunApplication();
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Unexpected Error: {ex.Message}");
                }

                while (true)
                {
                    Console.Write("\nDo you want to continue? (y/n): ");
                    string choice = Console.ReadLine()?.Trim().ToLower();

                    if (choice == "y")
                    {
                        Console.WriteLine();
                        break;
                    }
                    else if (choice == "n")
                    {
                        Console.WriteLine("Terminated");
                        return;
                    }
                    else
                    {
                        Console.WriteLine("Invalid input. Please enter 'y' to continue or 'n' to exit.");
                    }
                }
            }
        }

        private void RunApplication()
        {
            UserInputModel model = new UserInputModel();

            while (true)
            {
                try
                {
                    Console.Write("Enter your first name: ");
                    string nameInput = Console.ReadLine();
                    model.Name = nameInput;
                    ValidateProperty(model, nameInput, nameof(model.Name));

                    Console.Write("Enter Number 1 (1-10): ");
                    string num1Input = Console.ReadLine();

                    if (!int.TryParse(num1Input, out int num1))
                        throw new FormatException("Num1 must be a whole number.");

                    model.Num1 = num1;
                    ValidateProperty(model, num1, nameof(model.Num1));

                    Console.Write("Enter Number 2, max 10 digits: ");
                    string num2Input = Console.ReadLine();

                    if (!long.TryParse(num2Input, out long num2))
                        throw new FormatException("Num2 must be a whole number and max of 10 digits allowed.");

                    model.Num2 = num2;
                    ValidateProperty(model, num2, nameof(model.Num2));

                    break;
                }
                catch (ValidationException vex)
                {
                    Console.WriteLine($"Validation Error: {vex.Message}");
                    Console.WriteLine("Please re-enter all values.\n");
                }
                catch (FormatException fex)
                {
                    Console.WriteLine($"Format Error: {fex.Message}");
                    Console.WriteLine("Please re-enter all values.\n");
                }
            }

            while (true)
            {
                Console.WriteLine("\nSelect an operation:");
                Console.WriteLine("  1. Addition");
                Console.WriteLine("  2. Subtraction");
                Console.WriteLine("  3. Multiplication");
                Console.WriteLine("  4. Division");
                Console.Write("Enter choice (1-4): ");

                string opInput = Console.ReadLine();

                try
                {
                    if (!int.TryParse(opInput, out int opChoice))
                        throw new FormatException("Please enter a number between 1 and 4.");

                    Calculator calc = new Calculator();

                    switch (opChoice)
                    {
                        case 1:
                            Console.WriteLine($"\nResult (Addition):       {model.Num1} + {model.Num2} = {calc.Add(model.Num1, model.Num2)}");
                            break;
                        case 2:
                            Console.WriteLine($"\nResult (Subtraction):    {model.Num1} - {model.Num2} = {calc.Subtract(model.Num1, model.Num2)}");
                            break;
                        case 3:
                            Console.WriteLine($"\nResult (Multiplication): {model.Num1} x {model.Num2} = {calc.Multiply(model.Num1, model.Num2)}");
                            break;
                        case 4:
                            Console.WriteLine($"\nResult (Division):       {model.Num1} / {model.Num2} = {calc.Divide(model.Num1, model.Num2)}");
                            break;
                        default:
                            throw new ArgumentOutOfRangeException("choice", "Invalid choice. Please enter 1, 2, 3, or 4.");
                    }

                    break;
                }
                catch (FormatException fex)
                {
                    Console.WriteLine($"Input Error: {fex.Message}");
                }
                catch (ArgumentOutOfRangeException aex)
                {
                    Console.WriteLine($"Selection Error: {aex.ParamName} — {aex.Message.Split('\n')[0]}");
                }
                catch (DivideByZeroException)
                {
                    Console.WriteLine("Division Error: Cannot divide by zero.");
                    break;
                }
                catch (OverflowException)
                {
                    Console.WriteLine("Overflow Error: The result is too large to display.");
                    break;
                }
            }
        }

        private void ValidateProperty(object model, object value, string propertyName)
        {
            var context = new ValidationContext(model) { MemberName = propertyName };
            var results = new List<ValidationResult>();
            bool isValid = Validator.TryValidateProperty(value, context, results);

            if (!isValid)
                throw new ValidationException(results[0].ErrorMessage);
        }
    }
}