using System;
using System.Text;

namespace MultipleChoice_Quiz
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            string name;
            while (true)
            {
                Console.Write("Hello, Enter Your Name: ");
                name = Console.ReadLine().Trim();

                if (!string.IsNullOrEmpty(name) && name.All(char.IsLetter))
                    break;

                Console.WriteLine("Invalid name. Use letters only and name should be non empty");
            }

            Console.WriteLine($"Welcome {name} to the Multiple Choice Quiz.");

            string[] questions =
            {
                "Which language is used for .NET development?",
                "What is the latest version of C#?",
                "What is the purpose of the 'using' statement in C#?",
                "What is the output of the following code snippet: Console.WriteLine(5 + 3 * 2);",
                "Which of the following is a value type in C#?",
                "Which of the following is a reference type in C#?",
                "What is the purpose of the 'async' keyword in C#?",
                "Which of the following is a valid way to declare a variable in C#?",
                "What is the output of the following code snippet: Console.WriteLine(\"Hello\" + \" World\");",
                "Which of the following is a valid way to create an instance of a class in C#?"
            };

            string[,] options =
            {
                { "A) C#", "B) Java", "C) Python", "D) JavaScript" },

                { "A) C# 7.0", "B) C# 8.0", "C) C# 9.0", "D) C# 10.0" },

                { "A) To define a block of code that will be executed when an exception occurs",
                    "B) To ensure that a block of code is executed at least once",
                    "C) To automatically dispose of resources when they are no longer needed",
                    "D) To create a new scope for variables" },

                { "A) 16", "B) 13", "C) 11", "D) 10" },

                { "A) int", "B) string", "C) bool", "D) object" },

                { "A) int", "B) string", "C) bool", "D) object" },

                { "A) To indicate that a method is asynchronous and can be awaited",
                    "B) To indicate that a method is a generator",
                    "C) To indicate that a method is an extension method",
                    "D) To indicate that a method is an iterator" },

                { "A) int x = 5;", "B) string name = \"John\";", "C) bool isActive = true;", "D) All of the above" },

                { "A) HelloWorld", "B) Hello World", "C) Hello World!", "D) Hello + World" },

                { "A) MyClass obj = MyClass();", "B) MyClass obj = new MyClass();", "C) MyClass obj;", "D) MyClass obj = new();" }
            };

            char[] answers = { 'A', 'D', 'C', 'C', 'A', 'D', 'A', 'D', 'B', 'B' };

            int score = 0;

            Random rand = new Random();
            for (int i = questions.Length - 1; i > 0; i--)
            {
                int j = rand.Next(i + 1);

                string tempQuestion = questions[i];
                questions[i] = questions[j];
                questions[j] = tempQuestion;

                char tempAnswer = answers[i];
                answers[i] = answers[j];
                answers[j] = tempAnswer;

                for (int k = 0; k < 4; k++)
                {
                    string tempOption = options[i, k];
                    options[i, k] = options[j, k];
                    options[j, k] = tempOption;
                }
            }

            for (int i = 0; i < questions.Length; i++)
            {
                Console.WriteLine($"\nQuestion {i + 1}: {questions[i]}");

                for (int j = 0; j < 4; j++)
                {
                    Console.WriteLine(options[i, j]);
                }

                Console.Write("Enter your answer (A, B, C, D): ");

                while (true)
                {
                    string input = Console.ReadLine().Trim().ToUpper();

                    if (input.Length == 1 && "ABCD".Contains(input))
                    {
                        char userAnswer = input[0];

                        if (userAnswer == answers[i])
                        {
                            Console.WriteLine("Your answer is Correct");
                            score++;
                        }
                        else
                        {
                            Console.WriteLine($"Your answer is Wrong, Correct answer is {answers[i]}");
                        }

                        break;
                    }
                    else
                    {
                        Console.WriteLine("Invalid input. Please enter A, B, C, or D.");
                    }
                }
            }

            Console.WriteLine($"\n{name}, your final score is: {score} out of {questions.Length}");

            double percentage = ((double)score / questions.Length) * 100;

            if (percentage >= 70)
            {
                Console.WriteLine($"Result: Pass, Your percentage score is - {percentage:F2}%");
            }
            else
            {
                Console.WriteLine($"Result: Fail, Your percentage score is - {percentage:F2}%");
            }
        }
    }
}
