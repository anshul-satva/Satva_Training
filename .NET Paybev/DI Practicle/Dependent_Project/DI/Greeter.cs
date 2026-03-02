using System;
using System.Collections.Generic;
using System.Text;

namespace Dependent_Project.DI
{
    public class Greeter : IGreeter
    {
        public string Greet(string name)
        {
            return $"Hello, {name}";
        }
    }
}
