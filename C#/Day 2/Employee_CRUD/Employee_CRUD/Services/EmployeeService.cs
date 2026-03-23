using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;

public class EmployeeService
{
    private readonly string _filePath;
    private readonly JsonSerializerOptions _opts;
    private List<Employee> _employees;

    public EmployeeService(string filePath)
    {
        _filePath = filePath;
        _opts = new JsonSerializerOptions { WriteIndented = true };
        _employees = LoadFromFile();
    }
    
    private List<Employee> LoadFromFile()
    {
        if (!File.Exists(_filePath)) return new List<Employee>();
        try
        {
            string json = File.ReadAllText(_filePath);
            return JsonSerializer.Deserialize<List<Employee>>(json) ?? new List<Employee>();
        }
        catch
        {
            Console.WriteLine("Could not load data file. Starting fresh.");
            return new List<Employee>();
        }
    }

    private void SaveToFile()
    {
        File.WriteAllText(_filePath, JsonSerializer.Serialize(_employees, _opts));
    }

    private int GetNextId()
        => _employees.Count == 0 ? 1 : _employees.Max(e => e.Id) + 1;

    public bool EmailExists(string email, int excludeId = 0)
        => _employees.Any(e => e.Id != excludeId &&
               e.Email.Equals(email, StringComparison.OrdinalIgnoreCase));

    public (bool Success, string Message) Add(Employee emp)
    {
        emp.Id = GetNextId();
        emp.CreatedAt = DateTime.Now;
        _employees.Add(emp);
        SaveToFile();
        return (true, $"Employee added successfully! Assigned ID: {emp.Id}");
    }

    public List<Employee> GetAll() => _employees;
    public Employee GetById(int id) => _employees.FirstOrDefault(e => e.Id == id);
    public Employee GetByEmail(string email) => _employees.FirstOrDefault(e =>
                                                          e.Email.Equals(email, StringComparison.OrdinalIgnoreCase));

    public (bool Success, string Message) Update(int id, Employee updated)
    {
        Employee existing = GetById(id);
        if (existing == null)
            return (false, $"No employee found with ID {id}.");

        existing.FirstName = updated.FirstName;
        existing.LastName = updated.LastName;
        existing.Gender = updated.Gender;
        existing.Email = updated.Email;
        existing.Phone = updated.Phone;
        existing.Designation = updated.Designation;
        existing.Salary = updated.Salary;

        SaveToFile();
        return (true, "Employee updated successfully.");
    }

    public (bool Success, string Message) Delete(int id)
    {
        Employee emp = GetById(id);
        if (emp == null)
            return (false, $"No employee found with ID {id}.");

        _employees.Remove(emp);
        SaveToFile();
        return (true, $"Employee '{emp.FullName}' deleted successfully.");
    }
}