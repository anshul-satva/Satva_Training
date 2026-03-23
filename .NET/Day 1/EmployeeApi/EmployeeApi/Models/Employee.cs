namespace EmployeeApi.Models
{
    public class Employee
    {
        public int Id { get; set; }

        public string Name { get; set; } = "";

        public string JobTitle { get; set; } = "";

        public string Mobile { get; set; } = "";

        public string ReportingManager { get; set; } = "";

        public DateTime JoiningDate { get; set; }
    }
}