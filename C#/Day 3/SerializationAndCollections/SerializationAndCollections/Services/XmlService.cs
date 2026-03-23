using System.Xml.Serialization;
using SerializationAndCollections.Models;

namespace SerializationAndCollections.Services
{
    public class XmlService
    {
        public static void SavePerson(List<Person> persons, string path)
        {
            XmlSerializer serializer = new XmlSerializer(typeof(List<Person>));

            using (FileStream fs = new FileStream(path, FileMode.Create))
            {
                serializer.Serialize(fs, persons);
            }
        }
    }
}