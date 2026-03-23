using System;
using EmployeeApp.Services;
using EmployeeApp.UI;

namespace EmployeeApp
{
    class Program
    {
        static void Main(string[] args)
        {
            try
            {
                IEmployeeService service = new EmployeeService();
                var ui = new ConsoleUI(service);
                ui.Run();
            }
            catch (Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine($"\nFatal Error: {ex.Message}");
                Console.ResetColor();
                Console.WriteLine("\nPress any key to exit...");
                Console.ReadKey();
            }
        }
    }
}