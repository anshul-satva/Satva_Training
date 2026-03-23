using Microsoft.Data.SqlClient;
using StudentAPI.Models;
using System.Reflection.PortableExecutable;

namespace StudentAPI.Services
{
    public class StudentAdoService
    {
        private readonly string _connectionString;

        public StudentAdoService(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("DefaultConnection")!;
        }

        public async Task<List<Student>> GetAllStudentsAsync()
        {
            var students = new List<Student>();

            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            using var command = new SqlCommand("SELECT * FROM Students", connection);
            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                students.Add(new Student
                {
                    Id = reader.GetGuid(reader.GetOrdinal("Id")),       
                    Name = reader.GetString(reader.GetOrdinal("Name")),
                    Email = reader.GetString(reader.GetOrdinal("Email")),
                    Age = reader.GetInt32(reader.GetOrdinal("Age")),
                    Course = reader.GetString(reader.GetOrdinal("Course")),
                    CreatedAt = reader.GetDateTime(reader.GetOrdinal("CreatedAt"))
                });
            }

            return students;
        }

        public async Task<bool> CreateStudentAsync(Student student)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            var sql = @"INSERT INTO Students (Name, Email, Age, Course, CreatedAt) 
                        VALUES (@Name, @Email, @Age, @Course, @CreatedAt)";

            using var command = new SqlCommand(sql, connection);
            command.Parameters.AddWithValue("@Name", student.Name);
            command.Parameters.AddWithValue("@Email", student.Email);
            command.Parameters.AddWithValue("@Age", student.Age);
            command.Parameters.AddWithValue("@Course", student.Course);
            command.Parameters.AddWithValue("@CreatedAt", DateTime.Now);

            int rowsAffected = await command.ExecuteNonQueryAsync();
            return rowsAffected > 0;
        }
    }
}