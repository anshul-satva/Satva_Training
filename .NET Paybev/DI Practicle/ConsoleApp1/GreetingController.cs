using System;
using System.Collections.Generic;
using System.Text;
using Dependent_Project;
using Dependent_Project.DI;

namespace ConsoleApp1
{
    public class GreetingController
    {
        private readonly IGreeter _greeter;

        public GreetingController(IGreeter greeter)
        {
            _greeter = greeter;
        }

        public void Print_Name(string name)
        {
            string result = _greeter.Greet(name);
            Console.WriteLine(result);
        }
    }
}
