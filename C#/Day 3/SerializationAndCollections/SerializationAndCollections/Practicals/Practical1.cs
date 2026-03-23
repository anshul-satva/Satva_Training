using SerializationAndCollections.Models;
using SerializationAndCollections.Services;
using SerializationAndCollections.Models;

namespace SerializationAndCollections.Practicals
{
    public class Practical1
    {
        public static void Run()
        {
            Person anshul = new Person
            {
                Name = "Anshul",
                Age = 20,
                City = new City
                {
                    Name = "Ahmedabad",
                    Population = 8000000
                }
            };

            Person virat = new Person
            {
                Name = "Virat",
                Age = 25,
                City = new City
                {
                    Name = "Delhi",
                    Population = 9000000
                }
            };

            List<Person> persons = new List<Person> { anshul, virat };

            string folderPath = @"C:\Users\Admin\Desktop\Training\C#\Day 3";
            Directory.CreateDirectory(folderPath);

            string jsonPath = Path.Combine(folderPath, "person.json");
            string xmlPath = Path.Combine(folderPath, "person.xml");

            JsonService.SavePerson(persons, jsonPath);

            List<Person> loaded = JsonService.LoadPerson(jsonPath);

            Console.WriteLine("JSON Deserialized Data:");

            foreach (var p in loaded)
            {
                Console.WriteLine(p);
            }

            XmlService.SavePerson(persons, xmlPath);

            Console.WriteLine("XML file created successfully.");
        }
    }
}