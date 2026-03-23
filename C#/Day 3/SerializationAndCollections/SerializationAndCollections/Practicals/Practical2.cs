using System;
using System.Collections.Generic;
using System.Text;

namespace SerializationAndCollections.Practicals
{
    public class Practical2
    {
        public static void Run()
        {

            List<int> numbers = new List<int> { 21, 32, 43, 84, 55 };
            
            Console.WriteLine("Original Numbers:");
            Console.WriteLine(string.Join(", ", numbers));
            Console.WriteLine();

            List<int> result = numbers
                                .Select(n => (n + 2) * 5)
                                .ToList();

            Console.WriteLine("\nTransformed Numbers:");
            Console.WriteLine(string.Join(", ", result));
            Console.WriteLine();

            List<int> pages = new List<int>
            {
                1,2,4,6,7,8,9,10,12,17,19,20,21,24,25,30
            };

            Console.WriteLine("\nList of Numbers:");
            Console.WriteLine(string.Join(", ", pages));
            Console.WriteLine();


            Console.WriteLine("\n(2) Ranges:");
            PrintRanges(pages);
            Console.WriteLine("\n");
        }
        public static void PrintRanges(List<int> numbers)
        {
            numbers.Sort();
            List<string> ranges = new List<string>();
            int start = numbers[0];
            int end = numbers[0];
            for (int i = 1; i < numbers.Count; i++)
            {
                if (numbers[i] == end + 1)
                {
                    end = numbers[i];
                }
                else
                {
                    ranges.Add(start == end ? $"{start}" : $"{start}-{end}");
                    start = end = numbers[i];
                }
            }
            ranges.Add(start == end ? $"{start}" : $"{start}-{end}");

            Console.WriteLine(string.Join(", ", ranges));

        }

        
    }
}
