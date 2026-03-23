using Newtonsoft.Json;
using SerializationAndCollections.Models;

namespace SerializationAndCollections.Services
{
    public class JsonService
    {
        public static void SavePerson(List<Person> persons, string path)
        {
            string json = JsonConvert.SerializeObject(persons, Formatting.Indented);
            File.WriteAllText(path, json);
        }

        public static List<Person> LoadPerson(string path)
        {
            string json = File.ReadAllText(path);
            return JsonConvert.DeserializeObject<List<Person>>(json);
        }
    }
}