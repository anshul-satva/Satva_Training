namespace SerializationAndCollections.Models
{
    public class Student
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public bool IsAwarded { get; set; }

        public override string ToString()
        {
            return $"ID: {Id} | Name: {Name} | Awarded: {IsAwarded}";
        }
    }
}