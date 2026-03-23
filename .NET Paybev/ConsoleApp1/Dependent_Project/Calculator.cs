using System;

namespace Dependent_Project
{
    public class Calculator
    {
        public Calculator()
        {
            Console.WriteLine("Calculator instance created.");
        }
        public long Add(long x, long y)
        {
            return x + y;
        }

        public long Subtract(long a, long b)
        {
            return a - b;
        }

        public long Multiply(long a, long b)
        {
            return a * b;
        }

        public double Divide(long a, long b)
        {
            if (b == 0)
                throw new DivideByZeroException("Division by zero is not allowed.");

            return (double)a / b;
        }
    }
}