using System;

namespace Dependent_Project.DI
{
    public class GreetingPrinter
    {
        private readonly IGreeter _greeter;

        public GreetingPrinter(IGreeter greeter)
        {
            _greeter = greeter;
        }

        public void Print(string name)
        {
            string result = _greeter.Greet(name);
            Console.WriteLine(result);
        }
}
}