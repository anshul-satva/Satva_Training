using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using SerializationAndCollections.Models;

namespace SerializationAndCollections.Practicals
{
    internal class Practical3
    {
        public static void Run()
        {
            string folderPath = @"C:\Users\Admin\Desktop\Training\C#\Day 3";
            Directory.CreateDirectory(folderPath);
            string filePath = Path.Combine(folderPath, "students.txt");

            List<Student> students = LoadStudents(filePath);

            int choice = -1;

            while (choice != 0)
            {
                Console.WriteLine("\n--- Student Management ---");
                Console.WriteLine("1. Admit Student");
                Console.WriteLine("2. Remove Student");
                Console.WriteLine("3. Show Students");
                Console.WriteLine("4. Total Students");
                Console.WriteLine("5. Give Award");
                Console.WriteLine("0. Exit");

                while (true)
                {
                    Console.Write("Enter choice: ");

                    if (!int.TryParse(Console.ReadLine(), out choice))
                    {
                        Console.WriteLine("Invalid input. Enter a number.");
                        continue;
                    }

                    if (choice < 0 || choice > 5)
                    {
                        Console.WriteLine("Invalid choice. Enter between 0 and 5.");
                        continue;
                    }

                    break;
                }

                switch (choice)
                {
                    case 1:
                        AdmitStudent(students, filePath);
                        break;

                    case 2:
                        RemoveStudent(students, filePath);
                        break;

                    case 3:
                        ShowStudents(students);
                        break;

                    case 4:
                        Console.WriteLine($"Total Students: {students.Count}");
                        break;

                    case 5:
                        GiveAward(students, filePath);
                        break;

                    case 0:
                        Console.WriteLine("Exiting...");
                        break;
                }
            }
        }

        static void AdmitStudent(List<Student> students, string path)
        {
            string name;

            while (true)
            {
                Console.Write("Enter Student Name: ");
                name = Console.ReadLine();

                if (string.IsNullOrWhiteSpace(name))
                    Console.WriteLine("Name cannot be empty.");
                else if (!System.Text.RegularExpressions.Regex.IsMatch(name, @"^[a-zA-Z\s]+$"))
                    Console.WriteLine("Name must contain only letters. Please re-enter.");
                else
                    break;
            }

            int newId = students.Count == 0 ? 1 : students.Max(s => s.Id) + 1;

            students.Add(new Student
            {
                Id = newId,
                Name = name,
                IsAwarded = false
            });

            SaveStudents(path, students);

            Console.WriteLine($"Student admitted. ID assigned: {newId}");
        }

        static void RemoveStudent(List<Student> students, string path)
        {
            Console.Write("Enter Student ID to remove: ");

            if (!int.TryParse(Console.ReadLine(), out int id))
            {
                Console.WriteLine("Invalid ID.");
                return;
            }

            var student = students.FirstOrDefault(s => s.Id == id);

            if (student != null)
            {
                students.Remove(student);
                SaveStudents(path, students);
                Console.WriteLine("Student removed.");
            }
            else
            {
                Console.WriteLine("Student not found.");
            }
        }

        static void GiveAward(List<Student> students, string path)
        {
            Console.Write("Enter Student ID for award: ");

            if (!int.TryParse(Console.ReadLine(), out int id))
            {
                Console.WriteLine("Invalid ID.");
                return;
            }

            var student = students.FirstOrDefault(s => s.Id == id);

            if (student != null)
            {
                student.IsAwarded = true;
                SaveStudents(path, students);
                Console.WriteLine($"{student.Name} received award.");
            }
            else
            {
                Console.WriteLine("Student not found.");
            }
        }

        static void ShowStudents(List<Student> students)
        {
            if (students.Count == 0)
            {
                Console.WriteLine("No students available.");
                return;
            }

            foreach (var s in students)
            {
                Console.WriteLine($"ID: {s.Id} | Name: {s.Name} | Awarded: {s.IsAwarded}");
            }
        }

        static void SaveStudents(string path, List<Student> students)
        {
            List<string> lines = new List<string>();

            foreach (var s in students)
            {
                lines.Add($"{s.Id}|{s.Name}|{s.IsAwarded}");
            }

            File.WriteAllLines(path, lines);
        }

        static List<Student> LoadStudents(string path)
        {
            List<Student> students = new List<Student>();

            if (!File.Exists(path))
                return students;

            var lines = File.ReadAllLines(path);

            foreach (var line in lines)
            {
                if (string.IsNullOrWhiteSpace(line))
                    continue;

                var parts = line.Split('|');

                if (parts.Length != 3)
                    continue;

                students.Add(new Student
                {
                    Id = int.Parse(parts[0]),
                    Name = parts[1],
                    IsAwarded = bool.Parse(parts[2])
                });
            }

            return students;
        }
    }
}