namespace EmployeeApp.Models
{
    public enum Department
    {
        Sales,        // Red
        Marketing,    // Green
        Development,  // Black
        QA,           // Blue
        HR,           // Orange
        SEO           // Pink
    }

    public static class DepartmentExtensions
    {
        public static string GetColor(this Department dept)
        {
            return dept switch
            {
                Department.Sales => "Red",
                Department.Marketing => "Green",
                Department.Development => "Black",
                Department.QA => "Blue",
                Department.HR => "Orange",
                Department.SEO => "Pink",
                _ => "Black"
            };
        }
    }
}