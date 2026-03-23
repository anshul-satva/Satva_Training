using System;
using Microsoft.Extensions.DependencyInjection;
using Dependent_Project.DI;

namespace ConsoleApp1
{
    class Program
    {
        static void Main(string[] args)
        {
            var services = new ServiceCollection();
            services.AddTransient<IGreeter, Greeter>();
            services.AddTransient<GreetingController>();
            var serviceProvider = services.BuildServiceProvider();

            var printer = serviceProvider.GetRequiredService<GreetingController>();
            printer.Print_Name("Anshul");

            var calculator = new CalculatorApp();
            calculator.Run();
        }
    }
}