using System;
using System.Collections.Generic;
using System.Text;
using System.IO;
using System.Linq;

namespace File_Operations
{
    internal class Program
    {
        static string path = @"C:\Users\Admin\Desktop\Training\C#\Day 2\File_Operations";
        public static void Main(string[] args)
        {
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
                Console.WriteLine("Folder created: " + path);
            }

            Console.Write("Enter a file name (e.g. practice.txt): ");
            string fileName = Console.ReadLine()?.Trim();

            path = Path.Combine(path, fileName);
            Console.WriteLine("File will be saved at: " + path);

            bool exist = false;
            while (!exist)
            {
                Console.WriteLine("\nC# File I/O Tasks");
                Console.WriteLine("1. Create a file and add text");
                Console.WriteLine("2. Read the file back");
                Console.WriteLine("3. Write array of strings to file");
                Console.WriteLine("4. Append text to existing file");
                Console.WriteLine("5. Read first line from file");
                Console.WriteLine("6. Count lines in a file");
                Console.WriteLine("0. Exit");
                Console.Write("Choose a task: ");

                switch (Console.ReadLine()?.Trim())
                {
                    case "1": Q1_CreateFileAndAddText(); break;
                    case "2": Q2_CreateFileAndReadBack(); break;
                    case "3": Q3_WriteArrayToFile(); break;
                    case "4": Q4_AppendTextToFile(); break;
                    case "5": Q5_ReadFirstLine(); break;
                    case "6": Q6_CountLines(); break;
                    case "0": exist = true; break;
                    default: Console.WriteLine("Invalid option."); break;
                }
                if (!exist)
                {
                    Console.Write("\nPress any key to go back to menu : ");
                    Console.ReadKey();
                }
            }
        }
        static void Q1_CreateFileAndAddText()
        {
            Console.WriteLine("\nQ1: Create a file and add text \n");

            Console.Write("Enter Text to add to file: ");
            string text = Console.ReadLine();
            File.WriteAllText(path, text);
            File.AppendAllText(path, "\nCreated on: " + DateTime.Now + "\n \n");

            Console.WriteLine("File created successfully!");
            Console.WriteLine("Path    : " + Path.GetFullPath(path));
            Console.WriteLine("Content : " + File.ReadAllText(path));
        }

        static void Q2_CreateFileAndReadBack()
        {
            Console.WriteLine("\nQ2: Read the file back\n");
            if (!File.Exists(path))
            {
                Console.WriteLine("File does not exist yet. Please run Task 1 first.");
                return;
            }
            string readBack = File.ReadAllText(path);
            Console.WriteLine("File contents:");
            Console.WriteLine(readBack);
        }

        static void Q3_WriteArrayToFile()
        {
            Console.WriteLine("\nQ3: Write array of strings to file \n");

            string[] fruits = { "Apple", "Banana", "Cherry", "Mango", "Pineapple" };
            File.AppendAllLines(path, fruits);
            Console.WriteLine();
            Console.WriteLine($"Written {fruits.Length} lines to {path}\n");

            Console.WriteLine("File contents:");
            foreach (string line in File.ReadAllLines(path))
                Console.WriteLine("  " + line);
        }

        static void Q4_AppendTextToFile()
        {
            Console.WriteLine("\nQ4: Append text to existing file \n");

            File.AppendAllText(path, "\nApplication Log: \n");
            Console.WriteLine("File created.\n");
            File.AppendAllText(path, $"[{DateTime.Now:HH:mm:ss}]  Record saved.\n");

            Console.WriteLine("Text appended. Full file now:\n");
            Console.WriteLine(File.ReadAllText(path));
        }

        static void Q5_ReadFirstLine()
        {
            Console.WriteLine("\nQ5: Read first line from file \n");

            File.AppendAllLines(path, new[] { "First Line", "Second Line", "Third Line" });

            string m1 = File.ReadLines(path).First();
            Console.WriteLine("Method 1 - ReadLines + LINQ: " + m1);

            using (StreamReader reader = new StreamReader(path))
                Console.WriteLine("Method 2 - StreamReader : " + reader.ReadLine());

            Console.WriteLine("Method 3 - ReadAllLines[0] : " + File.ReadAllLines(path)[0]);
        }
        static void Q6_CountLines()
        {
            Console.WriteLine("\nQ6: Count lines in a file \n");

            File.WriteAllLines(path, new[] { "Line 1", "Line 2", "Line 3", "Line 4", "Line 5" });

            Console.WriteLine("Method 1 (ReadAllLines.Length) : " + File.ReadAllLines(path).Length);

            Console.WriteLine("Method 2 (ReadLines + Count)   : " + File.ReadLines(path).Count());

            int count = 0;
            using (StreamReader r = new StreamReader(path))
                while (r.ReadLine() != null) count++;
            Console.WriteLine("Method 3 (StreamReader loop)   : " + count);

            int nonEmpty = File.ReadLines(path).Count(l => !string.IsNullOrWhiteSpace(l));
            Console.WriteLine("Non-empty lines only           : " + nonEmpty);
        }
    }
}
