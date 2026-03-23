using StudentAPI.Models;

namespace StudentAPI.Services
{
    public interface IStudentService
    {
        Task<List<Student>> GetAllAsync();
        Task<Student?> GetByIdAsync(Guid id);
        Task<Student> CreateAsync(Student student);
        Task<Student?> UpdateAsync(Guid id, Student student);
        Task<bool> DeleteAsync(Guid id);
    }
}