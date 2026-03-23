using SerializationAndCollections.Models;

namespace SerializationAndCollections.Models
{
    public class Person
    {
        public string Name { get; set; }
        public int Age { get; set; }
        public City City { get; set; }
        public override string ToString()
        {
            return $" \nName: {Name} \n" +
                $"Age: {Age} \n" +
                $"City: {City?.Name} \n" +
                $"Population: {City?.Population} \n";
        }
    }
}